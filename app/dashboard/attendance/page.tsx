"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  HiCheckCircle,
  HiOutlineCalendar,
  HiOutlineUsers,
  HiUserGroup,
  HiFingerPrint,
  HiQrcode,
} from "react-icons/hi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  DatePicker,
  Row,
  Col,
  InputNumber,
  Input,
  Select,
  Button as AntButton,
  Drawer,
} from "antd";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from "@mui/material";
import {
  ManOutlined,
  WomanOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useAuth } from "@/lib/auth-context";
import {
  getAllCheckIns,
  generateCheckInUrl,
  type IndividualCheckIn,
} from "@/lib/attendance-storage";



interface AttendanceRecord {
  id: number;
  service: string;
  date: string;
  men: number;
  women: number;
  children: number;
  total: number;
  notes?: string;
}

const INITIAL_RECORDS: AttendanceRecord[] = [
  {
    id: 1,
    service: "Sunday Service",
    date: "2024-01-21",
    men: 32,
    women: 55,
    children: 15,
    total: 102,
    notes: "Regular service",
  },
  {
    id: 2,
    service: "Sunday Service",
    date: "2024-01-14",
    men: 30,
    women: 50,
    children: 12,
    total: 92,
    notes: "Regular service",
  },
  {
    id: 3,
    service: "Sunday Service",
    date: "2024-01-07",
    men: 28,
    women: 48,
    children: 10,
    total: 86,
  },
  {
    id: 4,
    service: "Sunday Service",
    date: "2023-12-31",
    men: 45,
    women: 65,
    children: 20,
    total: 130,
    notes: "New Year's Eve service",
  },
  {
    id: 5,
    service: "Sunday Service",
    date: "2023-12-24",
    men: 60,
    women: 80,
    children: 35,
    total: 175,
    notes: "Christmas Eve service",
  },
  {
    id: 6,
    service: "Midweek Service",
    date: "2024-01-17",
    men: 18,
    women: 28,
    children: 6,
    total: 52,
  },
  {
    id: 7,
    service: "Midweek Service",
    date: "2024-01-10",
    men: 15,
    women: 25,
    children: 5,
    total: 45,
  },
  {
    id: 8,
    service: "Midweek Service",
    date: "2024-01-03",
    men: 12,
    women: 22,
    children: 4,
    total: 38,
  },
  {
    id: 9,
    service: "Midweek Service",
    date: "2023-12-27",
    men: 10,
    women: 18,
    children: 3,
    total: 31,
  },
  {
    id: 10,
    service: "Youth Meeting",
    date: "2024-01-19",
    men: 10,
    women: 15,
    children: 18,
    total: 43,
  },
  {
    id: 11,
    service: "Youth Meeting",
    date: "2024-01-12",
    men: 8,
    women: 12,
    children: 15,
    total: 35,
  },
  {
    id: 12,
    service: "Youth Meeting",
    date: "2024-01-05",
    men: 9,
    women: 14,
    children: 16,
    total: 39,
  },
  {
    id: 13,
    service: "Daily Mass",
    date: "2024-01-20",
    men: 5,
    women: 12,
    children: 2,
    total: 19,
  },
  {
    id: 14,
    service: "Daily Mass",
    date: "2024-01-19",
    men: 6,
    women: 14,
    children: 3,
    total: 23,
  },
  {
    id: 15,
    service: "Daily Mass",
    date: "2024-01-18",
    men: 4,
    women: 10,
    children: 1,
    total: 15,
  },
  {
    id: 16,
    service: "Daily Mass",
    date: "2024-01-17",
    men: 7,
    women: 15,
    children: 4,
    total: 26,
  },
];

const SERVICES = [
  { id: "evening", name: "Evening Service" },
  { id: "1st", name: "1st Service" },
  { id: "2nd", name: "2nd Service" },
  { id: "joint", name: "Joint Service" },
];

