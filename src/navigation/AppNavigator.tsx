import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppData } from '../context/AppDataContext';
import { R } from './routes';
import HomeStack from './HomeStack';
import CourseStack from './CourseStack';
import ScheduleStack from './ScheduleStack';
import AssignmentStack from './AssignmentStack';
import ProfileStack from './ProfileStack';
import colors from '../theme/colors';
import typography from '../theme/typography';

const Tab = createBottomTabNavigator<any>();

function TabIcon({ color, icon }: { color: string; icon: string }) {
    return <Text style={[styles.icon, { color }]}>{icon}</Text>;
}

const tabs = [
    { name: R.HomeTab, label: 'Tổng quan', icon: '⌂', component: HomeStack },
    { name: R.CourseTab, label: 'Môn học', icon: '▤', component: CourseStack },
    { name: R.ScheduleTab, label: 'Lịch học', icon: '▦', component: ScheduleStack },
    { name: R.AssignmentTab, label: 'Bài tập', icon: '✓', component: AssignmentStack },
    { name: R.ProfileTab, label: 'Cá nhân', icon: '●', component: ProfileStack },
];

export default function AppNavigator() {
    const { assignments } = useAppData();
    const unfinished = assignments.filter(item => item.status !== 'done').length;

    return (
        <NavigationContainer>
            <Tab.Navigator id="RootTabs"
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textMuted,
                    tabBarStyle: styles.tabBar,
                }}>
                {tabs.map(tab => (
                    <Tab.Screen
                        key={tab.name}
                        name={tab.name}
                        component={tab.component}
                        options={{
                            title: tab.label,
                            tabBarAccessibilityLabel: tab.label,
                            tabBarBadge:
                                tab.name === R.AssignmentTab && unfinished > 0
                                    ? unfinished
                                    : undefined,
                            // React Navigation requires an icon renderer callback here.
                            // eslint-disable-next-line react/no-unstable-nested-components
                            tabBarIcon: ({ color }) =>
                                React.createElement(TabIcon, { color, icon: tab.icon }),
                        }}
                    />
                ))}
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    icon: { ...typography.icon },
    tabBar: { backgroundColor: colors.surface, borderTopColor: colors.border },
});
