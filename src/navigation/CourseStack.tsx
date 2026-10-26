import React from 'react';
import StackNavigator from './StackNavigator';
import { R } from './routes';
import CourseListScreen from '../screens/courses/CourseListScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import SessionDetailScreen from '../screens/schedule/SessionDetailScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';

const screens = [
    [R.CourseList, CourseListScreen, 'Môn học'],
    [R.CourseDetail, CourseDetailScreen, 'Chi tiết môn học'],
    [R.SessionDetail, SessionDetailScreen, 'Chi tiết buổi học'],
    [R.AssignmentDetail, AssignmentDetailScreen, 'Chi tiết bài tập'],
];

export default function CourseStack() {
    return <StackNavigator screens={screens} />;
}