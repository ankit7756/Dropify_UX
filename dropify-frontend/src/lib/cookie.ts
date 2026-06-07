import Cookies from 'js-cookie';

const TOKEN_KEY = 'dropify_token';
const USER_KEY = 'dropify_user';

export const setToken = (token: string): void => {
    Cookies.set(TOKEN_KEY, token, { expires: 7 });
};

export const getToken = (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
};

export const removeToken = (): void => {
    Cookies.remove(TOKEN_KEY);
};

export const setUser = (user: object): void => {
    Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7 });
};

export const getUser = (): any => {
    const user = Cookies.get(USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const removeUser = (): void => {
    Cookies.remove(USER_KEY);
};

export const clearAuth = (): void => {
    removeToken();
    removeUser();
};