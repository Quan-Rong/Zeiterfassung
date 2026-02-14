/**
 * timesheet.js — Zeitblatt-Modul
 * 
 * Rendert die rechte Zeiterfassungstabelle im Format der ursprünglichen Excel-Vorlage.
 */

const Timesheet = (() => {
    let containerEl = null;
    let onRowDoubleClickCallback = null;

    function init(containerId) {
        containerEl = document.getElementById(containerId);
    }

    /**
     * Rendert die Zeiterfassungstabelle des aktuellen Monats
     */
    function render(year, month) {
        const t = I18n.t;
        const entries = Storage.getMonthEntries(year, month);
        const daysInMonth = new Date(year, month, 0).getDate();

        // Sichere Escapierung verwenden
        const esc = Security.escapeHtml;
        const escAttr = Security.escapeAttr;

        // Deutsche Wochentag-Abkürzungen - immer Deutsch für Tabelle verwenden (konsistent mit Originalvorlage)
        const weekdaysDe = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

        let html = `<table class="timesheet-table">
            <thead>
                <tr>
                    <th class="ts-col-datum">${esc(t('thDatum'))}</th>
                    <th class="ts-col-wochentag">${esc(t('thWochentag'))}</th>
                    <th class="ts-col-beginn">${esc(t('thBeginn'))}</th>
                    <th class="ts-col-pause">${esc(t('thPause'))}</th>
                    <th class="ts-col-ende">${esc(t('thEnde'))}</th>
                    <th class="ts-col-dauer">${esc(t('thDauer'))}</th>
                    <th class="ts-col-abwesenheit">${esc(t('thAbwesenheit'))}</th>
                    <th class="ts-col-aufgezeichnet">${esc(t('thAufgezeichnet'))}</th>
                </tr>
            </thead>
            <tbody>`;

        let totalDauer = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month - 1, day);
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const datumDisplay = `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;
            const wochentag = weekdaysDe[dateObj.getDay()];
            const isWE = Holidays.isWeekend(dateObj);
            const isHol = Holidays.isHoliday(dateObj);
            const holName = Holidays.getHolidayName(dateObj);
            const entry = entries[dateStr] || null;

            let rowClass = '';
            if (isWE || isHol) {
                rowClass = 'ts-row-nonworking';
            } else {
                rowClass = 'ts-row-working';
            }

            if (entry) {
                rowClass += ' ts-row-has-entry';
                rowClass += ' ts-row-' + entry.type;
            }

            let beginn = '', pause = '', ende = '', dauer = '', abwesenheit = '', aufgezeichnet = '';

            if (entry) {
                if (entry.type === 'homeoffice') {
                    beginn = entry.beginn || '';
                    ende = entry.ende || '';
                    pause = (entry.isHalfDay) ? '' : (entry.pause !== undefined ? entry.pause : '');
                    dauer = entry.dauer !== undefined ? formatDauer(entry.dauer) : '';
                    abwesenheit = entry.isHalfDay ? '0,5 Home Office' : 'Homeoffice';
                    if (entry.dauer) totalDauer += entry.dauer;
                } else if (entry.type === 'urlaub') {
                    abwesenheit = 'Urlaub';
                } else if (entry.type === 'krank') {
                    abwesenheit = 'Krank';
                } else if (entry.type === 'kindkrank') {
                    abwesenheit = 'Kind krank';
                } else if (entry.type === 'sonstiges') {
                    abwesenheit = 'Sonstiges';
                } else if (entry.type === 'gleitzeit') {
                    abwesenheit = 'Gleitzeit';
                } else if (entry.type === 'azk') {
                    abwesenheit = 'Arbeitszeitkonto';
                }
                aufgezeichnet = entry.aufgezeichnetAm || '';
            }

            // Feiertage automatisch markieren
            if (isHol && !entry) {
                abwesenheit = 'Feiertag';
            }

            // Spezielle Klasse für Zeilen mit Eintrag hinzufügen
            let abwesenheitClass = '';
            if (entry && entry.type === 'homeoffice') abwesenheitClass = 'ts-cell-homeoffice';
            else if (entry && entry.type === 'urlaub') abwesenheitClass = 'ts-cell-urlaub';
            else if (isHol || (entry && entry.type === 'feiertag')) abwesenheitClass = 'ts-cell-feiertag';

            // Alle Benutzerdaten escapen
            const safeDateStr = escAttr(dateStr);
            const safeRowClass = escAttr(rowClass);
            const safeAbwesenheitClass = escAttr(abwesenheitClass);

            html += `<tr class="${safeRowClass}" data-date="${safeDateStr}">
                <td class="ts-col-datum">${esc(datumDisplay)}</td>
                <td class="ts-col-wochentag">${esc(wochentag)}</td>
                <td class="ts-col-beginn">${esc(beginn)}</td>
                <td class="ts-col-pause">${esc(String(pause))}</td>
                <td class="ts-col-ende">${esc(ende)}</td>
                <td class="ts-col-dauer">${esc(dauer)}</td>
                <td class="ts-col-abwesenheit ${safeAbwesenheitClass}">${esc(abwesenheit)}</td>
                <td class="ts-col-aufgezeichnet">${esc(aufgezeichnet)}</td>
            </tr>`;
        }

        html += `</tbody></table>`;

        // Statistikberechnung
        const stats = {
            homeoffice: 0,
            urlaub: 0,
            krank: 0,
            kindkrank: 0,
            sonstiges: 0,
            gleitzeit: 0,
            azk: 0
        };

        const typeMap = {
            'homeoffice': 'homeoffice',
            'urlaub': 'urlaub',
            'krank': 'krank',
            'kindkrank': 'kindkrank',
            'sonstiges': 'sonstiges',
            'gleitzeit': 'gleitzeit',
            'azk': 'azk'
        };

        Object.values(entries).forEach(entry => {
            if (entry && entry.type && typeMap[entry.type]) {
                const key = typeMap[entry.type];
                // 0,5 Tage behandeln
                const val = entry.isHalfDay ? 0.5 : 1.0;
                stats[key] += val;
            }
        });

        // Monatliche Zusammenfassung (Stunden)
        html += `<div class="ts-summe-row">
            <div class="ts-summe-item">
                <span class="ts-summe-label">${esc(t('summe'))}</span>
                <span class="ts-summe-value">${esc(formatDauer(totalDauer))} ${esc(t('formStunden'))}</span>
            </div>
        </div>`;

        // Days Stats Table
        html += `<div class="ts-stats-container">
            <h4>${esc(t('statsTotalDays'))}</h4>
            <div class="ts-stats-grid">
                <div class="ts-stat-item"><span class="stat-label">Homeoffice:</span> <span class="stat-value">${esc(formatCount(stats.homeoffice))}</span></div>
                <div class="ts-stat-item"><span class="stat-label">Urlaub:</span> <span class="stat-value">${esc(formatCount(stats.urlaub))}</span></div>
                <div class="ts-stat-item"><span class="stat-label">Gleitzeit:</span> <span class="stat-value">${esc(formatCount(stats.gleitzeit))}</span></div>
                <div class="ts-stat-item"><span class="stat-label">Krank:</span> <span class="stat-value">${esc(formatCount(stats.krank))}</span></div>
                <div class="ts-stat-item"><span class="stat-label">Kind krank:</span> <span class="stat-value">${esc(formatCount(stats.kindkrank))}</span></div>
                <div class="ts-stat-item"><span class="stat-label">Sonstiges:</span> <span class="stat-value">${esc(formatCount(stats.sonstiges))}</span></div>
                <div class="ts-stat-item"><span class="stat-label">AZK:</span> <span class="stat-value">${esc(formatCount(stats.azk))}</span></div>
            </div>
        </div>`;

        // Fußzeile
        html += `<div class="ts-footer-notes">
            <div class="ts-signature-line">
                <span class="ts-sign-datum">${esc(t('datum'))}</span>
                <span class="ts-sign-unterschrift">${esc(t('unterschrift'))}</span>
            </div>
            <p class="ts-note">${esc(t('footerNote'))}</p>
            <table class="ts-codes-table">
                <tr><td class="ts-code">K</td><td>${esc(t('codeK'))}</td></tr>
                <tr><td class="ts-code">TU</td><td>${esc(t('codeTU'))}</td></tr>
                <tr><td class="ts-code">F</td><td>${esc(t('codeF'))}</td></tr>
                <tr><td class="ts-code">GLZ</td><td>${esc(t('codeGLZ'))}</td></tr>
                <tr><td class="ts-code">AZK</td><td>${esc(t('codeAZK'))}</td></tr>
            </table>
        </div>`;

        containerEl.innerHTML = html;

        // Zeilen-Doppelklick-Ereignis binden
        containerEl.querySelectorAll('tr[data-date]').forEach(row => {
            row.addEventListener('dblclick', () => {
                const dateStr = row.getAttribute('data-date');

                // Bearbeitungsrechte für Nicht-Arbeitstage prüfen (nur Bearbeitung bestehender Einträge erlaubt)
                const isNonWorking = row.classList.contains('ts-row-nonworking');
                const hasEntry = row.classList.contains('ts-row-has-entry');

                if (isNonWorking && !hasEntry) {
                    return; // Neuen Eintrag an Nicht-Arbeitstagen verbieten
                }

                if (onRowDoubleClickCallback) {
                    onRowDoubleClickCallback(dateStr);
                }
            });
        });
    }

    function formatCount(num) {
        return String(num).replace('.', ',');
    }

    /**
     * Formatiert die Dauer
     */
    function formatDauer(hours) {
        if (hours === 0 || hours === undefined || hours === null) return '';
        // Als x,y Format anzeigen (deutsches Dezimaltrennzeichen), zwingend 1 Dezimalstelle
        return hours.toFixed(1).replace('.', ',');
    }

    /**
     * Berechnet die Arbeitsdauer
     */
    function calculateDauer(beginn, ende, pauseMinutes, isHalfDay) {
        const [bH, bM] = beginn.split(':').map(Number);
        const [eH, eM] = ende.split(':').map(Number);
        const startMinutes = bH * 60 + bM;
        const endMinutes = eH * 60 + eM;

        if (endMinutes <= startMinutes) return null;

        let workMinutes = endMinutes - startMinutes;
        if (!isHalfDay) {
            workMinutes -= pauseMinutes;
        }

        // v1.8.1: Präzise Berechnung, nicht mehr auf 0,5 Stunden gerundet
        const hours = workMinutes / 60;
        return Math.max(0, hours);
    }

    function onRowDoubleClick(callback) {
        onRowDoubleClickCallback = callback;
    }

    return { init, render, calculateDauer, formatDauer, onRowDoubleClick };
})();