const PATTERN_STYLES = [
  {
    background:
      "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  },
  {
    background:
      "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2316a34a' fill-opacity='0.08'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E\")",
  },
  {
    background:
      "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q25 30, 50 50 T100 50' stroke='%2316a34a' stroke-width='1.5' fill='none' opacity='0.12'/%3E%3C/svg%3E\")",
  },
];

type AttendanceTab = 'head_count' | 'fingerprint' | 'qr';

export default function AttendancePage() {
  const { hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<AttendanceTab>('head_count');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_RECORDS);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [form] = Form.useForm();
  const [individualCheckIns, setIndividualCheckIns] = useState<IndividualCheckIn[]>([]);
  const [qrService, setQrService] = useState(SERVICES[0]?.id ?? '1st');
  const [qrDate, setQrDate] = useState(dayjs());
  // Filter to view check-ins for a specific service & date (e.g. "This Sunday's 1st Service")
  const [viewFilterService, setViewFilterService] = useState<string>('all');
  const [viewFilterDate, setViewFilterDate] = useState<string | null>(null);
  const [checkInPage, setCheckInPage] = useState(0);
  const [checkInRowsPerPage, setCheckInRowsPerPage] = useState(10);

  useEffect(() => {
    setIndividualCheckIns(getAllCheckIns());
  }, [activeTab, showRecordModal]);

  useEffect(() => {
    setCheckInPage(0);
  }, [viewFilterService, viewFilterDate]);

  // Filtered individual check-ins by service & date (fingerprint + QR together)
  const filteredCheckIns = useMemo(() => {
    let list = individualCheckIns;
    if (viewFilterService !== 'all') {
      const serviceName = SERVICES.find((s) => s.id === viewFilterService)?.name ?? viewFilterService;
      list = list.filter((c) => c.service === serviceName);
    }
    if (viewFilterDate) {
      list = list.filter((c) => c.date === viewFilterDate);
    }
    return list;
  }, [individualCheckIns, viewFilterService, viewFilterDate]);

  const checkInStats = useMemo(() => {
    const total = filteredCheckIns.length;
    const fingerprint = filteredCheckIns.filter((c) => c.method === 'fingerprint').length;
    const qr = filteredCheckIns.filter((c) => c.method === 'qr').length;
    const male = filteredCheckIns.filter((c) => c.gender === 'male').length;
    const female = filteredCheckIns.filter((c) => c.gender === 'female').length;
    return { total, fingerprint, qr, male, female };
  }, [filteredCheckIns]);

  // Calculate totals safely
  const stats = useMemo(() => {
    const records = Array.isArray(attendanceRecords) ? attendanceRecords : [];
    return records.reduce(
      (acc, record) => ({
        men: acc.men + record.men,
        women: acc.women + record.women,
        children: acc.children + record.children,
        total: acc.total + record.total,
      }),
      { men: 0, women: 0, children: 0, total: 0 }
    );
  }, [attendanceRecords]);

  const handleRecordAttendance = useCallback(
    (values: {
      service: string;
      date: Dayjs;
      men: number;
      women: number;
      children: number;
      notes?: string;
    }) => {
      const service = SERVICES.find((s) => s.id === values.service);
      const men = Number(values.men) || 0;
      const women = Number(values.women) || 0;
      const children = Number(values.children) || 0;
      const total = men + women + children;

      const newRecord: AttendanceRecord = {
        id: Date.now(),
        service: service?.name || values.service,
        date: values.date.format("YYYY-MM-DD"),
        men,
        women,
        children,
        total,
        notes: values.notes,
      };

      setAttendanceRecords((prev) => [...(Array.isArray(prev) ? prev : []), newRecord]);
      setShowRecordModal(false);
      form.resetFields();
    },
    [form]
  );

  const handleCloseModal = useCallback(() => {
    setShowRecordModal(false);
    form.resetFields();
  }, [form]);

  // Safely sorted records (newest first)
  const sortedRecords = useMemo<AttendanceRecord[]>(() => {
    if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
      return [];
    }
    const records = [...attendanceRecords];
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [attendanceRecords]);

  // Ensure dataSource is always a valid array (Ant Design Table calls .slice on it)
  const tableData = useMemo<AttendanceRecord[]>(() => {
    if (!sortedRecords || !Array.isArray(sortedRecords)) {
      return [];
    }
    return [...sortedRecords];
  }, [sortedRecords]);

  // Safe dataSource for Ant Design: always a real array (Table calls .slice() on it)
  const headCountDataSource = useMemo(() => {
    const data = Array.isArray(tableData) ? tableData : [];
    return Array.isArray(data) ? [...data] : [];
  }, [tableData]);

  // Safe dataSource for check-ins table
  const checkInDataSource = useMemo(() => {
    const data = Array.isArray(filteredCheckIns) ? filteredCheckIns : [];
    return Array.isArray(data) ? [...data] : [];
  }, [filteredCheckIns]);

  const attendanceHeadCells = [
    { id: "date", label: "Date" },
    { id: "service", label: "Service" },
    { id: "men", label: "Men", align: "right" as const },
    { id: "women", label: "Women", align: "right" as const },
    { id: "children", label: "Children", align: "right" as const },
    { id: "total", label: "Total", align: "right" as const },
    { id: "notes", label: "Notes" },
  ];

  const qrUrl = useMemo(
    () => generateCheckInUrl(SERVICES.find((s) => s.id === qrService)?.name ?? qrService, qrDate.format('YYYY-MM-DD')),
    [qrService, qrDate]
  );
  const qrImageUrl = typeof window !== 'undefined' ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrUrl)}` : '';

  return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Attendance Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Head count, fingerprint check-in, or QR scan
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('head_count')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'head_count' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <HiOutlineUsers className="h-5 w-5" />
            Head count
          </button>
          <button
            onClick={() => setActiveTab('fingerprint')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'fingerprint' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <HiFingerPrint className="h-5 w-5" />
            Fingerprint check-in
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'qr' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <HiQrcode className="h-5 w-5" />
            QR check-in
          </button>
        </div>

        {/* Tab: Head count */}
        {activeTab === 'head_count' && (
          <>
            <div className="flex justify-end">
              {!hasRole('head_pastor') && (
                <Button
                  onClick={() => {
                    form.resetFields();
                    setShowRecordModal(true);
                  }}
                  className="shadow-lg"
                >
                  <PlusOutlined className="mr-2" />
                  Record head count
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0" style={{ backgroundImage: PATTERN_STYLES[0].background }} />
                <CardContent className="p-4 sm:p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Men</p>
                      <p className="text-lg sm:text-xl font-semibold text-gray-900">{stats.men.toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <ManOutlined className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0" style={{ backgroundImage: PATTERN_STYLES[1].background }} />
                <CardContent className="p-4 sm:p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Women</p>
                      <p className="text-lg sm:text-xl font-semibold text-gray-900">{stats.women.toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <WomanOutlined className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0" style={{ backgroundImage: PATTERN_STYLES[2].background }} />
                <CardContent className="p-4 sm:p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Children</p>
                      <p className="text-lg sm:text-xl font-semibold text-gray-900">{stats.children.toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <UserOutlined className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0" style={{ backgroundImage: PATTERN_STYLES[0].background }} />
              <CardContent className="p-4 sm:p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Attendance</p>
                    <p className="text-lg sm:text-xl font-semibold text-gray-900">{stats.total.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <HiUserGroup className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-base font-semibold text-gray-900">Head count history</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 overflow-x-auto">
                <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                  <Table size="small" stickyHeader aria-label="Head count history">
                    <TableHead>
                      <TableRow>
                        {attendanceHeadCells.map((cell) => (
                          <TableCell
                            key={cell.id}
                            align={cell.align ?? "left"}
                            sx={{ fontWeight: 600, backgroundColor: "grey.100" }}
                          >
                            {cell.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(Array.isArray(headCountDataSource) ? headCountDataSource : []).map((record) => (
                        <TableRow key={`attendance-${record.id}`} hover>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-gray-900">
                              <HiOutlineCalendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              {new Date(record.date).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium text-gray-900">{record.service}</span>
                          </TableCell>
                          <TableCell align="right">
                            <div className="flex items-center justify-end gap-2">
                              <ManOutlined className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-semibold text-gray-900">{record.men}</span>
                            </div>
                          </TableCell>
                          <TableCell align="right">
                            <div className="flex items-center justify-end gap-2">
                              <WomanOutlined className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-semibold text-gray-900">{record.women}</span>
                            </div>
                          </TableCell>
                          <TableCell align="right">
                            <div className="flex items-center justify-end gap-2">
                              <UserOutlined className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-semibold text-gray-900">{record.children}</span>
                            </div>
                          </TableCell>
                          <TableCell align="right">
                            <span className="text-sm font-bold text-green-600">{record.total}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-500">{record.notes || "—"}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* Tab: Fingerprint check-in */}
        {activeTab === 'fingerprint' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HiFingerPrint className="h-5 w-5 text-green-600" />
                Fingerprint check-in
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Check-in is recorded at the fingerprint device. Fingerprint check-ins appear in the table below (Individual check-ins).
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-sm">
                Use the filters in the Individual check-ins section to view fingerprint check-ins by service and date.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tab: QR check-in */}
        {activeTab === 'qr' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HiQrcode className="h-5 w-5 text-green-600" />
                QR code check-in
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Generate a QR code for a service. When members scan it, they enter their name and submit; time is recorded at submission.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <Select
                    size="large"
                    style={{ width: '100%' }}
                    value={qrService}
                    onChange={setQrService}
                    options={SERVICES.map((s) => ({ label: s.name, value: s.id }))}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <DatePicker
                    size="large"
                    style={{ width: '100%' }}
                    value={qrDate}
                    onChange={(d) => d && setQrDate(d)}
                    format="YYYY-MM-DD"
                  />
                </Col>
              </Row>
              <div className="flex flex-wrap items-start gap-6">
                <div className="bg-gray-50 rounded-xl p-4 inline-block">
                  {qrImageUrl ? (
                    <img src={qrImageUrl} alt="QR code for check-in" className="w-[220px] h-[220px] rounded-lg" />
                  ) : (
                    <div className="w-[220px] h-[220px] rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">QR</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 mb-1">Check-in link (share or display)</p>
                  <p className="text-sm text-gray-600 break-all font-mono bg-gray-100 p-2 rounded">{qrUrl || '—'}</p>
                  <p className="text-xs text-gray-500 mt-2">Members scan the QR or open this link, enter name (and optional church number), then submit. Time is recorded when they submit.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Individual check-ins: fingerprint + QR together (shown for fingerprint and QR tabs) */}
        {(activeTab === 'fingerprint' || activeTab === 'qr') && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">Individual check-ins (Fingerprint &amp; QR)</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Fingerprint and QR both record who attended. Members can use the fingerprint device at church or scan the QR and enter their details — all show here. Use the filter below to see a specific service and date (e.g. this Sunday&apos;s 1st Service).
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filter by service & date */}
              <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">View for:</span>
                <Select
                  size="middle"
                  style={{ width: 180 }}
                  value={viewFilterService}
                  onChange={setViewFilterService}
                  options={[
                    { label: 'All services', value: 'all' },
                    ...SERVICES.map((s) => ({ label: s.name, value: s.id })),
                  ]}
                />
                <DatePicker
                  size="middle"
                  placeholder="All dates"
                  format="YYYY-MM-DD"
                  value={viewFilterDate ? dayjs(viewFilterDate) : null}
                  onChange={(d) => setViewFilterDate(d ? d.format('YYYY-MM-DD') : null)}
                  allowClear
                  style={{ width: 160 }}
                />
                {(viewFilterService !== 'all' || viewFilterDate) && (
                  <button
                    type="button"
                    onClick={() => {
                      setViewFilterService('all');
                      setViewFilterDate(null);
                    }}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear filter
                  </button>
                )}
              </div>

              {/* Summary for this service/date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Total check-ins</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{checkInStats.total}</p>
                  <p className="text-xs text-gray-500 mt-1">Fingerprint + QR</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 bg-blue-50/50 border-blue-200">
                  <p className="text-xs text-gray-700 uppercase tracking-wide flex items-center gap-1">
                    <ManOutlined /> Male
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{checkInStats.male}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 bg-pink-50/50 border-pink-200">
                  <p className="text-xs text-gray-700 uppercase tracking-wide flex items-center gap-1">
                    <WomanOutlined /> Female
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{checkInStats.female}</p>
                </div>
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <p className="text-xs text-blue-700 uppercase tracking-wide">Fingerprint</p>
                  <p className="text-xl font-bold text-blue-900 mt-1">{checkInStats.fingerprint}</p>
                  <p className="text-xs text-blue-600 mt-1">At device</p>
                </div>
                <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                  <p className="text-xs text-green-700 uppercase tracking-wide">QR scan</p>
                  <p className="text-xl font-bold text-green-900 mt-1">{checkInStats.qr}</p>
                  <p className="text-xs text-green-600 mt-1">Scanned &amp; submitted</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                {filteredCheckIns.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    {individualCheckIns.length === 0
                      ? 'No check-ins yet. Record via Fingerprint or have members scan the QR.'
                      : 'No check-ins match the selected service/date.'}
                  </p>
                ) : (
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                      <Table size="small" stickyHeader aria-label="Individual check-ins">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600, backgroundColor: "grey.100" }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600, backgroundColor: "grey.100" }}>Gender</TableCell>
                            <TableCell sx={{ fontWeight: 600, backgroundColor: "grey.100" }}>Church no.</TableCell>
                            <TableCell sx={{ fontWeight: 600, backgroundColor: "grey.100" }}>Service</TableCell>
                            <TableCell sx={{ fontWeight: 600, backgroundColor: "grey.100" }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 600, backgroundColor: "grey.100" }}>Check-in time</TableCell>
                            <TableCell sx={{ fontWeight: 600, backgroundColor: "grey.100" }}>Method</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(Array.isArray(checkInDataSource) ? checkInDataSource : [])
                            .slice(checkInPage * checkInRowsPerPage, checkInPage * checkInRowsPerPage + checkInRowsPerPage)
                            .map((r) => (
                              <TableRow key={r.id} hover>
                                <TableCell>
                                  <span className="font-medium text-gray-900">{r.memberName}</span>
                                </TableCell>
                                <TableCell>
                                  {r.gender ? (
                                    <span className={`inline-flex items-center gap-1 ${r.gender === "male" ? "text-blue-700" : "text-pink-700"}`}>
                                      {r.gender === "male" ? <ManOutlined className="h-4 w-4" /> : <WomanOutlined className="h-4 w-4" />}
                                      {r.gender === "male" ? "Male" : "Female"}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </TableCell>
                                <TableCell>{r.churchNumber || "—"}</TableCell>
                                <TableCell>{r.service}</TableCell>
                                <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(r.checkInTime).toLocaleString()}</TableCell>
                                <TableCell>
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                      r.method === "fingerprint" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {r.method === "fingerprint" ? "Fingerprint" : "QR"}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      component="div"
                      count={checkInDataSource.length}
                      page={checkInPage}
                      onPageChange={(_, newPage) => setCheckInPage(newPage)}
                      rowsPerPage={checkInRowsPerPage}
                      onRowsPerPageChange={(e) => {
                        setCheckInRowsPerPage(parseInt(e.target.value, 10));
                        setCheckInPage(0);
                      }}
                      rowsPerPageOptions={[5, 10, 25]}
                    />
                  </Paper>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Record Attendance Drawer */}
        <Drawer
          title={
            <div className="flex items-center gap-2">
              <HiOutlineUsers className="h-5 w-5 text-green-600" />
              <span className="text-lg sm:text-xl font-bold text-gray-900">Record Attendance</span>
            </div>
          }
          placement="right"
          width={typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 600}
          onClose={handleCloseModal}
          open={showRecordModal}
        >
          <div className="pt-4">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleRecordAttendance}
              initialValues={{
                date: dayjs(),
                service: "1st",
                men: 0,
                women: 0,
                children: 0,
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={<span className="flex items-center gap-2"><HiOutlineCalendar className="text-gray-600" /> Service Type</span>}
                    name="service"
                    rules={[{ required: true, message: "Please select a service" }]}
                  >
                    <Select placeholder="Select Service" size="large">
                      {SERVICES.map((service) => (
                        <Select.Option key={service.id} value={service.id}>
                          {service.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={<span className="flex items-center gap-2"><HiOutlineCalendar className="text-gray-600" /> Date</span>}
                    name="date"
                    rules={[{ required: true, message: "Please select a date" }]}
                  >
                    <DatePicker style={{ width: "100%" }} size="large" format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
              </Row>

              <div className="mb-4 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                <p className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <HiOutlineUsers className="text-green-600" />
                  Attendance Count
                </p>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <Card className="border-2 border-gray-200 hover:border-gray-400 transition-colors">
                      <CardContent className="p-4">
                        <Form.Item
                          label={<span className="flex items-center gap-2 text-gray-700 font-semibold"><ManOutlined className="text-gray-600 text-lg" /> Men</span>}
                          name="men"
                          rules={[{ required: true, message: "Please enter number of men" }]}
                          className="mb-0"
                        >
                          <InputNumber min={0} style={{ width: "100%" }} size="large" placeholder="0" />
                        </Form.Item>
                      </CardContent>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card className="border-2 border-gray-200 hover:border-gray-400 transition-colors">
                      <CardContent className="p-4">
                        <Form.Item
                          label={<span className="flex items-center gap-2 text-gray-700 font-semibold"><WomanOutlined className="text-gray-600 text-lg" /> Women</span>}
                          name="women"
                          rules={[{ required: true, message: "Please enter number of women" }]}
                          className="mb-0"
                        >
                          <InputNumber min={0} style={{ width: "100%" }} size="large" placeholder="0" />
                        </Form.Item>
                      </CardContent>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card className="border-2 border-gray-200 hover:border-gray-400 transition-colors">
                      <CardContent className="p-4">
                        <Form.Item
                          label={<span className="flex items-center gap-2 text-gray-700 font-semibold"><UserOutlined className="text-gray-600 text-lg" /> Children</span>}
                          name="children"
                          rules={[{ required: true, message: "Please enter number of children" }]}
                          className="mb-0"
                        >
                          <InputNumber min={0} style={{ width: "100%" }} size="large" placeholder="0" />
                        </Form.Item>
                      </CardContent>
                    </Card>
                  </Col>
                </Row>

                <Form.Item shouldUpdate>
                  {({ getFieldValue }) => {
                    const men = Number(getFieldValue("men")) || 0;
                    const women = Number(getFieldValue("women")) || 0;
                    const children = Number(getFieldValue("children")) || 0;
                    const total = men + women + children;
                    return (
                      <div className="mt-6 pt-4 border-t-2 border-gray-300">
                        <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
                          <span className="text-base font-semibold text-gray-800 flex items-center gap-2">
                            <HiCheckCircle className="text-green-600" />
                            Total Attendance:
                          </span>
                          <span className="text-3xl font-bold text-green-700">{total}</span>
                        </div>
                      </div>
                    );
                  }}
                </Form.Item>
              </div>

              <Form.Item label={<span className="text-gray-700 font-medium">Notes (Optional)</span>} name="notes">
                <Input.TextArea rows={3} placeholder="Add any additional notes..." className="rounded-lg" />
              </Form.Item>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1 w-full sm:w-auto">
                  Cancel
                </Button>
                <AntButton
                  type="primary"
                  htmlType="submit"
                  className="flex-1 w-full sm:w-auto bg-green-600 hover:bg-green-700"
                  size="large"
                  icon={<PlusOutlined />}
                >
                  Record Attendance
                </AntButton>
              </div>
            </Form>
          </div>
        </Drawer>
      </div>
  );
}