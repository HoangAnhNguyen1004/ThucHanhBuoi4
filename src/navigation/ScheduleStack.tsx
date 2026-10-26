import React from 'react';
import StackNavigator from './StackNavigator';
import { R } from './routes';
import ScheduleScreen from '../screens/schedule/ScheduleScreen';
import SessionDetailScreen from '../screens/schedule/SessionDetailScreen';

const screens = [
    [R.Schedule, ScheduleScreen, 'Thời khóa biểu'],
    [R.SessionDetail, SessionDetailScreen, 'Chi tiết buổi học'],
];

export default function ScheduleStack() {
    return <StackNavigator screens={screens} />;
}