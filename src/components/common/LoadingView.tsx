import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function LoadingView({ message = 'Đang tải…' }) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        ...typography.body,
        marginTop: spacing.sm,
        color: colors.textMuted,
    },
});