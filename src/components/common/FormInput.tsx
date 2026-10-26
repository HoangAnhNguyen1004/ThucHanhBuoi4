/**
 * @param {string} label - Bắt buộc
 * @param {string} value - Bắt buộc
 * @param {Function} onChangeText - Bắt buộc
 */
import React from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function FormInput({
    label,
    value,
    onChangeText,
    error = '',
    keyboardType = 'default' as KeyboardTypeOptions,
    multiline = false,
    placeholder = '',
}) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                accessibilityLabel={label}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                multiline={multiline}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                style={[styles.input, multiline && styles.multiline]}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginVertical: spacing.sm },
    label: { ...typography.button, color: colors.text, marginBottom: spacing.sm },
    input: {
        ...typography.body,
        minHeight: spacing.touch,
        padding: spacing.md,
        color: colors.text,
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: spacing.radius,
    },
    multiline: { minHeight: spacing.touch * 2, textAlignVertical: 'top' },
    error: { ...typography.caption, color: colors.danger, marginTop: spacing.xs },
});
