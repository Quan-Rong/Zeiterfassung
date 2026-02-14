/**
 * report.js — Berichtsmodul
 * 
 * Erstellt verschiedene Berichte und Statistiken aus den Zeiterfassungsdaten.
 */

const Report = (() => {
    function init() {
        // Berichtsfunktion kann hier initialisiert werden
        if (typeof Logger !== 'undefined') {
            Logger.debug('Report-Modul initialisiert');
        }
    }

    /**
     * Erstellt einen Monatsbericht
     * @param {number} year - Jahr
     * @param {number} month - Monat (1-12)
     * @returns {Object} Monatsbericht mit Statistiken
     */
    function generateMonthlyReport(year, month) {
        const entries = Storage.getMonthEntries(year, month);
        const daysInMonth = new Date(year, month, 0).getDate();
        
        const stats = {
            totalDays: daysInMonth,
            workingDays: 0,
            homeOffice: 0,
            homeOfficeHalf: 0,
            urlaub: 0,
            krank: 0,
            kindkrank: 0,
            sonstiges: 0,
            gleitzeit: 0,
            azk: 0,
            totalHours: 0,
            averageHours: 0,
            overtimeHours: 0
        };

        // Zähle Arbeitstage (ohne Wochenenden und Feiertage)
        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month - 1, day);
            if (!Holidays.isNonWorkingDay(dateObj)) {
                stats.workingDays++;
            }
        }

        Object.values(entries).forEach(entry => {
            if (entry.type === 'homeoffice') {
                if (entry.isHalfDay) {
                    stats.homeOfficeHalf += 0.5;
                } else {
                    stats.homeOffice++;
                }
                if (entry.dauer) {
                    stats.totalHours += entry.dauer;
                    // Überstunden: mehr als 7 Stunden pro Tag
                    if (entry.dauer > 7.0) {
                        stats.overtimeHours += (entry.dauer - 7.0);
                    }
                }
            } else if (entry.type === 'urlaub') {
                stats.urlaub++;
            } else if (entry.type === 'krank') {
                stats.krank++;
            } else if (entry.type === 'kindkrank') {
                stats.kindkrank++;
            } else if (entry.type === 'sonstiges') {
                stats.sonstiges++;
            } else if (entry.type === 'gleitzeit') {
                stats.gleitzeit++;
            } else if (entry.type === 'azk') {
                stats.azk++;
            }
        });

        // Berechne Durchschnittsstunden pro Arbeitstag
        const homeOfficeDays = stats.homeOffice + stats.homeOfficeHalf;
        if (homeOfficeDays > 0) {
            stats.averageHours = stats.totalHours / homeOfficeDays;
        }

        return {
            year,
            month,
            stats,
            entries: Object.keys(entries).length,
            monthName: I18n.t('months')[month - 1]
        };
    }

    /**
     * Erstellt einen Jahresbericht
     * @param {number} year - Jahr
     * @returns {Object} Jahresbericht mit monatlichen und Gesamtstatistiken
     */
    function generateYearlyReport(year) {
        const reports = [];
        for (let month = 1; month <= 12; month++) {
            reports.push(generateMonthlyReport(year, month));
        }

        const totals = {
            totalDays: 0,
            workingDays: 0,
            homeOffice: 0,
            homeOfficeHalf: 0,
            urlaub: 0,
            krank: 0,
            kindkrank: 0,
            sonstiges: 0,
            gleitzeit: 0,
            azk: 0,
            totalHours: 0,
            averageHours: 0,
            overtimeHours: 0
        };

        reports.forEach(report => {
            totals.totalDays += report.stats.totalDays;
            totals.workingDays += report.stats.workingDays;
            totals.homeOffice += report.stats.homeOffice;
            totals.homeOfficeHalf += report.stats.homeOfficeHalf;
            totals.urlaub += report.stats.urlaub;
            totals.krank += report.stats.krank;
            totals.kindkrank += report.stats.kindkrank;
            totals.sonstiges += report.stats.sonstiges;
            totals.gleitzeit += report.stats.gleitzeit;
            totals.azk += report.stats.azk;
            totals.totalHours += report.stats.totalHours;
            totals.overtimeHours += report.stats.overtimeHours;
        });

        // Berechne Jahresdurchschnitt
        const totalHomeOfficeDays = totals.homeOffice + totals.homeOfficeHalf;
        if (totalHomeOfficeDays > 0) {
            totals.averageHours = totals.totalHours / totalHomeOfficeDays;
        }

        return {
            year,
            monthlyReports: reports,
            totals
        };
    }

    /**
     * Exportiert einen Monatsbericht als Text
     * @param {number} year - Jahr
     * @param {number} month - Monat
     * @returns {string} Formatierter Berichtstext
     */
    function formatMonthlyReport(year, month) {
        const report = generateMonthlyReport(year, month);
        const s = report.stats;
        const monthName = I18n.t('months')[month - 1];
        
        let text = `MONATSBERICHT - ${monthName} ${year}\n`;
        text += '='.repeat(50) + '\n\n';
        text += `Arbeitstage: ${s.workingDays}\n`;
        text += `Home Office (Ganztag): ${s.homeOffice} Tage\n`;
        text += `Home Office (Halbtag): ${s.homeOfficeHalf} Tage\n`;
        text += `Gesamt Home Office: ${(s.homeOffice + s.homeOfficeHalf).toFixed(1)} Tage\n`;
        text += `Gesamtstunden: ${s.totalHours.toFixed(1)} Stunden\n`;
        text += `Durchschnitt pro Tag: ${s.averageHours.toFixed(1)} Stunden\n`;
        if (s.overtimeHours > 0) {
            text += `Überstunden: ${s.overtimeHours.toFixed(1)} Stunden\n`;
        }
        text += `Urlaub: ${s.urlaub} Tage\n`;
        text += `Krank: ${s.krank} Tage\n`;
        text += `Kind krank: ${s.kindkrank} Tage\n`;
        text += `Sonstiges: ${s.sonstiges} Tage\n`;
        text += `Gleitzeit: ${s.gleitzeit} Tage\n`;
        text += `AZK: ${s.azk} Tage\n`;
        
        return text;
    }

    /**
     * Exportiert einen Jahresbericht als Text
     * @param {number} year - Jahr
     * @returns {string} Formatierter Berichtstext
     */
    function formatYearlyReport(year) {
        const report = generateYearlyReport(year);
        const t = report.totals;
        
        let text = `JAHRESBERICHT - ${year}\n`;
        text += '='.repeat(50) + '\n\n';
        text += 'GESAMTSTATISTIK:\n';
        text += `Arbeitstage: ${t.workingDays}\n`;
        text += `Home Office (Ganztag): ${t.homeOffice} Tage\n`;
        text += `Home Office (Halbtag): ${t.homeOfficeHalf} Tage\n`;
        text += `Gesamt Home Office: ${(t.homeOffice + t.homeOfficeHalf).toFixed(1)} Tage\n`;
        text += `Gesamtstunden: ${t.totalHours.toFixed(1)} Stunden\n`;
        text += `Durchschnitt pro Tag: ${t.averageHours.toFixed(1)} Stunden\n`;
        if (t.overtimeHours > 0) {
            text += `Überstunden gesamt: ${t.overtimeHours.toFixed(1)} Stunden\n`;
        }
        text += `Urlaub: ${t.urlaub} Tage\n`;
        text += `Krank: ${t.krank} Tage\n`;
        text += `Kind krank: ${t.kindkrank} Tage\n`;
        text += `Sonstiges: ${t.sonstiges} Tage\n`;
        text += `Gleitzeit: ${t.gleitzeit} Tage\n`;
        text += `AZK: ${t.azk} Tage\n\n`;
        
        text += 'MONATLICHE AUFSCHLÜSSELUNG:\n';
        text += '-'.repeat(50) + '\n';
        report.monthlyReports.forEach(monthReport => {
            if (monthReport.entries > 0) {
                text += `\n${monthReport.monthName} ${year}:\n`;
                text += `  Home Office: ${(monthReport.stats.homeOffice + monthReport.stats.homeOfficeHalf).toFixed(1)} Tage\n`;
                text += `  Stunden: ${monthReport.stats.totalHours.toFixed(1)} Std\n`;
            }
        });
        
        return text;
    }

    return {
        init,
        generateMonthlyReport,
        generateYearlyReport,
        formatMonthlyReport,
        formatYearlyReport
    };
})();
