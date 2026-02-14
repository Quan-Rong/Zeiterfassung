/**
 * utils.js — Utility-Funktionen
 * 
 * Allgemeine Hilfsfunktionen für die Anwendung.
 */

const Utils = (() => {
    /**
     * Debounce-Funktion
     * Verzögert die Ausführung einer Funktion bis nach einer bestimmten Zeit ohne weitere Aufrufe.
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Prüft ob zwei Zeitbereiche sich überschneiden
     * @param {string} start1 - Startzeit 1 (HH:MM)
     * @param {string} end1 - Endzeit 1 (HH:MM)
     * @param {string} start2 - Startzeit 2 (HH:MM)
     * @param {string} end2 - Endzeit 2 (HH:MM)
     * @returns {boolean}
     */
    function timeRangesOverlap(start1, end1, start2, end2) {
        const timeToMinutes = (timeStr) => {
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
        };

        const s1 = timeToMinutes(start1);
        const e1 = timeToMinutes(end1);
        const s2 = timeToMinutes(start2);
        const e2 = timeToMinutes(end2);

        return (s1 < e2 && e1 > s2);
    }

    /**
     * Formatiert ein Datum im deutschen Format
     */
    function formatDate(date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    /**
     * Formatiert eine Zahl im deutschen Format (Komma als Dezimaltrennzeichen)
     */
    function formatNumber(num, decimals = 1) {
        return String(num.toFixed(decimals)).replace('.', ',');
    }

    return {
        debounce,
        timeRangesOverlap,
        formatDate,
        formatNumber
    };
})();
