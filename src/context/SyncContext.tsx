import React, { createContext, useContext } from 'react';
import useOutboxSync from '../hooks/useOutboxSync';

const SyncContext = createContext<any>(null);

export const useSync = () => useContext(SyncContext);

/** @param {React.ReactNode} children - Bắt buộc */
export default function SyncProvider({ children }) {
    const value = useOutboxSync();

    return (
        <SyncContext.Provider value={value}>
            {children}
        </SyncContext.Provider>
    );
}
