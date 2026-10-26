import React from 'react';
import { Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function SyncBadge({ pending = false }) {
    if (!pending) {
        return null;
    }

    return <Text style={styles.badge}>Chưa đồng bộ</Text>;
}

const styles = StyleSheet.create({
    badge: {
        ...typography.caption,
        color: colors.warning,
        backgroundColor: colors.warningBackground,
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: spacing.sm,
        marginTop: spacing.sm,
    },
});