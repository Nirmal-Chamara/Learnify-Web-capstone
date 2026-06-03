import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

function readStoredTheme() {
	if (typeof window === 'undefined') {
		return 'light';
	}

	return window.localStorage.getItem('learnify_theme') || 'light';
}

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(readStoredTheme);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		window.localStorage.setItem('learnify_theme', theme);
		document.documentElement.dataset.theme = theme;
	}, [theme]);

	const value = useMemo(
		() => ({
			theme,
			setTheme,
			toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light')),
		}),
		[theme],
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}

	return context;
}

export default ThemeContext;
