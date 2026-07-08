// Shared mock data for the Lecturer and Admin portals.

export type TaughtCourse = {
  id: number;
  name: string;
  code: string;
  students: number;
  schedule: string;
  room: string;
  color: 'blue' | 'green' | 'orange';
  ungraded: number;
  avgGrade: number;
};

export const taughtCourses: TaughtCourse[] = [
{
  id: 1,
  name: 'Advanced Machine Learning',
  code: 'CS401',
  students: 64,
  schedule: 'Mon · Wed · 10:00 AM',
  room: 'Room 402',
  color: 'blue',
  ungraded: 12,
  avgGrade: 88
},
{
  id: 2,
  name: 'Intro to Neural Networks',
  code: 'CS310',
  students: 92,
  schedule: 'Tue · Thu · 1:00 PM',
  room: 'Hall A',
  color: 'green',
  ungraded: 5,
  avgGrade: 82
},
{
  id: 3,
  name: 'AI Ethics Seminar',
  code: 'CS450',
  students: 28,
  schedule: 'Fri · 11:00 AM',
  room: 'Room 210',
  color: 'orange',
  ungraded: 0,
  avgGrade: 91
}];


export type Submission = {
  id: number;
  student: string;
  initials: string;
  course: string;
  assignment: string;
  submitted: string;
  status: 'pending' | 'graded';
  grade?: number;
  answer?: string;
};

export const submissions: Submission[] = [
{
  id: 1,
  student: 'John Doe',
  initials: 'JD',
  course: 'CS401',
  assignment: 'Neural Network Implementation',
  submitted: '2h ago',
  status: 'pending'
},
{
  id: 2,
  student: 'Maria Santos',
  initials: 'MS',
  course: 'CS401',
  assignment: 'Neural Network Implementation',
  submitted: '5h ago',
  status: 'pending'
},
{
  id: 3,
  student: 'Kofi Mensah',
  initials: 'KM',
  course: 'CS310',
  assignment: 'Perceptron Lab',
  submitted: 'Yesterday',
  status: 'pending'
},
{
  id: 4,
  student: 'Lina Park',
  initials: 'LP',
  course: 'CS401',
  assignment: 'Midterm Exam',
  submitted: 'Jun 12',
  status: 'graded',
  grade: 94
},
{
  id: 5,
  student: 'Omar Farah',
  initials: 'OF',
  course: 'CS310',
  assignment: 'Perceptron Lab',
  submitted: 'Yesterday',
  status: 'pending'
},
{
  id: 6,
  student: 'Grace Adeyemi',
  initials: 'GA',
  course: 'CS450',
  assignment: 'Ethics Essay',
  submitted: 'Jun 10',
  status: 'graded',
  grade: 89
}];


export type EnrolledStudent = {
  id: number;
  name: string;
  initials: string;
  studentId: string;
  course: string;
  attendance: number;
  avg: number;
  status: 'On track' | 'At risk' | 'Excelling';
};

export const enrolledStudents: EnrolledStudent[] = [
{
  id: 1,
  name: 'John Doe',
  initials: 'JD',
  studentId: 'IUG-2231',
  course: 'CS401',
  attendance: 94,
  avg: 88,
  status: 'On track'
},
{
  id: 2,
  name: 'Maria Santos',
  initials: 'MS',
  studentId: 'IUG-2240',
  course: 'CS401',
  attendance: 78,
  avg: 72,
  status: 'At risk'
},
{
  id: 3,
  name: 'Kofi Mensah',
  initials: 'KM',
  studentId: 'IUG-2255',
  course: 'CS310',
  attendance: 99,
  avg: 95,
  status: 'Excelling'
},
{
  id: 4,
  name: 'Lina Park',
  initials: 'LP',
  studentId: 'IUG-2261',
  course: 'CS401',
  attendance: 91,
  avg: 90,
  status: 'Excelling'
},
{
  id: 5,
  name: 'Omar Farah',
  initials: 'OF',
  studentId: 'IUG-2270',
  course: 'CS310',
  attendance: 65,
  avg: 61,
  status: 'At risk'
},
{
  id: 6,
  name: 'Grace Adeyemi',
  initials: 'GA',
  studentId: 'IUG-2284',
  course: 'CS450',
  attendance: 88,
  avg: 84,
  status: 'On track'
}];


// ---- Admin ----

export type AdminUser = {
  id: number;
  name: string;
  initials: string;
  email: string;
  role: 'Student' | 'Lecturer' | 'Admin' | 'Staff';
  faculty: string;
  status: 'Active' | 'Pending' | 'Suspended' | 'Rejected';
  password?: string;
};

