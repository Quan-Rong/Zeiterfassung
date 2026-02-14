/**
 * search.js — Suchfunktionsmodul
 * 
 * Ermöglicht die Suche nach Einträgen in der Zeiterfassung.
 */

const Search = (() => {
    function init() {
        // Suchfunktion kann hier initialisiert werden
        // Z.B. Suchfeld-Event-Listener
        if (typeof Logger !== 'undefined') {
            Logger.debug('Search-Modul initialisiert');
        }
    }

    /**
     * Sucht nach Einträgen
     * @param {string|Object} query - Suchbegriff oder Suchobjekt mit type, startDate, endDate
     * @returns {Array} Liste der gefundenen Einträge
     */
    function searchEntries(query) {
        if (!query) {
            return [];
        }

        const allEntries = Storage.getAllEntries();
        const results = [];

        // Unterstützung für Objekt-basierte Suche (Typ + Datumsbereich)
        if (typeof query === 'object') {
            const { type, startDate, endDate, searchText } = query;
            
            Object.keys(allEntries).forEach(dateStr => {
                const entry = allEntries[dateStr];
                const date = new Date(dateStr + 'T00:00:00');
                
                // Typ-Filter
                if (type && entry.type !== type) {
                    return;
                }
                
                // Datumsbereich-Filter
                if (startDate) {
                    const start = new Date(startDate + 'T00:00:00');
                    if (date < start) return;
                }
                if (endDate) {
                    const end = new Date(endDate + 'T00:00:00');
                    if (date > end) return;
                }
                
                // Textsuche (optional)
                if (searchText) {
                    const searchTerm = searchText.toLowerCase().trim();
                    const dateFormatted = Utils.formatDate(date);
                    const matches = dateFormatted.toLowerCase().includes(searchTerm) ||
                        entry.type?.toLowerCase().includes(searchTerm) ||
                        entry.beginn?.includes(searchTerm) ||
                        entry.ende?.includes(searchTerm);
                    if (!matches) return;
                }
                
                results.push({
                    date: dateStr,
                    entry: entry,
                    formattedDate: Utils.formatDate(date)
                });
            });
        } else {
            // Einfache Textsuche (rückwärtskompatibel)
            const searchTerm = String(query).toLowerCase().trim();
            if (!searchTerm) return [];

            Object.keys(allEntries).forEach(dateStr => {
                const entry = allEntries[dateStr];
                const date = new Date(dateStr + 'T00:00:00');
                const dateFormatted = Utils.formatDate(date);
                
                // Suche in verschiedenen Feldern
                if (dateFormatted.toLowerCase().includes(searchTerm) ||
                    entry.type?.toLowerCase().includes(searchTerm) ||
                    entry.beginn?.includes(searchTerm) ||
                    entry.ende?.includes(searchTerm)) {
                    results.push({
                        date: dateStr,
                        entry: entry,
                        formattedDate: dateFormatted
                    });
                }
            });
        }

        // Sortiere nach Datum (neueste zuerst)
        results.sort((a, b) => {
            const dateA = new Date(a.date + 'T00:00:00');
            const dateB = new Date(b.date + 'T00:00:00');
            return dateB - dateA;
        });

        return results;
    }

    return {
        init,
        searchEntries
    };
})();
