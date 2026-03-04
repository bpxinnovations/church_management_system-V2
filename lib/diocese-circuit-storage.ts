'use client';

import { generateId } from './rbac-storage';

export interface Circuit {
  id: string;
  name: string;
  code?: string;
  superintendentId?: string;
  /** Area (e.g. Greater Accra, Ashanti) */
  area?: string;
  /** Full address of circuit office */
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
  /** Number of circuit societies */
  societyCount?: number;
  /** Date circuit was established (YYYY or ISO date) */
  establishedDate?: string;
  createdAt: string;
}

export interface Society {
  id: string;
  circuitId: string;
  name: string;
  location?: string;
  address?: string;
  contactPhone?: string;
  memberCount: number;
  ministerId?: string;
  createdAt: string;
}

export type MinisterType = 'superintendent' | 'minister' | 'caretaker';

export interface Minister {
  id: string;
  name: string;
  type: MinisterType;
  title?: string;
  email?: string;
  phone?: string;
  notes?: string;
  /** Base64 data URL for profile photo (resized for storage) */
  imageDataUrl?: string;
  /** Full address */
  address?: string;
  /** Date or year of ordination */
  dateOfOrdination?: string;
  /** Education (e.g. degree, institution, year) */
  education?: string;
  /** Languages spoken (comma-separated) */
  languages?: string;
  /** Ministry statement or bio */
  ministryStatement?: string;
  /** Start of current appointment (YYYY or ISO date) */
  appointmentStart?: string;
  gender?: string;
}

export interface SocietyLevy {
  id: string;
  societyId: string;
  amount: number;
  period: string;
  paidAt?: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface SocietyReport {
  id: string;
  societyId: string;
  title: string;
  period: string;
  uploadedAt: string;
  fileRef?: string;
}

export interface SocietyBudgetRequest {
  id: string;
  societyId: string;
  title: string;
  amount: number;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
}

export interface CircuitFinancialSummary {
  circuitId: string;
  period: string;
  totalIncome: number;
  totalExpenditure: number;
  balance: number;
}

const CIRCUITS_KEY = 'church_admin_circuits';
const SOCIETIES_KEY = 'church_admin_societies';
const MINISTERS_KEY = 'church_admin_ministers';
const LEVIES_KEY = 'church_admin_society_levies';
const REPORTS_KEY = 'church_admin_society_reports';
const BUDGET_REQUESTS_KEY = 'church_admin_budget_requests';
const CIRCUIT_FINANCE_KEY = 'church_admin_circuit_finance';

function getDefaultCircuits(): Circuit[] {
  return [
    { id: 'circuit-1', name: 'Accra Central Circuit', code: 'ACC', area: 'Greater Accra', societyCount: 2, createdAt: new Date().toISOString() },
    { id: 'circuit-2', name: 'Kumasi North Circuit', code: 'KNC', area: 'Ashanti', societyCount: 1, createdAt: new Date().toISOString() },
  ];
}

function getDefaultSocieties(): Society[] {
  return [
    { id: 'soc-1', circuitId: 'circuit-1', name: 'Bethel Society', location: 'Accra Central', memberCount: 120, createdAt: new Date().toISOString() },
    { id: 'soc-2', circuitId: 'circuit-1', name: 'Emmanuel Society', location: 'East Legon', memberCount: 85, createdAt: new Date().toISOString() },
    { id: 'soc-3', circuitId: 'circuit-2', name: 'Grace Society', location: 'Kumasi', memberCount: 95, createdAt: new Date().toISOString() },
  ];
}

function getDefaultMinisters(): Minister[] {
  return [
    { id: 'min-1', name: 'Rev. John Mensah', type: 'superintendent', title: 'Reverend', email: 'jmensah@church.com', phone: '+233 20 123 4567', education: 'BD, Trinity Theological Seminary', dateOfOrdination: '2010', languages: 'English, Ga, Twi' },
    { id: 'min-2', name: 'Rev. Grace Asante', type: 'minister', title: 'Reverend', email: 'gasante@church.com', phone: '+233 24 234 5678' },
    { id: 'min-3', name: 'Rev. David Osei', type: 'minister', title: 'Reverend', email: 'dosei@church.com' },
    { id: 'min-4', name: 'Bro. James Owusu', type: 'caretaker', title: 'Brother', phone: '+233 55 345 6789' },
  ];
}

function getFromStorage<T>(key: string, defaults: T[]): T[] {
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw) as T[];
    if (!Array.isArray(parsed)) {
      localStorage.setItem(key, JSON.stringify(defaults));
      return defaults;
    }
    return parsed;
  } catch {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
}

