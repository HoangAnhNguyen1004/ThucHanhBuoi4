import React from 'react';
import StackNavigator from './StackNavigator';
import { R } from './routes';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import GradeListScreen from '../screens/profile/GradeListScreen';
import GradeDetailScreen from '../screens/profile/GradeDetailScreen';

const screens = [
    [R.Profile, ProfileScreen, 'Cá nhân'],
    [R.EditProfile, EditProfileScreen, 'Chỉnh sửa thông tin'],
    [R.GradeList, GradeListScreen, 'Kết quả học tập'],
    [R.GradeDetail, GradeDetailScreen, 'Chi tiết kết quả'],
];

export default function ProfileStack() {
    return <StackNavigator screens={screens} />;
}