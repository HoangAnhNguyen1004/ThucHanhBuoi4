import React from 'react';
import StackNavigator from './StackNavigator';
import { R } from './routes';
import AssignmentListScreen from '../screens/assignments/AssignmentListScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import AssignmentFormScreen from '../screens/assignments/AssignmentFormScreen';

const screens = [
    [R.AssignmentList, AssignmentListScreen, 'Bài tập'],
    [R.AssignmentDetail, AssignmentDetailScreen, 'Chi tiết bài tập'],
    [R.AssignmentForm, AssignmentFormScreen, 'Thêm bài tập'],
];

export default function AssignmentStack() {
    return <StackNavigator screens={screens} />;
}