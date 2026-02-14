/**
 * logger.js — Logging-Modul (Sandbox)
 * 
 * Zentrale Logging-Funktionalität mit Debug-Modus-Kontrolle.
 * Alle Logs werden über dieses Modul geleitet, um in Produktionsumgebungen
 * Debug-Ausgaben zu unterdrücken.
 * Defensive Programmierung: Keine externen Abhängigkeiten, isolierte Sandbox.
 */

const Logger = (() => {
    'use strict';
    
    // Debug-Modus aus Konfiguration lesen (mit Fallback)
    let DEBUG_MODE = false;
    try {
        if (typeof Config !== 'undefined' && Config.get) {
            DEBUG_MODE = Config.get('DEBUG', false);
        }
    } catch (e) {
        // Defensive: Bei Fehler Debug-Modus deaktivieren
        DEBUG_MODE = false;
    }
    
    /**
     * Interne Log-Funktion mit Sicherheitsprüfung
     * @param {string} level - Log-Level ('debug', 'info', 'warn', 'error')
     * @param {Array} args - Log-Argumente
     * @private
     */
    function _log(level, args) {
        try {
            // Sicherheitsprüfung: Nur erlaubte Log-Level
            const allowedLevels = ['debug', 'info', 'warn', 'error'];
            if (!allowedLevels.includes(level)) {
                level = 'info';
            }
            
            // Debug-Logs nur im Debug-Modus ausgeben
            if (level === 'debug' && !DEBUG_MODE) {
                return;
            }
            
            // Console-Methode sicher aufrufen
            const consoleMethod = console[level] || console.log;
            if (typeof consoleMethod === 'function') {
                // Prefix für bessere Nachverfolgbarkeit
                const prefix = `[Zeiterfassung:${level.toUpperCase()}]`;
                consoleMethod(prefix, ...args);
            }
        } catch (e) {
            // Defensive: Bei Fehler stillschweigend ignorieren
            // (verhindert, dass Logging-Fehler die Anwendung crashen)
        }
    }
    
    /**
     * Debug-Log (nur im Debug-Modus)
     * @param {...*} args - Log-Argumente
     */
    function debug(...args) {
        _log('debug', args);
    }
    
    /**
     * Info-Log
     * @param {...*} args - Log-Argumente
     */
    function info(...args) {
        _log('info', args);
    }
    
    /**
     * Warn-Log
     * @param {...*} args - Log-Argumente
     */
    function warn(...args) {
        _log('warn', args);
    }
    
    /**
     * Error-Log (immer ausgegeben)
     * @param {...*} args - Log-Argumente
     */
    function error(...args) {
        _log('error', args);
    }
    
    /**
     * Aktiviert/Deaktiviert Debug-Modus (nur für Entwicklung)
     * @param {boolean} enabled - Debug-Modus aktivieren/deaktivieren
     */
    function setDebugMode(enabled) {
        try {
            if (typeof enabled === 'boolean') {
                DEBUG_MODE = enabled;
            }
        } catch (e) {
            // Defensive: Bei Fehler ignorieren
        }
    }
    
    /**
     * Prüft ob Debug-Modus aktiv ist
     * @returns {boolean} True, falls Debug-Modus aktiv
     */
    function isDebugMode() {
        return DEBUG_MODE;
    }
    
    // Öffentliche API
    return Object.freeze({
        debug,
        info,
        warn,
        error,
        setDebugMode,
        isDebugMode
    });
})();
