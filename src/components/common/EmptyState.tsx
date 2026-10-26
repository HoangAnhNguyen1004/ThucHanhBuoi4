/** @param {string} title - Bắt buộc */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function EmptyState({
    title,
    description = '',
    actionLabel = 'Thử lại',
    onAction = undefined,
}) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {description ? <Text style={styles.description}>{description}</Text> : null}
            {onAction ? (
                <AppButton title={actionLabel} onPress={onAction} variant="outline" />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: spacing.xl, alignItems: 'center' },
    title: { ...typography.h3, color: colors.text, textAlign: 'center' },
    description: {
        ...typography.body,
        color: colors.textMuted,
        textAlign: 'center',
        marginVertical: spacing.sm,
    },
});