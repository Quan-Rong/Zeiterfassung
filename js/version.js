/**
 * version.js — Versionsverwaltungsmodul
 * 
 * Verwaltet Versionsinformationen und prüft auf Updates.
 */

const Version = (() => {
    const CURRENT_VERSION = '2.1.0';
    const VERSION_KEY = 'zeiterfassung_version';

    function init() {
        const lastVersion = localStorage.getItem(VERSION_KEY);
        
        if (!lastVersion) {
            // Erste Installation
            localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
            if (typeof Toast !== 'undefined') {
                Toast.info(`Willkommen bei Zeiterfassung v${CURRENT_VERSION}!`);
            }
        } else if (lastVersion !== CURRENT_VERSION) {
            // Version wurde aktualisiert
            if (typeof Logger !== 'undefined') {
                Logger.debug(`Version aktualisiert: ${lastVersion} → ${CURRENT_VERSION}`);
            }
            localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
            
            // Zeige Update-Benachrichtigung
            if (typeof Toast !== 'undefined') {
                Toast.success(`Aktualisiert auf Version ${CURRENT_VERSION}`);
            }
            
            // Optional: Detailliertes Changelog anzeigen
            // showChangelog();
        }
    }

    /**
     * Prüft auf verfügbare Updates (für zukünftige Online-Funktionalität)
     * @returns {Promise<Object|null>} Update-Informationen oder null
     */
    async function checkForUpdates() {
        // Platzhalter für zukünftige Online-Update-Prüfung
        // Könnte eine API aufrufen, um die neueste Version zu prüfen
        return null;
    }

    /**
     * Gibt die aktuelle Version zurück
     */
    function getCurrentVersion() {
        return CURRENT_VERSION;
    }

    /**
     * Gibt die gespeicherte Version zurück
     */
    function getStoredVersion() {
        return localStorage.getItem(VERSION_KEY) || CURRENT_VERSION;
    }

    return {
        init,
        getCurrentVersion,
        getStoredVersion,
        checkForUpdates
    };
})();
