'use client';

export type CheckInMethod = 'head_count' | 'fingerprint' | 'qr';

export type CheckInGender = 'male' | 'female';

export interface IndividualCheckIn {
  id: string;
  memberName: string;
  churchNumber?: string;
  gender?: CheckInGender; // male | female for breakdown
  service: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // ISO string
  method: CheckInMethod;
}

const STORAGE_KEY = 'church_attendance_checkins';

function getCheckIns(): IndividualCheckIn[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCheckIns(checkIns: IndividualCheckIn[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checkIns));
}

export function addCheckIn(checkIn: Omit<IndividualCheckIn, 'id'>): IndividualCheckIn {
  const list = getCheckIns();
  const newOne: IndividualCheckIn = {
    ...checkIn,
    id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  };
  list.unshift(newOne);
  saveCheckIns(list);
  return newOne;
}

export function getCheckInsForServiceAndDate(service: string, date: string): IndividualCheckIn[] {
  return getCheckIns().filter((c) => c.service === service && c.date === date);
}

export function getAllCheckIns(): IndividualCheckIn[] {
  return getCheckIns();
}

export function generateCheckInUrl(service: string, date: string): string {
  if (typeof window === 'undefined') return '';
  const base = window.location.origin;
  return `${base}/attendance/checkin?service=${encodeURIComponent(service)}&date=${encodeURIComponent(date)}`;
}
