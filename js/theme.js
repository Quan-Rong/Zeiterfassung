/**
 * theme.js — Theme-Management-Modul
 * 
 * Verwaltet Themes (Hell/Dunkel) für die Anwendung.
 */

const Theme = (() => {
    const THEME_KEY = 'zeiterfassung_theme';
    const THEMES = {
        LIGHT: 'light',
        DARK: 'dark'
    };

    function init() {
        // Lade gespeichertes Theme
        const savedTheme = localStorage.getItem(THEME_KEY) || THEMES.LIGHT;
        setTheme(savedTheme);
    }

    /**
     * Setzt das Theme
     */
    function setTheme(theme) {
        if (!Object.values(THEMES).includes(theme)) {
            theme = THEMES.LIGHT;
        }
        
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    /**
     * Wechselt zwischen Light und Dark
     */
    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || THEMES.LIGHT;
        const newTheme = current === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
        setTheme(newTheme);
        Toast.info(`Theme gewechselt zu: ${newTheme === THEMES.LIGHT ? 'Hell' : 'Dunkel'}`);
    }

    /**
     * Gibt das aktuelle Theme zurück
     */
    function getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || THEMES.LIGHT;
    }

    return {
        init,
        setTheme,
        toggleTheme,
        getCurrentTheme,
        THEMES
    };
})();
