/**
 * @param {object} query - Bắt buộc
 * @param {Array} data - Bắt buộc
 * @param {Function} renderItem - Bắt buộc
 */
import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import LoadingView from './LoadingView';
import ErrorView from './ErrorView';
import EmptyState from './EmptyState';
import LastUpdatedText from './LastUpdatedText';
import spacing from '../../theme/spacing';

export default function QueryList({
    query,
    data,
    renderItem,
    header = null,
    extraData = undefined,
    emptyTitle = 'Không có dữ liệu phù hợp',
}) {
    return (
        <FlatList
            data={data}
            extraData={extraData}
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            refreshing={query.refreshing}
            onRefresh={query.refresh}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
            ListHeaderComponent={
                <View>
                    {header}
                    <LastUpdatedText timestamp={query.lastUpdated} />
                    {query.error ? (
                        <ErrorView message={query.error.message} onRetry={query.refresh} />
                    ) : null}
                </View>
            }
            ListEmptyComponent={
                query.loading ? (
                    <LoadingView />
                ) : query.error ? null : (
                    <EmptyState title={emptyTitle} />
                )
            }
        />
    );
}

const styles = StyleSheet.create({
    content: { flexGrow: 1, paddingBottom: spacing.xl },
});