import React from 'react';
import StackNavigator from './StackNavigator';
import { R } from './routes';
import HomeScreen from '../screens/home/HomeScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import SessionDetailScreen from '../screens/schedule/SessionDetailScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';

const screens = [
    [R.Home, HomeScreen, 'Tổng quan'],
    [R.CourseDetail, CourseDetailScreen, 'Chi tiết môn học'],
    [R.SessionDetail, SessionDetailScreen, 'Chi tiết buổi học'],
    [R.AssignmentDetail, AssignmentDetailScreen, 'Chi tiết bài tập'],
];

export default function HomeStack() {
    return <StackNavigator screens={screens} />;
}