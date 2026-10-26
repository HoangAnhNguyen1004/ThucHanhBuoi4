/**
 * @param {string} label - Bắt buộc
 * @param {string|number} value - Bắt buộc
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function InfoRow({ label, value }) {
    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{String(value ?? '—')}</Text>
        </View>
    );
}

export default React.memo(InfoRow);

const styles = StyleSheet.create({
    row: {
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        gap: spacing.xs,
    },
    label: { ...typography.caption, color: colors.textMuted },
    value: { ...typography.body, color: colors.text },
});