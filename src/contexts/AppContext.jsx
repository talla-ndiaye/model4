import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Mock data
const mockTeachers = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@school.edu',
    phone: '+1234567890',
    subjects: ['Mathematics', 'Physics'],
    classes: ['10A', '11B'],
    joinDate: '2020-09-01',
    status: 'active',
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@school.edu',
    phone: '+1234567891',
    subjects: ['English Literature'],
    classes: ['9A', '10B'],
    joinDate: '2019-08-15',
    status: 'active',
  },
];

const mockSubjects = [
  {
    id: '1',
    name: 'Mathematics',
    code: 'MATH101',
    description: 'Advanced Mathematics for High School',
    teacherId: '1',
    classes: ['10A', '11B'],
    credits: 4,
  },
  {
    id: '2',
    name: 'English Literature',
    code: 'ENG201',
    description: 'Classical and Modern Literature',
    teacherId: '2',
    classes: ['9A', '10B'],
    credits: 3,
  },
];

const mockStudents = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@student.edu',
    class: '10A',
    parentId: '1',
    enrollmentDate: '2023-09-01',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@student.edu',
    class: '11B',
    parentId: '2',
    enrollmentDate: '2023-09-01',
    status: 'active',
  },
];

const mockParents = [
  {
    id: '1',
    name: 'Robert Doe',
    email: 'robert.doe@email.com',
    phone: '+1234567892',
    address: '123 Main St, City, State 12345',
    children: ['1'],
    joinDate: '2023-08-15',
  },
  {
    id: '2',
    name: 'Emily Smith',
    email: 'emily.smith@email.com',
    phone: '+1234567893',
    address: '456 Oak Ave, City, State 12345',
    children: ['2'],
    joinDate: '2023-08-20',
  },
];

const mockStaff = [
  {
    id: '1',
    name: 'Alice Williams',
    email: 'alice.williams@school.edu',
    phone: '+1234567894',
    position: 'Principal',
    department: 'Administration',
    joinDate: '2018-07-01',
    status: 'active',
    salary: 75000,
  },
];

const mockPayments = [
  {
    id: '1',
    studentId: '1',
    amount: 1500,
    type: 'tuition',
    period: 'Q1 2024',
    dueDate: '2024-03-15',
    paidDate: '2024-03-10',
    status: 'paid',
    description: 'First Quarter Tuition Fee',
  },
  {
    id: '2',
    studentId: '2',
    amount: 1500,
    type: 'tuition',
    period: 'Q1 2024',
    dueDate: '2024-03-15',
    status: 'pending',
    description: 'First Quarter Tuition Fee',
  },
];

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    id: '1',
    name: 'Admin User',
    email: 'admin@school.edu',
    role: 'admin',
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Data states
  const [teachers, setTeachers] = useState(mockTeachers);
  const [subjects, setSubjects] = useState(mockSubjects);
  const [parents, setParents] = useState(mockParents);
  const [students, setStudents] = useState(mockStudents);
  const [staff, setStaff] = useState(mockStaff);
  const [payments, setPayments] = useState(mockPayments);
  const [grades, setGrades] = useState([]);
  const [transports, setTransports] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const login = async (email, password) => {
    // Mock authentication
    if (email === 'admin@school.edu' && password === 'admin123') {
      setUser({
        id: '1',
        name: 'Admin User',
        email: 'admin@school.edu',
        role: 'admin',
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // CRUD operations
  const addTeacher = (teacher) => {
    const newTeacher = { ...teacher, id: Date.now().toString() };
    setTeachers([...teachers, newTeacher]);
  };

  const updateTeacher = (id, teacher) => {
    setTeachers(teachers.map(t => t.id === id ? { ...t, ...teacher } : t));
  };

  const deleteTeacher = (id) => {
    setTeachers(teachers.filter(t => t.id !== id));
  };

  const addSubject = (subject) => {
    const newSubject = { ...subject, id: Date.now().toString() };
    setSubjects([...subjects, newSubject]);
  };

  const updateSubject = (id, subject) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, ...subject } : s));
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const addParent = (parent) => {
    const newParent = { ...parent, id: Date.now().toString() };
    setParents([...parents, newParent]);
  };

  const updateParent = (id, parent) => {
    setParents(parents.map(p => p.id === id ? { ...p, ...parent } : p));
  };

  const deleteParent = (id) => {
    setParents(parents.filter(p => p.id !== id));
  };

  const addStudent = (student) => {
    const newStudent = { ...student, id: Date.now().toString() };
    setStudents([...students, newStudent]);
  };

  const updateStudent = (id, student) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...student } : s));
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const addStaff = (staff) => {
    const newStaff = { ...staff, id: Date.now().toString() };
    setStaff(prevStaff => [...prevStaff, newStaff]);
  };

  const updateStaff = (id, staff) => {
    setStaff(prevStaff => prevStaff.map(s => s.id === id ? { ...s, ...staff } : s));
  };

  const deleteStaff = (id) => {
    setStaff(prevStaff => prevStaff.filter(s => s.id !== id));
  };

  const addPayment = (payment) => {
    const newPayment = { ...payment, id: Date.now().toString() };
    setPayments([...payments, newPayment]);
  };

  const updatePayment = (id, payment) => {
    setPayments(payments.map(p => p.id === id ? { ...p, ...payment } : p));
  };

  const addGrade = (grade) => {
    const newGrade = { ...grade, id: Date.now().toString() };
    setGrades([...grades, newGrade]);
  };

  const updateGrade = (id, grade) => {
    setGrades(grades.map(g => g.id === id ? { ...g, ...grade } : g));
  };

  const addTransport = (transport) => {
    const newTransport = { ...transport, id: Date.now().toString() };
    setTransports([...transports, newTransport]);
  };

  const updateTransport = (id, transport) => {
    setTransports(transports.map(t => t.id === id ? { ...t, ...transport } : t));
  };

  const deleteTransport = (id) => {
    setTransports(transports.filter(t => t.id !== id));
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const value = {
    user,
    login,
    logout,
    isDarkMode,
    toggleTheme,
    teachers,
    subjects,
    parents,
    students,
    staff,
    payments,
    grades,
    transports,
    notifications,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addSubject,
    updateSubject,
    deleteSubject,
    addParent,
    updateParent,
    deleteParent,
    addStudent,
    updateStudent,
    deleteStudent,
    addStaff,
    updateStaff,
    deleteStaff,
    addPayment,
    updatePayment,
    addGrade,
    updateGrade,
    addTransport,
    updateTransport,
    deleteTransport,
    markNotificationAsRead,
  };

  return (
    <AppContext.Provider value={value}>
      <div className={isDarkMode ? 'dark' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
}