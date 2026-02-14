/**
 * security.js — Sicherheits- und Validierungsmodul
 * 
 * Bietet Funktionen zur XSS-Prävention, Eingabevalidierung und sichere DOM-Manipulation.
 */

const Security = (() => {
    // Feldlängenlimits
    const MAX_FIELD_LENGTH = {
        nachname: 100,
        vorname: 100,
        persNr: 50,
        abteilung: 100
    };

    // Numerische Limits
    const NUMERIC_LIMITS = {
        pause: { min: 0, max: 480 }, // 0-8 Stunden in Minuten
        year: { min: 2000, max: 2100 },
        month: { min: 1, max: 12 }
    };

    /**
     * Escaped HTML-String
     */
    function escapeHtml(text) {
        if (typeof text !== 'string') return String(text);
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Setzt TextContent sicher (verhindert XSS)
     */
    function setTextContent(element, text) {
        if (!element) return;
        if (element.textContent !== undefined) {
            element.textContent = text || '';
        } else {
            element.innerText = text || '';
        }
    }

    /**
     * Erstellt ein DOM-Element sicher
     */
    function createElement(tagName, options = {}) {
        const el = document.createElement(tagName);
        if (options.className) {
            el.className = options.className;
        }
        if (options.id) {
            el.id = options.id;
        }
        return el;
    }

    /**
     * Bereinigt einen String (trim, max length)
     */
    function sanitizeString(str, maxLength = 1000, allowEmpty = false) {
        if (typeof str !== 'string') str = String(str || '');
        str = str.trim();
        if (!allowEmpty && !str) return '';
        if (maxLength && str.length > maxLength) {
            str = str.substring(0, maxLength);
        }
        return str;
    }

    /**
     * Bereinigt eine Boolean
     */
    function sanitizeBoolean(value) {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
            return value.toLowerCase() === 'true' || value === '1';
        }
        return Boolean(value);
    }

    /**
     * Bereinigt eine Zahl
     */
    function sanitizeNumber(value, limits = {}) {
        const num = parseInt(value, 10);
        if (isNaN(num)) return limits.default || 0;
        if (limits.min !== undefined && num < limits.min) return limits.min;
        if (limits.max !== undefined && num > limits.max) return limits.max;
        return num;
    }

    /**
     * Validiert ein Datumsstring (YYYY-MM-DD)
     */
    function isValidDateString(dateStr) {
        if (typeof dateStr !== 'string') return false;
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateStr)) return false;
        
        // Lokale Zeitzone zum Parsen verwenden, um UTC-Zeitzonenprobleme zu vermeiden
        const parts = dateStr.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        
        // Prüfen ob Datum gültig ist
        const date = new Date(year, month - 1, day);
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            return false;
        }
        
        return !isNaN(date.getTime());
    }

    /**
     * Validiert und normalisiert ein Datumsstring
     */
    function validateDateString(dateStr) {
        if (!isValidDateString(dateStr)) return null;
        return dateStr;
    }

    /**
     * Validiert ein Zeitstring (HH:MM)
     */
    function isValidTimeString(timeStr) {
        if (typeof timeStr !== 'string') return false;
        const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(timeStr);
    }

    /**
     * Escaped HTML-Attribut-String (für data-*, title, etc.)
     */
    function escapeAttr(text) {
        if (typeof text !== 'string') return String(text || '');
        return escapeHtml(text).replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
    }

    /**
     * Bereinigt und validiert Storage-Daten
     */
    function sanitizeStorageData(data) {
        if (!data || typeof data !== 'object') {
            return { userInfo: {}, entries: {} };
        }

        const result = {
            userInfo: data.userInfo || {},
            entries: {}
        };

        // Bereinige userInfo
        if (result.userInfo && typeof result.userInfo === 'object') {
            result.userInfo = {
                nachname: sanitizeString(result.userInfo.nachname || '', MAX_FIELD_LENGTH.nachname, true),
                vorname: sanitizeString(result.userInfo.vorname || '', MAX_FIELD_LENGTH.vorname, true),
                persNr: sanitizeString(result.userInfo.persNr || '', MAX_FIELD_LENGTH.persNr, true),
                abteilung: sanitizeString(result.userInfo.abteilung || '', MAX_FIELD_LENGTH.abteilung, true)
            };
        }

        // Bereinige entries
        if (data.entries && typeof data.entries === 'object') {
            Object.keys(data.entries).forEach(dateStr => {
                if (isValidDateString(dateStr)) {
                    const entry = data.entries[dateStr];
                    const validated = validateEntry(entry);
                    if (validated) {
                        result.entries[dateStr] = validated;
                    }
                }
            });
        }

        return result;
    }

    /**
     * Validiert Benutzerinformationen
     */
    function validateUserInfo(info) {
        if (!info || typeof info !== 'object') return null;

        return {
            nachname: sanitizeString(info.nachname || '', MAX_FIELD_LENGTH.nachname, true),
            vorname: sanitizeString(info.vorname || '', MAX_FIELD_LENGTH.vorname, true),
            persNr: sanitizeString(info.persNr || '', MAX_FIELD_LENGTH.persNr, true),
            abteilung: sanitizeString(info.abteilung || '', MAX_FIELD_LENGTH.abteilung, true)
        };
    }

    /**
     * Validiert einen Eintrag
     */
    function validateEntry(entry) {
        if (!entry || typeof entry !== 'object') return null;

        const validTypes = ['homeoffice', 'urlaub', 'krank', 'kindkrank', 'sonstiges', 'gleitzeit', 'azk'];
        const type = entry.type;
        if (!type || !validTypes.includes(type)) return null;

        const result = {
            type: type,
            aufgezeichnetAm: entry.aufgezeichnetAm ? validateDateString(entry.aufgezeichnetAm) : null
        };

        // Für Home Office Einträge: validiere Zeitfelder
        if (type === 'homeoffice') {
            if (entry.beginn && isValidTimeString(entry.beginn)) {
                result.beginn = entry.beginn;
            }
            if (entry.ende && isValidTimeString(entry.ende)) {
                result.ende = entry.ende;
            }
            if (entry.pause !== undefined) {
                result.pause = sanitizeNumber(entry.pause, NUMERIC_LIMITS.pause);
            }
            if (entry.dauer !== undefined) {
                const dauer = parseFloat(entry.dauer);
                if (!isNaN(dauer) && dauer >= 0 && dauer <= 24) {
                    result.dauer = dauer;
                }
            }
            result.isHalfDay = sanitizeBoolean(entry.isHalfDay);
        }

        return result;
    }

    return {
        escapeHtml,
        escapeAttr,
        setTextContent,
        createElement,
        sanitizeString,
        sanitizeBoolean,
        sanitizeNumber,
        isValidDateString,
        validateDateString,
        isValidTimeString,
        sanitizeStorageData,
        validateUserInfo,
        validateEntry,
        MAX_FIELD_LENGTH,
        NUMERIC_LIMITS
    };
})();
