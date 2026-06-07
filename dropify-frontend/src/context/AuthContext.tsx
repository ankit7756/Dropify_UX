'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUser, setUser, setToken, clearAuth } from '@/lib/cookie';

interface User {
    _id: string;
    fullName: string;
    email: string;
    role: 'customer' | 'driver';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
    isCustomer: () => boolean;
    isDriver: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = getUser();
        if (savedUser) {
            setUserState(savedUser);
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User, token: string) => {
        setToken(token);
        setUser(userData);
        setUserState(userData);
    };

    const logout = () => {
        clearAuth();
        setUserState(null);
        window.location.href = '/';
    };

    const isCustomer = () => user?.role === 'customer';
    const isDriver = () => user?.role === 'driver';

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, isCustomer, isDriver }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};