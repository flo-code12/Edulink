export type Course = {
  id: number;
  name: string;
  code: string;
  instructor: string;
  credits: number;
  progress: number;
  color: string;
  schedule: string;
  room: string;
  description: string;
  modules: {title: string;done: boolean;}[];
};

export const courses: Course[] = [
{
  id: 1,
  name: 'Advanced Machine Learning',
  code: 'CS401',
  instructor: 'Dr. Amina Toure',
  credits: 4,
  progress: 75,
  color: 'blue',
  schedule: 'Mon · Wed · 10:00 AM',
  room: 'Room 402',
  description:
  'Deep learning architectures, optimization, and modern neural network design with hands-on projects.',
  modules: [
  { title: 'Foundations of Neural Networks', done: true },
  { title: 'Backpropagation & Optimization', done: true },
  { title: 'Convolutional Networks', done: true },
  { title: 'Sequence Models & Attention', done: false },
  { title: 'Generative Models', done: false }]

},
{
  id: 2,
  name: 'Data Structures & Algorithms',
  code: 'CS201',
  instructor: 'Prof. Kwame Mensah',
  credits: 3,
  progress: 90,
  color: 'green',
  schedule: 'Tue · Thu · 2:00 PM',
  room: 'Online',
  description:
  'Core data structures, algorithmic complexity, and problem-solving strategies for technical interviews.',
  modules: [
  { title: 'Arrays & Linked Lists', done: true },
  { title: 'Stacks & Queues', done: true },
  { title: 'Trees & Heaps', done: true },
  { title: 'Graphs & Traversal', done: true },
  { title: 'Dynamic Programming', done: false }]

},
{
  id: 3,
  name: 'Human-Computer Interaction',
  code: 'UX305',
  instructor: 'Dr. Sara Lindqvist',
  credits: 3,
  progress: 45,
  color: 'orange',
  schedule: 'Wed · Fri · 11:00 AM',
  room: 'Studio B',
  description:
  'Principles of usability, interaction design, and user research methods applied to real products.',
  modules: [
  { title: 'Usability Principles', done: true },
  { title: 'User Research Methods', done: true },
  { title: 'Prototyping & Wireframing', done: false },
  { title: 'Evaluation & Testing', done: false }]

},
{
  id: 4,
  name: 'Discrete Mathematics',
  code: 'MA210',
  instructor: 'Prof. Daniel Okafor',
  credits: 4,
  progress: 60,
  color: 'blue',
  schedule: 'Mon · Thu · 9:00 AM',
  room: 'Room 118',
  description:
  'Logic, set theory, combinatorics, and graph theory foundations for computer science.',
  modules: [
  { title: 'Propositional Logic', done: true },
  { title: 'Set Theory', done: true },
  { title: 'Combinatorics', done: false },
  { title: 'Graph Theory', done: false }]

}];


export type Assignment = {
  id: number;
  title: string;
  course: string;
  courseName: string;
  due: string;
  dueLabel: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  type: 'Project' | 'Quiz' | 'Assignment' | 'Essay';
  points: number;
  description: string;
  instructions: string;
  grade?: string;
};

