import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function readStoredAuth() {
	if (typeof window === 'undefined') {
		return { user: null, token: null };
	}

	try {
		const rawUser = window.localStorage.getItem('learnify_user');
		const token = window.localStorage.getItem('learnify_token');
		return {
			user: rawUser ? JSON.parse(rawUser) : null,
			token,
		};
	} catch {
		return { user: null, token: null };
	}
}

export function AuthProvider({ children }) {
	const [authState, setAuthState] = useState(readStoredAuth);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		if (authState.user) {
			window.localStorage.setItem('learnify_user', JSON.stringify(authState.user));
		} else {
			window.localStorage.removeItem('learnify_user');
		}

		if (authState.token) {
			window.localStorage.setItem('learnify_token', authState.token);
		} else {
			window.localStorage.removeItem('learnify_token');
		}
	}, [authState]);

	const value = useMemo(() => {
		const login = ({ user, token }) => {
			setAuthState({ user: user ?? null, token: token ?? null });
		};

		const logout = () => setAuthState({ user: null, token: null });

		return {
			user: authState.user,
			token: authState.token,
			isAuthenticated: Boolean(authState.token),
			login,
			logout,
		};
	}, [authState]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
}

export default AuthContext;
