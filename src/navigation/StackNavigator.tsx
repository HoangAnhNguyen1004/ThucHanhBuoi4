/** @param {Array} screens - Bắt buộc */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator<any>();

export default function StackNavigator({ screens }) {
    return (
        <Stack.Navigator id="AppStack"
            screenOptions={{
                headerTintColor: colors.primary,
                headerStyle: { backgroundColor: colors.surface },
                contentStyle: { backgroundColor: colors.background },
                headerBackButtonDisplayMode: 'minimal',
            }}>
            {screens.map(([name, component, title]) => (
                <Stack.Screen
                    key={name}
                    name={name}
                    component={component}
                    options={{ title }}
                />
            ))}
        </Stack.Navigator>
    );
}
