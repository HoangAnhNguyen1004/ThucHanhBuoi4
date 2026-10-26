/**
 * @param {string} title - Bắt buộc
 * @param {Function} onPress - Bắt buộc
 */
import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function AppButton({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
}) {
    const outline = variant === 'outline';

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={title}
            accessibilityState={{ disabled: disabled || loading }}
            disabled={disabled || loading}
            onPress={onPress}
            style={[
                styles.button,
                outline && styles.outline,
                (disabled || loading) && styles.disabled,
            ]}>
            {loading ? (
                <ActivityIndicator color={outline ? colors.primary : colors.white} />
            ) : (
                <Text style={[styles.text, outline && styles.outlineText]}>
                    {title}
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        minHeight: spacing.touch,
        minWidth: spacing.touch,
        backgroundColor: colors.primary,
        borderRadius: spacing.radius,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: spacing.xs,
    },
    outline: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    disabled: { opacity: 0.5 },
    text: { ...typography.button, color: colors.white },
    outlineText: { color: colors.primary },
});