/**
 * storage.js — Datenpersistenz-Modul (Sandbox)
 * 
 * Verwaltet Benutzerinformationen und Zeiterfassungseinträge über localStorage.
 * Alle Datenzugriffe werden sicherheitsvalidiert, um Datenintegrität zu gewährleisten.
 */

const Storage = (() => {
    'use strict';
    const STORAGE_KEY = 'zeiterfassung_data';

    /**
     * Ruft alle Daten ab (nach Sicherheitsbereinigung)
     * @returns {Object} Alle gespeicherten Daten
     */
    function getAllData() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return { userInfo: {}, entries: {} };
        }
        try {
            const parsed = JSON.parse(raw);
            // Daten mit Sicherheitsmodul bereinigen
            return Security.sanitizeStorageData(parsed);
        } catch (e) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Storage: Datenparsing fehlgeschlagen, auf Standardwerte zurückgesetzt', e);
            }
            // Fallback: Nur wenn Logger nicht verfügbar (sollte in Produktion nicht auftreten)
            // In Produktionsumgebungen sollte Logger immer verfügbar sein
            // Bei Datenkorruption: Löschen und leere Daten zurückgeben
            clearAll();
            return { userInfo: {}, entries: {} };
        }
    }

    /**
     * Speichert alle Daten (nach Validierung)
     * @param {Object} data - Zu speichernde Daten
     */
    function saveAllData(data) {
        // Daten validieren und bereinigen
        const sanitized = Security.sanitizeStorageData(data);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
        } catch (e) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Storage: Datenspeicherung fehlgeschlagen', e);
            }
            // Fallback: Nur wenn Logger nicht verfügbar (sollte in Produktion nicht auftreten)
            throw new Error('Datenspeicherung fehlgeschlagen: Speicherplatz möglicherweise voll');
        }
    }

    /**
     * Speichert Benutzerinformationen (nach Validierung)
     * @param {Object} info - Benutzerinformationen
     */
    function saveUserInfo(info) {
        const validated = Security.validateUserInfo(info);
        if (!validated) {
            throw new Error('Benutzerinformationen-Validierung fehlgeschlagen: Enthält ungültige Daten');
        }
        const data = getAllData();
        data.userInfo = validated;
        saveAllData(data);
    }

    /**
     * Ruft Benutzerinformationen ab
     * @returns {Object} Benutzerinformationen
     */
    function getUserInfo() {
        return getAllData().userInfo || {};
    }

    /**
     * Speichert einen Eintrag (dateStr Format YYYY-MM-DD, nach Validierung)
     * @param {string} dateStr - Datumsstring
     * @param {Object} entry - Eintragsobjekt
     */
    function saveEntry(dateStr, entry) {
        // Datumsstring validieren
        const validatedDate = Security.validateDateString(dateStr);
        if (!validatedDate) {
            throw new Error('Ungültiges Datumsformat: ' + dateStr);
        }
        // Eintragsdaten validieren
        const validatedEntry = Security.validateEntry(entry);
        if (!validatedEntry) {
            throw new Error('Eintragsdaten-Validierung fehlgeschlagen: Enthält ungültige Felder oder Werte');
        }
        const data = getAllData();
        if (!data.entries) data.entries = {};
        data.entries[validatedDate] = validatedEntry;
        saveAllData(data);
    }

    /**
     * Ruft einen Eintrag ab (nach Validierung)
     * @param {string} dateStr - Datumsstring
     * @returns {Object|null} Eintrag oder null
     */
    function getEntry(dateStr) {
        const validatedDate = Security.validateDateString(dateStr);
        if (!validatedDate) {
            return null;
        }
        const data = getAllData();
        const entry = data.entries && data.entries[validatedDate];
        // Eintrag erneut validieren (defensive Programmierung)
        return entry ? Security.validateEntry(entry) : null;
    }

    /**
     * Löscht einen Eintrag (nach Validierung)
     * @param {string} dateStr - Datumsstring
     */
    function deleteEntry(dateStr) {
        const validatedDate = Security.validateDateString(dateStr);
        if (!validatedDate) {
            return; // Ungültiges Datum, stillschweigend ignorieren
        }
        const data = getAllData();
        if (data.entries && data.entries[validatedDate]) {
            delete data.entries[validatedDate];
            saveAllData(data);
        }
    }

    /**
     * Ruft alle Einträge eines Monats ab (nach Validierung)
     * @param {number} year - Jahr
     * @param {number} month - Monat (1-basiert, 1=Januar)
     * @returns {Object} dateStr -> entry
     */
    function getMonthEntries(year, month) {
        // Jahr und Monat validieren
        const validatedYear = Security.sanitizeNumber(year, Security.NUMERIC_LIMITS.year);
        const validatedMonth = Security.sanitizeNumber(month, Security.NUMERIC_LIMITS.month);
        if (!validatedYear || !validatedMonth) {
            return {};
        }
        const data = getAllData();
        const prefix = `${validatedYear}-${String(validatedMonth).padStart(2, '0')}`;
        const result = {};
        if (data.entries) {
            for (const key of Object.keys(data.entries)) {
                // Datumsstring-Format validieren
                if (Security.isValidDateString(key) && key.startsWith(prefix)) {
                    const entry = data.entries[key];
                    // Eintrag erneut validieren
                    const validated = Security.validateEntry(entry);
                    if (validated) {
                        result[key] = validated;
                    }
                }
            }
        }
        return result;
    }

    /**
     * Löscht alle Einträge eines Monats (nach Validierung)
     * @param {number} year - Jahr
     * @param {number} month - Monat
     */
    function clearMonthEntries(year, month) {
        // Jahr und Monat validieren
        const validatedYear = Security.sanitizeNumber(year, Security.NUMERIC_LIMITS.year);
        const validatedMonth = Security.sanitizeNumber(month, Security.NUMERIC_LIMITS.month);
        if (!validatedYear || !validatedMonth) {
            return;
        }
        const data = getAllData();
        const prefix = `${validatedYear}-${String(validatedMonth).padStart(2, '0')}`;
        if (data.entries) {
            let changed = false;
            for (const key of Object.keys(data.entries)) {
                if (Security.isValidDateString(key) && key.startsWith(prefix)) {
                    delete data.entries[key];
                    changed = true;
                }
            }
            if (changed) saveAllData(data);
        }
    }

    /**
     * Löscht alle Daten
     */
    function clearAll() {
        localStorage.removeItem(STORAGE_KEY);
    }

    /**
     * Ruft alle Einträge ab (für Backup-Modul)
     */
    function getAllEntries() {
        const data = getAllData();
        return data.entries || {};
    }

    return {
        getAllData,
        saveUserInfo,
        getUserInfo,
        saveEntry,
        getEntry,
        deleteEntry,
        getMonthEntries,
        clearMonthEntries,
        getAllEntries,
        clearAll
    };
})();