export const assignments: Assignment[] = [
{
  id: 1,
  title: 'Neural Network Implementation',
  course: 'CS401',
  courseName: 'Advanced Machine Learning',
  due: '2026-06-26',
  dueLabel: 'Today, 11:59 PM',
  status: 'pending',
  type: 'Project',
  points: 100,
  description: 'Implement a simple neural network and explain your design choices.',
  instructions: 'Submit a short summary of your implementation, your training approach, and any challenges you encountered.'
},
{
  id: 2,
  title: 'Binary Trees Quiz',
  course: 'CS201',
  courseName: 'Data Structures & Algorithms',
  due: '2026-06-27',
  dueLabel: 'Tomorrow, 5:00 PM',
  status: 'pending',
  type: 'Quiz',
  points: 25,
  description: 'Complete the binary trees quiz and show your reasoning.',
  instructions: 'Answer each question clearly and include your logic for the final problem.'
},
{
  id: 3,
  title: 'Usability Study Report',
  course: 'UX305',
  courseName: 'Human-Computer Interaction',
  due: '2026-06-29',
  dueLabel: 'Friday, 11:59 PM',
  status: 'pending',
  type: 'Assignment',
  points: 80,
  description: 'Prepare a usability study report based on the class activity.',
  instructions: 'Summarize your findings, include user observations, and explain the impact on the interface design.'
},
{
  id: 4,
  title: 'Sorting Algorithms Essay',
  course: 'CS201',
  courseName: 'Data Structures & Algorithms',
  due: '2026-06-20',
  dueLabel: 'Submitted Jun 20',
  status: 'submitted',
  type: 'Essay',
  points: 50,
  description: 'Write an essay on sorting algorithms and their trade-offs.',
  instructions: 'Discuss time complexity, stability, and where each algorithm performs best.'
},
{
  id: 5,
  title: 'Midterm Exam',
  course: 'CS401',
  courseName: 'Advanced Machine Learning',
  due: '2026-06-12',
  dueLabel: 'Graded Jun 14',
  status: 'graded',
  type: 'Assignment',
  points: 100,
  description: 'Complete the midterm assessment for the machine learning course.',
  instructions: 'Answer all questions and show your working where relevant.',
  grade: '94/100'
},
{
  id: 6,
  title: 'Combinatorics Problem Set',
  course: 'MA210',
  courseName: 'Discrete Mathematics',
  due: '2026-06-22',
  dueLabel: 'Overdue Jun 22',
  status: 'overdue',
  type: 'Assignment',
  points: 40,
  description: 'Solve the combinatorics problem set before the deadline.',
  instructions: 'Show your reasoning for each question and upload your final answers.'
}];


export type Grade = {
  course: string;
  courseName: string;
  credits: number;
  letter: string;
  gpa: number;
  percent: number;
  items: {label: string;score: string;weight: string;}[];
};

export const grades: Grade[] = [
{
  course: 'CS401',
  courseName: 'Advanced Machine Learning',
  credits: 4,
  letter: 'A',
  gpa: 4.0,
  percent: 94,
  items: [
  { label: 'Midterm Exam', score: '94/100', weight: '30%' },
  { label: 'Project Phase 1', score: '88/100', weight: '20%' },
  { label: 'Quizzes (avg)', score: '96/100', weight: '15%' }]

},
{
  course: 'CS201',
  courseName: 'Data Structures & Algorithms',
  credits: 3,
  letter: 'A-',
  gpa: 3.7,
  percent: 91,
  items: [
  { label: 'Sorting Essay', score: '46/50', weight: '20%' },
  { label: 'Trees Quiz', score: '23/25', weight: '15%' },
  { label: 'Midterm', score: '90/100', weight: '30%' }]

},
{
  course: 'UX305',
  courseName: 'Human-Computer Interaction',
  credits: 3,
  letter: 'B+',
  gpa: 3.3,
  percent: 88,
  items: [
  { label: 'Research Report', score: '88/100', weight: '25%' },
  { label: 'Prototype Review', score: '85/100', weight: '20%' }]

},
{
  course: 'MA210',
  courseName: 'Discrete Mathematics',
  credits: 4,
  letter: 'A-',
  gpa: 3.7,
  percent: 90,
  items: [
  { label: 'Logic Quiz', score: '38/40', weight: '15%' },
  { label: 'Set Theory PS', score: '45/50', weight: '20%' }]

}];


export type CalendarEvent = {
  day: number;
  title: string;
  time: string;
  type: 'class' | 'assignment' | 'exam';
  course: string;
};

export const calendarEvents: CalendarEvent[] = [
{
  day: 26,
  title: 'Advanced ML',
  time: '10:00 AM',
  type: 'class',
  course: 'CS401'
},
{
  day: 26,
  title: 'Neural Net Project Due',
  time: '11:59 PM',
  type: 'assignment',
  course: 'CS401'
},
{
  day: 27,
  title: 'Binary Trees Quiz',
  time: '5:00 PM',
  type: 'exam',
  course: 'CS201'
},
{
  day: 29,
  title: 'HCI Lecture',
  time: '11:00 AM',
  type: 'class',
  course: 'UX305'
},
{
  day: 29,
  title: 'Usability Report Due',
  time: '11:59 PM',
  type: 'assignment',
  course: 'UX305'
},
{
  day: 30,
  title: 'Discrete Math',
  time: '9:00 AM',
  type: 'class',
  course: 'MA210'
},
{
  day: 22,
  title: 'Data Structures',
  time: '2:00 PM',
  type: 'class',
  course: 'CS201'
},
{
  day: 15,
  title: 'Final Review Session',
  time: '3:00 PM',
  type: 'class',
  course: 'CS401'
}];