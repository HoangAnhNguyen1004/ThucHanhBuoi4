import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { formatDate } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function LastUpdatedText({ timestamp = null }) {
    if (!timestamp) {
        return null;
    }

    return (
        <Text style={styles.text}>
            Cập nhật lần cuối: {formatDate(timestamp, 'datetime')}
        </Text>
    );
}

const styles = StyleSheet.create({
    text: {
        ...typography.caption,
        color: colors.textMuted,
        marginVertical: spacing.sm,
    },
});