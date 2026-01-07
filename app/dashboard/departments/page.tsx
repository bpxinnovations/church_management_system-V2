'use client';

import { useState } from 'react';
import {
  HiOutlineOfficeBuilding,
  HiOutlineBookOpen,
  HiUserGroup,
  HiOutlineUsers,
} from 'react-icons/hi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, Tag, Space, Button as AntButton, Input as AntInput, Drawer } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/auth-context';

interface Department {
  id: number;
  name: string;
  leader: string;
  members: number;
  status: 'Active' | 'Inactive';
  description: string;
  type: 'organization' | 'class';
  logo?: string;
}

interface Role {
  role: string;
  permissions: string[];
  members: number;
}

interface OrganizationMember {
  id: number;
  name: string;
  phone: string;
  email?: string;
}

export default function DepartmentsPage() {
  const { hasRole } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showViewClassModal, setShowViewClassModal] = useState(false);
  const [showManageClassModal, setShowManageClassModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Department | null>(null);
  const [managingOrganization, setManagingOrganization] = useState<Department | null>(null);
  const [selectedClass, setSelectedClass] = useState<Department | null>(null);
  const [managingClass, setManagingClass] = useState<Department | null>(null);
  const [organizationSearchTerm, setOrganizationSearchTerm] = useState('');
  const [classSearchTerm, setClassSearchTerm] = useState('');
  const [manageForm, setManageForm] = useState({
    name: '',
    leader: '',
    status: 'Active' as 'Active' | 'Inactive',
  });
  const [classForm, setClassForm] = useState({
    name: '',
    leader: '',
    status: 'Active' as 'Active' | 'Inactive',
  });
  const [manageClassForm, setManageClassForm] = useState({
    name: '',
    leader: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: "Men's Fellowship",
      leader: 'David Brown',
      members: 80,
      status: 'Active',
      description: 'Men\'s ministry and fellowship',
      type: 'organization',
      logo: '/images/logos/mens.png',
    },
    {
      id: 2,
      name: 'The Church Guild',
      leader: 'Sarah Williams',
      members: 60,
      status: 'Active',
      description: 'Church Guild activities',
      type: 'organization',
      logo: '/images/logos/guild.png',
    },
    {
      id: 3,
      name: "Women's Fellowship",
      leader: 'Jane Smith',
      members: 100,
      status: 'Active',
      description: 'Women\'s ministry and fellowship',
      type: 'organization',
      logo: '/images/logos/wflogo.png',
    },
    {
      id: 4,
      name: 'Youth Fellowship',
      leader: 'Michael Johnson',
      members: 150,
      status: 'Active',
      description: 'Youth ministry and activities',
      type: 'organization',
      logo: '/images/logos/youth .png',
    },
    {
      id: 5,
      name: 'Singing Band',
      leader: 'Robert Taylor',
      members: 45,
      status: 'Active',
      description: 'Singing band ministry',
      type: 'organization',
      logo: '/images/logos/band.png',
    },
    {
      id: 6,
      name: 'Church Choir',
      leader: 'Sarah Williams',
      members: 50,
      status: 'Active',
      description: 'Church choir ministry',
      type: 'organization',
      logo: '/images/logos/choir.png',
    },
    {
      id: 7,
      name: 'SUWMA',
      leader: 'Mary Johnson',
      members: 75,
      status: 'Active',
      description: 'SUWMA organization',
      type: 'organization',
      logo: '/images/logos/suwma.png',
    },
    {
      id: 8,
      name: 'Boys & Girls Brigade',
      leader: 'James Wilson',
      members: 65,
      status: 'Active',
      description: 'Boys & Girls Brigade activities',
      type: 'organization',
      logo: '/images/logos/bb.png',
    },
    {
      id: 9,
      name: 'Christ Little Band',
      leader: 'Patricia Brown',
      members: 40,
      status: 'Active',
      description: 'Christ Little Band activities',
      type: 'organization',
      logo: '/images/logos/little.png',
    },
    {
      id: 10,
      name: 'Girls Fellowship',
      leader: 'Emily Davis',
      members: 55,
      status: 'Active',
      description: 'Girls Fellowship activities',
      type: 'organization',
      logo: '/images/logos/girls.png',
    },
    {
      id: 11,
      name: "Children's Ministry",
      leader: 'Linda Thompson',
      members: 35,
      status: 'Active',
      description: 'Children\'s ministry and programs',
      type: 'organization',
      logo: '/images/logos/children.png',
    },
    {
      id: 12,
      name: 'Wesley Class',
      leader: 'Thomas Anderson',
      members: 45,
      status: 'Active',
      description: 'Wesley class for adult members - Bible study and fellowship',
      type: 'class',
    },
    {
      id: 13,
      name: 'Love Class',
      leader: 'Mary Johnson',
      members: 38,
      status: 'Active',
      description: 'Love class for adult members - Bible study and fellowship',
      type: 'class',
    },
    {
      id: 14,
      name: 'Hope Class',
      leader: 'James Wilson',
      members: 42,
      status: 'Active',
      description: 'Hope class for adult members - Bible study and fellowship',
      type: 'class',
    },
    {
      id: 15,
      name: 'Faith Class',
      leader: 'Patricia Brown',
      members: 35,
      status: 'Active',
      description: 'Faith class for adult members - Bible study and fellowship',
      type: 'class',
    },
    {
      id: 16,
      name: 'Joy Class',
      leader: 'Robert Taylor',
      members: 40,
      status: 'Active',
      description: 'Joy class for adult members - Bible study and fellowship',
      type: 'class',
    },
  ]);

  const roles: Role[] = [
    { role: 'Pastor', permissions: ['Full Access'], members: 2 },
    { role: 'Admin', permissions: ['Members', 'Attendance', 'Finance'], members: 3 },
    { role: 'Treasurer', permissions: ['Finance', 'Reports'], members: 1 },
    { role: 'Department Leader', permissions: ['Department Members', 'Attendance'], members: 12 },
  ];

  // Sample members data for organizations
  const organizationMembers: Record<number, OrganizationMember[]> = {
    1: [
      { id: 1, name: 'Kwame Asante', phone: '+233 24 123 4567', email: 'kwame.asante@gmail.com' },
      { id: 2, name: 'Kofi Mensah', phone: '+233 20 234 5678', email: 'kofi.mensah@yahoo.com' },
      { id: 3, name: 'Yaw Boateng', phone: '+233 26 345 6789', email: 'yaw.boateng@hotmail.com' },
      { id: 4, name: 'Emmanuel Osei', phone: '+233 24 456 7890', email: 'emmanuel.osei@gmail.com' },
      { id: 5, name: 'Daniel Appiah', phone: '+233 20 567 8901', email: 'daniel.appiah@yahoo.com' },
    ],
    2: [
      { id: 1, name: 'Sarah Williams', phone: '+233 24 111 2222', email: 'sarah.williams@gmail.com' },
      { id: 2, name: 'Grace Mensah', phone: '+233 20 222 3333', email: 'grace.mensah@yahoo.com' },
      { id: 3, name: 'Mary Ofori', phone: '+233 26 333 4444', email: 'mary.ofori@hotmail.com' },
    ],
    3: [
      { id: 1, name: 'Ama Adjei', phone: '+233 24 555 6666', email: 'ama.adjei@gmail.com' },
      { id: 2, name: 'Akosua Darko', phone: '+233 20 666 7777', email: 'akosua.darko@yahoo.com' },
      { id: 3, name: 'Efua Asante', phone: '+233 26 777 8888', email: 'efua.asante@hotmail.com' },
      { id: 4, name: 'Abena Osei', phone: '+233 24 888 9999', email: 'abena.osei@gmail.com' },
    ],
    4: [
      { id: 1, name: 'Michael Johnson', phone: '+233 24 999 0000', email: 'michael.johnson@gmail.com' },
      { id: 2, name: 'Prince Owusu', phone: '+233 20 000 1111', email: 'prince.owusu@yahoo.com' },
      { id: 3, name: 'Samuel Tetteh', phone: '+233 26 111 2222', email: 'samuel.tetteh@hotmail.com' },
    ],
    5: [
      { id: 1, name: 'Robert Taylor', phone: '+233 24 222 3333', email: 'robert.taylor@gmail.com' },
      { id: 2, name: 'James Amoah', phone: '+233 20 333 4444', email: 'james.amoah@yahoo.com' },
    ],
    6: [
      { id: 1, name: 'Sarah Williams', phone: '+233 24 444 5555', email: 'sarah.williams@gmail.com' },
      { id: 2, name: 'Patricia Brown', phone: '+233 20 555 6666', email: 'patricia.brown@yahoo.com' },
      { id: 3, name: 'Linda Thompson', phone: '+233 26 666 7777', email: 'linda.thompson@hotmail.com' },
    ],
    7: [
      { id: 1, name: 'Mary Johnson', phone: '+233 24 777 8888', email: 'mary.johnson@gmail.com' },
      { id: 2, name: 'Esther Mensah', phone: '+233 20 888 9999', email: 'esther.mensah@yahoo.com' },
    ],
    8: [
      { id: 1, name: 'James Wilson', phone: '+233 24 999 0000', email: 'james.wilson@gmail.com' },
      { id: 2, name: 'David Osei', phone: '+233 20 000 1111', email: 'david.osei@yahoo.com' },
      { id: 3, name: 'Peter Asante', phone: '+233 26 111 2222', email: 'peter.asante@hotmail.com' },
    ],
    9: [
      { id: 1, name: 'Patricia Brown', phone: '+233 24 222 3333', email: 'patricia.brown@gmail.com' },
      { id: 2, name: 'Ruth Adjei', phone: '+233 20 333 4444', email: 'ruth.adjei@yahoo.com' },
    ],
    10: [
      { id: 1, name: 'Emily Davis', phone: '+233 24 444 5555', email: 'emily.davis@gmail.com' },
      { id: 2, name: 'Joyce Ofori', phone: '+233 20 555 6666', email: 'joyce.ofori@yahoo.com' },
      { id: 3, name: 'Gifty Asante', phone: '+233 26 666 7777', email: 'gifty.asante@hotmail.com' },
    ],
    11: [
      { id: 1, name: 'Linda Thompson', phone: '+233 24 777 8888', email: 'linda.thompson@gmail.com' },
      { id: 2, name: 'Cynthia Mensah', phone: '+233 20 888 9999', email: 'cynthia.mensah@yahoo.com' },
      { id: 3, name: 'Doris Osei', phone: '+233 26 999 0000', email: 'doris.osei@hotmail.com' },
    ],
  };

  // Sample members data for Bible classes
  const classMembers: Record<number, OrganizationMember[]> = {
    12: [
      { id: 1, name: 'Thomas Anderson', phone: '+233 24 111 1111', email: 'thomas.anderson@gmail.com' },
      { id: 2, name: 'John Mensah', phone: '+233 20 222 2222', email: 'john.mensah@yahoo.com' },
      { id: 3, name: 'Paul Osei', phone: '+233 26 333 3333', email: 'paul.osei@hotmail.com' },
      { id: 4, name: 'Mark Asante', phone: '+233 24 444 4444', email: 'mark.asante@gmail.com' },
      { id: 5, name: 'Luke Boateng', phone: '+233 20 555 5555', email: 'luke.boateng@yahoo.com' },
    ],
    13: [
      { id: 1, name: 'Mary Johnson', phone: '+233 24 666 6666', email: 'mary.johnson@gmail.com' },
      { id: 2, name: 'Sarah Adjei', phone: '+233 20 777 7777', email: 'sarah.adjei@yahoo.com' },
      { id: 3, name: 'Ruth Ofori', phone: '+233 26 888 8888', email: 'ruth.ofori@hotmail.com' },
      { id: 4, name: 'Esther Darko', phone: '+233 24 999 9999', email: 'esther.darko@gmail.com' },
    ],
    14: [
      { id: 1, name: 'James Wilson', phone: '+233 24 101 1010', email: 'james.wilson@gmail.com' },
      { id: 2, name: 'David Brown', phone: '+233 20 202 2020', email: 'david.brown@yahoo.com' },
      { id: 3, name: 'Peter Tetteh', phone: '+233 26 303 3030', email: 'peter.tetteh@hotmail.com' },
      { id: 4, name: 'Andrew Owusu', phone: '+233 24 404 4040', email: 'andrew.owusu@gmail.com' },
    ],
    15: [
      { id: 1, name: 'Patricia Brown', phone: '+233 24 505 5050', email: 'patricia.brown@gmail.com' },
      { id: 2, name: 'Grace Mensah', phone: '+233 20 606 6060', email: 'grace.mensah@yahoo.com' },
      { id: 3, name: 'Hope Asante', phone: '+233 26 707 7070', email: 'hope.asante@hotmail.com' },
    ],
    16: [
      { id: 1, name: 'Robert Taylor', phone: '+233 24 808 8080', email: 'robert.taylor@gmail.com' },
      { id: 2, name: 'Michael Osei', phone: '+233 20 909 9090', email: 'michael.osei@yahoo.com' },
      { id: 3, name: 'Daniel Appiah', phone: '+233 26 010 1010', email: 'daniel.appiah@hotmail.com' },
      { id: 4, name: 'Samuel Boateng', phone: '+233 24 121 2121', email: 'samuel.boateng@gmail.com' },
    ],
  };

  // Pattern styles matching dashboard
  const patternStyles = [
    {
      background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2316a34a\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    },
    {
      background: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2316a34a\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z\'/%3E%3C/g%3E%3C/svg%3E")',
    },
    {
      background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 50 Q25 30, 50 50 T100 50\' stroke=\'%2316a34a\' stroke-width=\'1.5\' fill=\'none\' opacity=\'0.12\'/%3E%3C/svg%3E")',
    },
    {
      background: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2316a34a\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z\'/%3E%3C/g%3E%3C/svg%3E")',
    },
  ];

  // Calculate stats
  const totalOrganizations = departments.filter(d => d.type === 'organization').length;
  const totalClasses = departments.filter(d => d.type === 'class').length;
  const uniqueLeaders = new Set(departments.map(d => d.leader)).size;

  const stats = [
    { 
      label: 'Total Organizations', 
      value: totalOrganizations.toString(), 
      icon: HiOutlineOfficeBuilding,
      color: 'text-blue-600'
    },
    { 
      label: 'Total Bible Classes', 
      value: totalClasses.toString(), 
      icon: HiOutlineBookOpen,
      color: 'text-green-600'
    },
    { 
      label: 'Leaders', 
      value: uniqueLeaders.toString(), 
      icon: HiUserGroup,
      color: 'text-purple-600'
    },
  ];

  // Separate organizations and classes
  const organizations = departments.filter(d => d.type === 'organization');
  const bibleClasses = departments.filter(d => d.type === 'class');

  // Filter organizations
  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(organizationSearchTerm.toLowerCase()) ||
    org.leader.toLowerCase().includes(organizationSearchTerm.toLowerCase())
  );

  // Filter classes
  const filteredClasses = bibleClasses.filter((cls) =>
    cls.name.toLowerCase().includes(classSearchTerm.toLowerCase()) ||
    cls.leader.toLowerCase().includes(classSearchTerm.toLowerCase())
  );

  // Table columns for Organizations
  const organizationColumns: ColumnsType<Department> = [
    {
      title: 'Organization Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span className="text-sm font-semibold text-gray-900">{text}</span>
      ),
    },
    {
      title: 'Leader',
      dataIndex: 'leader',
      key: 'leader',
      render: (text: string) => (
        <span className="text-sm text-gray-900">{text}</span>
      ),
    },
    {
      title: 'Members',
      dataIndex: 'members',
      key: 'members',
      render: (members: number) => (
        <span className="text-sm font-semibold text-blue-600">{members}</span>
      ),
      sorter: (a, b) => a.members - b.members,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <AntButton 
            type="link" 
            icon={<EyeOutlined />} 
            className="text-blue-600"
            title="View"
          />
          <AntButton 
            type="link" 
            icon={<EditOutlined />} 
            className="text-green-600"
            title="Manage"
          />
        </Space>
      ),
    },
  ];

  // Table columns for Bible Classes
  const classColumns: ColumnsType<Department> = [
    {
      title: 'Class Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span className="text-sm font-semibold text-gray-900">{text}</span>
      ),
    },
    {
      title: 'Class Leader',
      dataIndex: 'leader',
      key: 'leader',
      render: (text: string) => (
        <span className="text-sm text-gray-900">{text}</span>
      ),
    },
    {
      title: 'Members',
      dataIndex: 'members',
      key: 'members',
      render: (members: number) => (
        <span className="text-sm font-semibold text-green-600">{members}</span>
      ),
      sorter: (a, b) => a.members - b.members,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <AntButton 
            type="link" 
            icon={<EyeOutlined />} 
            className="text-blue-600"
            title="View"
            onClick={() => {
              setSelectedClass(record);
              setShowViewClassModal(true);
            }}
          />
          <AntButton 
            type="link" 
            icon={<EditOutlined />} 
            className="text-green-600"
            title="Manage"
            onClick={() => {
              setManagingClass(record);
              setManageClassForm({
                name: record.name,
                leader: record.leader,
                status: record.status,
              });
              setShowManageClassModal(true);
            }}
          />
        </Space>
      ),
    },
  ];

  const roleColumns: ColumnsType<Role> = [
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text: string) => (
        <span className="text-sm font-semibold text-gray-900">{text}</span>
      ),
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <div className="flex flex-wrap gap-2">
          {permissions.map((permission, index) => (
            <Tag key={index} color="blue">
              {permission}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Members',
      dataIndex: 'members',
      key: 'members',
      render: (members: number) => (
        <span className="text-sm text-gray-900">{members}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <AntButton 
          type="link" 
          icon={<EditOutlined />} 
          className="text-blue-600"
          title="Edit"
        />
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Organizations/Classes & Roles
          </h1>
          <p className="text-gray-600 mt-1">
            Manage organizations, classes, assign leaders, and configure role permissions
          </p>
        </div>
        {!hasRole('head_pastor') && (
          <Button onClick={() => setShowModal(true)} className="shadow-lg">
            <PlusOutlined className="mr-2" />
            Create Organization/Class
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const pattern = patternStyles[index % patternStyles.length];
          return (
            <Card key={index} className="relative overflow-hidden">
              <div
                className="absolute inset-0"
                style={{ backgroundImage: pattern.background }}
              />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-xl font-semibold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Organizations Cards */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-base font-semibold text-gray-900">
              Organizations
            </CardTitle>
            <AntInput
              placeholder="Search organizations..."
              prefix={<SearchOutlined />}
              value={organizationSearchTerm}
              onChange={(e) => setOrganizationSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          {filteredOrganizations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <HiOutlineOfficeBuilding className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No organizations found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrganizations.map((org) => (
                <Card
                  key={org.id}
                  className="hover:shadow-lg transition-all duration-200 border border-gray-200"
                  style={{ backgroundColor: '#F5F5F5' }}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {org.logo ? (
                          <img
                            src={org.logo}
                            alt={org.name}
                            className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm"
                          style={{ display: org.logo ? 'none' : 'flex' }}
                        >
                          {org.name
                            .split(' ')
                            .map((word) => word[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                          {org.name}
                        </h3>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <HiUserGroup className="h-4 w-4" />
                          Leader
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {org.leader}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <HiOutlineUsers className="h-4 w-4" />
                          Members
                        </span>
                        <span className="text-sm font-semibold text-blue-600">
                          {org.members}
                        </span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedOrganization(org);
                          setShowViewModal(true);
                        }}
                      >
                        <EyeOutlined className="mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setManagingOrganization(org);
                          setManageForm({
                            name: org.name,
                            leader: org.leader,
                            status: org.status,
                          });
                          setShowManageModal(true);
                        }}
                      >
                        <EditOutlined className="mr-1" />
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bible Classes Table */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-base font-semibold text-gray-900">
              Bible Classes
            </CardTitle>
            <Space>
              <AntInput
                placeholder="Search Bible classes..."
                prefix={<SearchOutlined />}
                value={classSearchTerm}
                onChange={(e) => setClassSearchTerm(e.target.value)}
                style={{ width: 250 }}
              />
              {!hasRole('head_pastor') && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setClassForm({
                      name: '',
                      leader: '',
                      status: 'Active',
                    });
                    setShowAddClassModal(true);
                  }}
                >
                  <PlusOutlined className="mr-1" />
                  Add Bible Class
                </Button>
              )}
            </Space>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <Table
            columns={classColumns}
            dataSource={filteredClasses}
            rowKey={(record) => `class-${record.id}`}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} Bible classes`,
            }}
          />
        </CardContent>
      </Card>

      {/* Role-Based Access - Hidden for head_pastor and church_admin */}
      {!hasRole('head_pastor') && !hasRole('church_admin') && (
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-base font-semibold text-gray-900">
                Role-Based Access Control
              </CardTitle>
              <Button variant="outline" size="sm">
                Manage Roles
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <Table
              columns={roleColumns}
              dataSource={roles}
              rowKey={(record) => `role-${record.role}`}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} roles`,
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* View Organization Drawer */}
      <Drawer
        open={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedOrganization(null);
        }}
        title="Organization Details"
        placement="right"
        width={typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 600}
      >
        {selectedOrganization && (
          <div className="p-4 sm:p-6">
            <div className="flex items-start gap-6 mb-6">
              {selectedOrganization.logo ? (
                <img
                  src={selectedOrganization.logo}
                  alt={selectedOrganization.name}
                  className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl"
                style={{ display: selectedOrganization.logo ? 'none' : 'flex' }}
              >
                {selectedOrganization.name
                  .split(' ')
                  .map((word) => word[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedOrganization.name}
                </h2>
                <Tag color={selectedOrganization.status === 'Active' ? 'green' : 'default'} className="text-sm">
                  {selectedOrganization.status}
                </Tag>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Leader</p>
                  <p className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <HiUserGroup className="h-4 w-4 text-gray-500" />
                    {selectedOrganization.leader}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Members</p>
                  <p className="text-base font-semibold text-blue-600 flex items-center gap-2">
                    <HiOutlineUsers className="h-4 w-4 text-blue-500" />
                    {selectedOrganization.members}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Members</h3>
                <Table
                  columns={[
                    {
                      title: 'Name',
                      dataIndex: 'name',
                      key: 'name',
                      render: (text: string) => (
                        <span className="text-sm font-medium text-gray-900">{text}</span>
                      ),
                    },
                    {
                      title: 'Contact',
                      dataIndex: 'phone',
                      key: 'phone',
                      render: (text: string) => (
                        <span className="text-sm text-gray-700">{text}</span>
                      ),
                    },
                  ]}
                  dataSource={organizationMembers[selectedOrganization.id] || []}
                  rowKey={(record) => `member-${record.id}`}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} members`,
                  }}
                />
              </div>

              <div className="pt-4 border-t border-gray-200 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedOrganization(null);
                  }}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Manage Organization Modal */}
      <Drawer
        open={showManageModal}
        onClose={() => {
          setShowManageModal(false);
          setManagingOrganization(null);
        }}
        title="Manage Organization"
        placement="right"
        width={typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 600}
      >
        {managingOrganization && (
          <div className="p-4 sm:p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (managingOrganization) {
                  setDepartments((prev) =>
                    prev.map((dept) =>
                      dept.id === managingOrganization.id
                        ? {
                            ...dept,
                            name: manageForm.name,
                            leader: manageForm.leader,
                            status: manageForm.status,
                          }
                        : dept
                    )
                  );
                  setShowManageModal(false);
                  setManagingOrganization(null);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={manageForm.name}
                  onChange={(e) => setManageForm({ ...manageForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Organization name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leader *
                </label>
                <select
                  required
                  value={manageForm.leader}
                  onChange={(e) => setManageForm({ ...manageForm, leader: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Leader</option>
                  <option>David Brown</option>
                  <option>Sarah Williams</option>
                  <option>Jane Smith</option>
                  <option>Michael Johnson</option>
                  <option>Robert Taylor</option>
                  <option>Mary Johnson</option>
                  <option>James Wilson</option>
                  <option>Patricia Brown</option>
                  <option>Emily Davis</option>
                  <option>Linda Thompson</option>
                  <option>Thomas Anderson</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  required
                  value={manageForm.status}
                  onChange={(e) =>
                    setManageForm({ ...manageForm, status: e.target.value as 'Active' | 'Inactive' })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowManageModal(false);
                    setManagingOrganization(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Update Organization
                </Button>
              </div>
            </form>
          </div>
        )}
      </Drawer>

      {/* Add Bible Class Drawer */}
      <Drawer
        title="Add New Bible Class"
        placement="right"
        width={typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 500}
        open={showAddClassModal}
        onClose={() => {
          setShowAddClassModal(false);
          setClassForm({
            name: '',
            leader: '',
            status: 'Active',
          });
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newClass: Department = {
              id: Math.max(...departments.map(d => d.id)) + 1,
              name: classForm.name,
              leader: classForm.leader,
              members: 0,
              status: classForm.status,
              description: '',
              type: 'class',
            };
            setDepartments((prev) => [...prev, newClass]);
            setShowAddClassModal(false);
            setClassForm({
              name: '',
              leader: '',
              status: 'Active',
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Name *
            </label>
            <input
              type="text"
              required
              value={classForm.name}
              onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Wesley Class, Love Class, Hope Class"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Leader *
            </label>
            <select
              required
              value={classForm.leader}
              onChange={(e) => setClassForm({ ...classForm, leader: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select Leader</option>
              <option>Thomas Anderson</option>
              <option>Mary Johnson</option>
              <option>James Wilson</option>
              <option>Patricia Brown</option>
              <option>Robert Taylor</option>
              <option>David Brown</option>
              <option>Sarah Williams</option>
              <option>Jane Smith</option>
              <option>Michael Johnson</option>
              <option>Emily Davis</option>
              <option>Linda Thompson</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              required
              value={classForm.status}
              onChange={(e) =>
                setClassForm({ ...classForm, status: e.target.value as 'Active' | 'Inactive' })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddClassModal(false);
                setClassForm({
                  name: '',
                  leader: '',
                  status: 'Active',
                });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Bible Class
            </Button>
          </div>
        </form>
      </Drawer>

      {/* View Bible Class Modal */}
      <Drawer
        open={showViewClassModal}
        onClose={() => {
          setShowViewClassModal(false);
          setSelectedClass(null);
        }}
        title="Bible Class Details"
        placement="right"
        width={typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 600}
      >
        {selectedClass && (
          <div className="p-4 sm:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedClass.name}
              </h2>
              <Tag color={selectedClass.status === 'Active' ? 'green' : 'default'} className="text-sm">
                {selectedClass.status}
              </Tag>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Class Leader</p>
                  <p className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <HiUserGroup className="h-4 w-4 text-gray-500" />
                    {selectedClass.leader}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Members</p>
                  <p className="text-base font-semibold text-green-600 flex items-center gap-2">
                    <HiOutlineUsers className="h-4 w-4 text-green-500" />
                    {selectedClass.members}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Members</h3>
                <Table
                  columns={[
                    {
                      title: 'Name',
                      dataIndex: 'name',
                      key: 'name',
                      render: (text: string) => (
                        <span className="text-sm font-medium text-gray-900">{text}</span>
                      ),
                    },
                    {
                      title: 'Contact',
                      dataIndex: 'phone',
                      key: 'phone',
                      render: (text: string) => (
                        <span className="text-sm text-gray-700">{text}</span>
                      ),
                    },
                  ]}
                  dataSource={classMembers[selectedClass.id] || []}
                  rowKey={(record) => `class-member-${record.id}`}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} members`,
                  }}
                />
              </div>

              <div className="pt-4 border-t border-gray-200 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowViewClassModal(false);
                    setSelectedClass(null);
                  }}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Manage Bible Class Drawer */}
      <Drawer
        title="Manage Bible Class"
        placement="right"
        width={typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 500}
        open={showManageClassModal}
        onClose={() => {
          setShowManageClassModal(false);
          setManagingClass(null);
        }}
      >
        {managingClass && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (managingClass) {
                setDepartments((prev) =>
                  prev.map((dept) =>
                    dept.id === managingClass.id
                      ? {
                          ...dept,
                          name: manageClassForm.name,
                          leader: manageClassForm.leader,
                          status: manageClassForm.status,
                        }
                      : dept
                  )
                );
                setShowManageClassModal(false);
                setManagingClass(null);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Name *
              </label>
              <input
                type="text"
                required
                value={manageClassForm.name}
                onChange={(e) => setManageClassForm({ ...manageClassForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Class name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Leader *
              </label>
              <select
                required
                value={manageClassForm.leader}
                onChange={(e) => setManageClassForm({ ...manageClassForm, leader: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Leader</option>
                <option>Thomas Anderson</option>
                <option>Mary Johnson</option>
                <option>James Wilson</option>
                <option>Patricia Brown</option>
                <option>Robert Taylor</option>
                <option>David Brown</option>
                <option>Sarah Williams</option>
                <option>Jane Smith</option>
                <option>Michael Johnson</option>
                <option>Emily Davis</option>
                <option>Linda Thompson</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                required
                value={manageClassForm.status}
                onChange={(e) =>
                  setManageClassForm({ ...manageClassForm, status: e.target.value as 'Active' | 'Inactive' })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowManageClassModal(false);
                  setManagingClass(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Update Bible Class
              </Button>
            </div>
          </form>
        )}
      </Drawer>

      {/* Create Organization/Class Modal */}
      <Drawer
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Organization/Class"
        placement="right"
        width={typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 600}
      >
        <div className="p-4 sm:p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization/Class Name *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Choir, Ushers, Youth, Wesley Class, Love Class"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Organization/class description and purpose..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leader *
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>Select Leader</option>
                <option>John Doe</option>
                <option>Jane Smith</option>
                <option>Michael Johnson</option>
                <option>Sarah Williams</option>
                <option>David Brown</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Organization/Class
              </Button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
}
