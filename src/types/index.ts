export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'parent';
  avatar?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  joinDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  teacherId: string;
  classes: string[];
  credits: number;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  children: string[];
  joinDate: string;
}

export interface Student {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  class: string;
  parentId: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
  status: 'active' | 'inactive';
  salary: number;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  type: 'tuition' | 'transport' | 'other';
  period: string;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  semester: string;
  grades: {
    assignments: number[];
    exams: number[];
    participation: number;
  };
  average: number;
}

export interface Transport {
  id: string;
  routeName: string;
  driverName: string;
  vehicleNumber: string;
  capacity: number;
  students: string[];
  stops: TransportStop[];
  schedule: string;
}

export interface TransportStop {
  id: string;
  name: string;
  address: string;
  time: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
  userId: string;
}