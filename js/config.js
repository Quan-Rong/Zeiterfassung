/**
 * config.js — Konfigurationsmodul (Sandbox)
 * 
 * Zentrale Konfiguration für die Anwendung.
 * Alle Werte sind in einem isolierten IIFE-Sandbox gespeichert, um externe Manipulation zu verhindern.
 * Defensive Programmierung: Keine externen Abhängigkeiten, keine globalen Variablen.
 */

const Config = (() => {
    'use strict';
    
    // Privater Konfigurationsspeicher - nicht von außen zugänglich
    const CONFIG = Object.freeze({
        // Home Office Limits
        HO_LIMIT_DAYS: 5.5,
        HO_LIMIT_DISPLAY: '5,5',
        
        // Standard-Arbeitszeiten
        STANDARD_HOURS: 8.0,
        MIN_PAUSE_MINUTES: 30,
        MAX_PAUSE_MINUTES: 480, // 8 Stunden
        
        // Anwendungsversion
        VERSION: '2.1.0',
        
        // Debug-Modus (nur für Entwicklung)
        DEBUG: false,
        
        // PDF-Export Einstellungen
        PDF: {
            ORIENTATION: 'portrait', // portrait = 竖版
            UNIT: 'mm',
            FORMAT: 'a4',
            MARGIN: {
                TOP: 20,
                RIGHT: 15,
                BOTTOM: 20,
                LEFT: 15
            },
            FONT_SIZE: {
                TITLE: 16,
                HEADER: 12,
                BODY: 10,
                FOOTER: 8
            },
            COLORS: {
                PRIMARY: [33, 37, 41],      // Dunkelgrau
                SECONDARY: [108, 117, 125],  // Grau
                SUCCESS: [40, 167, 69],     // Grün
                WARNING: [255, 193, 7],     // Gelb
                DANGER: [220, 53, 69],      // Rot
                INFO: [23, 162, 184],       // Blau
                LIGHT: [248, 249, 250],     // Hellgrau
                BORDER: [200, 200, 200]     // Rahmen
            }
        },
        
        // Storage-Konfiguration
        STORAGE: {
            KEY: 'zeiterfassung_data',
            BACKUP_KEY_PREFIX: 'zeiterfassung_backup_'
        },
        
        // Validierungslimits
        VALIDATION: {
            MAX_STRING_LENGTH: 1000,
            MAX_FIELD_LENGTH: {
                nachname: 100,
                vorname: 100,
                persNr: 50,
                abteilung: 100
            },
            NUMERIC_LIMITS: {
                year: { min: 2000, max: 2100 },
                month: { min: 1, max: 12 },
                pause: { min: 0, max: 480 }
            }
        }
    });
    
    /**
     * Ruft einen Konfigurationswert ab
     * @param {string} key - Konfigurationsschlüssel (z.B. 'HO_LIMIT_DAYS')
     * @param {*} defaultValue - Standardwert, falls Schlüssel nicht existiert
     * @returns {*} Konfigurationswert
     */
    function get(key, defaultValue = null) {
        try {
            const keys = key.split('.');
            let value = CONFIG;
            
            for (const k of keys) {
                if (value && typeof value === 'object' && k in value) {
                    value = value[k];
                } else {
                    return defaultValue;
                }
            }
            
            return value;
        } catch (e) {
            // Defensive: Bei Fehler Standardwert zurückgeben
            return defaultValue;
        }
    }
    
    /**
     * Prüft ob ein Konfigurationswert existiert
     * @param {string} key - Konfigurationsschlüssel
     * @returns {boolean} True, falls Schlüssel existiert
     */
    function has(key) {
        try {
            const keys = key.split('.');
            let value = CONFIG;
            
            for (const k of keys) {
                if (value && typeof value === 'object' && k in value) {
                    value = value[k];
                } else {
                    return false;
                }
            }
            
            return true;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Gibt die vollständige Konfiguration zurück (nur für Debug)
     * @returns {Object} Kopie der Konfiguration
     */
    function getAll() {
        // Tiefe Kopie erstellen, um externe Manipulation zu verhindern
        return JSON.parse(JSON.stringify(CONFIG));
    }
    
    // Öffentliche API - nur getter, keine setter
    return Object.freeze({
        get,
        has,
        getAll
    });
})();