export const adminUsers: AdminUser[] = [
{
  id: 1,
  name: 'John Doe',
  initials: 'JD',
  email: 'john.doe@univ-iug.com',
  role: 'Student',
  faculty: 'Computing',
  status: 'Active'
},
{
  id: 2,
  name: 'Dr. Amina Toure',
  initials: 'AT',
  email: 'a.toure@univ-iug.com',
  role: 'Lecturer',
  faculty: 'Computing',
  status: 'Active'
},
{
  id: 3,
  name: 'Prof. Kwame Mensah',
  initials: 'KM',
  email: 'k.mensah@univ-iug.com',
  role: 'Lecturer',
  faculty: 'Computing',
  status: 'Active'
},
{
  id: 4,
  name: 'Sara Lindqvist',
  initials: 'SL',
  email: 's.lindqvist@univ-iug.com',
  role: 'Lecturer',
  faculty: 'Design',
  status: 'Active'
},
{
  id: 5,
  name: 'Maria Santos',
  initials: 'MS',
  email: 'm.santos@univ-iug.com',
  role: 'Student',
  faculty: 'Computing',
  status: 'Pending'
},
{
  id: 6,
  name: 'Daniel Okafor',
  initials: 'DO',
  email: 'd.okafor@univ-iug.com',
  role: 'Staff',
  faculty: 'Mathematics',
  status: 'Active'
},
{
  id: 7,
  name: 'Omar Farah',
  initials: 'OF',
  email: 'o.farah@univ-iug.com',
  role: 'Student',
  faculty: 'Computing',
  status: 'Suspended'
}];


export type AdminCourse = {
  id: number;
  name: string;
  code: string;
  faculty: string;
  lecturer: string;
  enrolled: number;
  capacity: number;
  status: 'Published' | 'Draft';
};

export const adminCourses: AdminCourse[] = [
{
  id: 1,
  name: 'Advanced Machine Learning',
  code: 'CS401',
  faculty: 'Computing',
  lecturer: 'Dr. Amina Toure',
  enrolled: 64,
  capacity: 80,
  status: 'Published'
},
{
  id: 2,
  name: 'Data Structures & Algorithms',
  code: 'CS201',
  faculty: 'Computing',
  lecturer: 'Prof. Kwame Mensah',
  enrolled: 120,
  capacity: 120,
  status: 'Published'
},
{
  id: 3,
  name: 'Human-Computer Interaction',
  code: 'UX305',
  faculty: 'Design',
  lecturer: 'Dr. Sara Lindqvist',
  enrolled: 45,
  capacity: 60,
  status: 'Published'
},
{
  id: 4,
  name: 'Quantum Computing Intro',
  code: 'CS505',
  faculty: 'Computing',
  lecturer: 'Unassigned',
  enrolled: 0,
  capacity: 40,
  status: 'Draft'
}];


export type Announcement = {
  id: number;
  title: string;
  body: string;
  audience: string;
  author: string;
  date: string;
  pinned: boolean;
};

export const announcements: Announcement[] = [
{
  id: 1,
  title: 'Semester registration now open',
  body: 'Registration for the Fall 2026 semester is open until July 15. Log in to enroll in your courses.',
  audience: 'All Students',
  author: 'Registrar',
  date: 'Jun 24, 2026',
  pinned: true
},
{
  id: 2,
  title: 'Campus network maintenance',
  body: 'Scheduled maintenance on Saturday 2–6 AM. Some services may be briefly unavailable.',
  audience: 'Everyone',
  author: 'IT Services',
  date: 'Jun 22, 2026',
  pinned: false
},
{
  id: 3,
  title: 'New AI research grants',
  body: 'The Faculty of Computing announces new research grants for graduate students.',
  audience: 'Computing',
  author: 'Dean of Computing',
  date: 'Jun 20, 2026',
  pinned: false
}];


export const enrollmentTrend = [
{ month: 'Jan', value: 8200 },
{ month: 'Feb', value: 8600 },
{ month: 'Mar', value: 9100 },
{ month: 'Apr', value: 9800 },
{ month: 'May', value: 10600 },
{ month: 'Jun', value: 11400 }];


export const facultyDistribution = [
{ faculty: 'Computing', students: 4200, color: '#2563EB' },
{ faculty: 'Engineering', students: 3100, color: '#10B981' },
{ faculty: 'Business', students: 2400, color: '#F59E0B' },
{ faculty: 'Design', students: 1100, color: '#8B5CF6' },
{ faculty: 'Sciences', students: 600, color: '#EF4444' }];