function saveToStorage(key: string, data: unknown[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function getCircuits(): Circuit[] {
  return getFromStorage(CIRCUITS_KEY, getDefaultCircuits());
}

export function saveCircuits(circuits: Circuit[]): void {
  saveToStorage(CIRCUITS_KEY, circuits);
}

export function getCircuitById(id: string): Circuit | undefined {
  return getCircuits().find((c) => c.id === id);
}

export function getSocieties(): Society[] {
  return getFromStorage(SOCIETIES_KEY, getDefaultSocieties());
}

export function getSocietiesByCircuitId(circuitId: string): Society[] {
  return getSocieties().filter((s) => s.circuitId === circuitId);
}

export function saveSocieties(societies: Society[]): void {
  saveToStorage(SOCIETIES_KEY, societies);
}

export function getSocietiesByCircuit(circuitId: string): Society[] {
  return getSocieties().filter((s) => s.circuitId === circuitId);
}

export function getMinisters(): Minister[] {
  return getFromStorage(MINISTERS_KEY, getDefaultMinisters());
}

export function getSuperintendents(): Minister[] {
  return getMinisters().filter((m) => m.type === 'superintendent');
}

/** Ministers and caretakers (for assigning to societies) */
export function getSocietyMinisters(): Minister[] {
  return getMinisters().filter((m) => m.type === 'minister' || m.type === 'caretaker');
}

export function saveMinisters(ministers: Minister[]): void {
  saveToStorage(MINISTERS_KEY, ministers);
}

export function getLevies(): SocietyLevy[] {
  return getFromStorage(LEVIES_KEY, []);
}

export function getLeviesBySocietyId(societyId: string): SocietyLevy[] {
  return getLevies().filter((l) => l.societyId === societyId);
}

export function saveLevies(levies: SocietyLevy[]): void {
  saveToStorage(LEVIES_KEY, levies);
}

export function getSocietyReports(): SocietyReport[] {
  return getFromStorage(REPORTS_KEY, []);
}

export function saveSocietyReports(reports: SocietyReport[]): void {
  saveToStorage(REPORTS_KEY, reports);
}

export function getBudgetRequests(): SocietyBudgetRequest[] {
  return getFromStorage(BUDGET_REQUESTS_KEY, []);
}

export function getBudgetRequestsByCircuit(circuitId: string): SocietyBudgetRequest[] {
  const societies = getSocietiesByCircuitId(circuitId);
  const societyIds = new Set(societies.map((s) => s.id));
  return getBudgetRequests().filter((r) => societyIds.has(r.societyId));
}

export function saveBudgetRequests(requests: SocietyBudgetRequest[]): void {
  saveToStorage(BUDGET_REQUESTS_KEY, requests);
}

export function getCircuitFinancialSummaries(): CircuitFinancialSummary[] {
  return getFromStorage(CIRCUIT_FINANCE_KEY, []);
}

export function saveCircuitFinancialSummaries(summaries: CircuitFinancialSummary[]): void {
  saveToStorage(CIRCUIT_FINANCE_KEY, summaries);
}

export function createCircuit(data: Omit<Circuit, 'id' | 'createdAt'>): Circuit {
  const circuits = getCircuits();
  const circuit: Circuit = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  saveCircuits([...circuits, circuit]);
  return circuit;
}

export function updateCircuit(id: string, data: Partial<Circuit>): Circuit | undefined {
  const circuits = getCircuits();
  const idx = circuits.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  circuits[idx] = { ...circuits[idx], ...data };
  saveCircuits(circuits);
  return circuits[idx];
}

export function createSociety(data: Omit<Society, 'id' | 'createdAt'>): Society {
  const societies = getSocieties();
  const society: Society = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  saveSocieties([...societies, society]);
  return society;
}

export function updateSociety(id: string, data: Partial<Society>): Society | undefined {
  const societies = getSocieties();
  const idx = societies.findIndex((s) => s.id === id);
  if (idx === -1) return undefined;
  societies[idx] = { ...societies[idx], ...data };
  saveSocieties(societies);
  return societies[idx];
}

export function createMinister(data: Omit<Minister, 'id'>): Minister {
  const ministers = getMinisters();
  const minister: Minister = { ...data, id: generateId() };
  saveMinisters([...ministers, minister]);
  return minister;
}

export function updateMinister(id: string, data: Partial<Minister>): Minister | undefined {
  const ministers = getMinisters();
  const idx = ministers.findIndex((m) => m.id === id);
  if (idx === -1) return undefined;
  ministers[idx] = { ...ministers[idx], ...data };
  saveMinisters(ministers);
  return ministers[idx];
}
