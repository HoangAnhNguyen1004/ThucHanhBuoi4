import { useCallback, useLayoutEffect } from 'react';
import useCachedQuery from './useCachedQuery';
import { services } from './dataStore';

export default function useDetail(resource, id, navigation, titleOf) {
    const fetcher = useCallback(
        () => services[resource].getById(id),
        [resource, id],
    );

    const query = useCachedQuery(`${resource}:${id}`, fetcher);
    const title = query.data ? titleOf(query.data) : 'Chi tiết';

    useLayoutEffect(() => {
        navigation.setOptions({ title });
    }, [navigation, title]);

    return query;
}