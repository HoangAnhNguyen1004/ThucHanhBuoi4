import React, {createContext, useContext} from 'react';
import useCachedQuery from '../hooks/useCachedQuery';
import {
  services,
  mutate,
  newEntityId,
  isPending,
} from '../hooks/dataStore';

const AppDataContext = createContext<any>(null);
const getStudent = () => services.students.getById(1);

export const useAppData = () => useContext(AppDataContext);

/** @param {React.ReactNode} children - Bắt buộc */
export default function AppDataProvider({children}) {
  const studentQuery = useCachedQuery('students:1', getStudent);
  const courseQuery = useCachedQuery('courses', services.courses.getAll);
  const sessionQuery = useCachedQuery('sessions', services.sessions.getAll);
  const assignmentQuery = useCachedQuery(
    'assignments',
    services.assignments.getAll,
  );
  const gradeQuery = useCachedQuery('grades', services.grades.getAll);

  const courses = courseQuery.data || [];

  const attachCourse = item => ({
    ...item,
    course:
      courses.find(course => String(course.id) === String(item.courseId)) ||
      item.course,
  });

  const assignments = (assignmentQuery.data || [])
    .map(attachCourse)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const sessions = (sessionQuery.data || []).map(attachCourse);
  const grades = (gradeQuery.data || []).map(attachCourse);

  const value = {
    student: studentQuery.data,
    courses,
    assignments,
    sessions,
    grades,

    studentQuery,
    courseQuery,
    sessionQuery,
    assignmentQuery,
    gradeQuery,

    isPending,

    toggleAssignment: assignment =>
      mutate('assignments', 'PATCH', assignment.id, {
        status: assignment.status === 'done' ? 'todo' : 'done',
      }),

    createAssignment: values =>
      mutate('assignments', 'POST', newEntityId(), {
        ...values,
        status: 'todo',
      }),

    updateStudent: (id, values) =>
      mutate('students', 'PATCH', id, values),
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}
