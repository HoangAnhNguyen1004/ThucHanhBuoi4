/**
 * @param {object} query - Bắt buộc
 * @param {React.ReactNode} children - Bắt buộc
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoadingView from './LoadingView';
import ErrorView from './ErrorView';
import EmptyState from './EmptyState';
import LastUpdatedText from './LastUpdatedText';
import spacing from '../../theme/spacing';

export default function QueryDetail({ query, children }) {
    return (
        <View style={styles.container}>
            <LastUpdatedText timestamp={query.lastUpdated} />
            {query.loading && !query.data ? <LoadingView /> : null}
            {query.error ? (
                <ErrorView message={query.error.message} onRetry={query.refresh} />
            ) : null}
            {query.data ? children : null}
            {!query.loading && !query.error && !query.data ? (
                <EmptyState title="Không tìm thấy dữ liệu" />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: spacing.sm },
});