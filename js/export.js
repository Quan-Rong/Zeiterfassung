/**
 * export.js — Excel-Export-Modul (HTML-Format)
 * 
 * Generiert eine HTML-Tabelle mit vollständigen Styles und speichert sie als .xls-Datei.
 * Excel kann HTML-Format öffnen und behält Hintergrundfarben, Rahmen etc. bei.
 */

const ExportModule = (() => {

    /**
     * Exportiert Monatsdaten als .xls (HTML-Tabelle)
     * @param {number} year - Jahr
     * @param {number} month - Monat (1-12)
     */
    function exportToExcel(year, month) {
        const t = I18n.t;
        const userInfo = Storage.getUserInfo();
        const entries = Storage.getMonthEntries(year, month);
        const daysInMonth = new Date(year, month, 0).getDate();
        
        // Sicherheits-Escapierung verwenden
        const esc = Security.escapeHtml;
        const escAttr = Security.escapeAttr;
        
        // Deutsche Wochentage
        const weekdaysDe = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
        const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

        // Stil-Definitionen
        const styles = `
            body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000000; padding: 4px; vertical-align: middle; }
            th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
            .title { font-size: 14pt; font-weight: bold; border: none; }
            .no-border { border: none; }
            .label { font-weight: bold; }
            
            /* Farbzuordnung (aus styles.css) */
            .bg-homeoffice { background-color: #e8f5e9; color: #2e7d32; }
            .bg-urlaub { background-color: #fff9c4; color: #f57f17; }
            .bg-krank { background-color: #ffebee; color: #c62828; }
            .bg-kindkrank { background-color: #fce4ec; color: #c2185b; }
            .bg-sonstiges { background-color: #f5f5f5; color: #616161; }
            .bg-gleitzeit { background-color: #e3f2fd; color: #1565c0; }
            .bg-azk { background-color: #f3e5f5; color: #6a1b9a; }
            .bg-nonworking { background-color: #eeeeee; color: #9e9e9e; font-style: italic; }
            .bg-feiertag { background-color: #eeeeee; color: #9e9e9e; font-weight: bold; }
        `;

        let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <style>${styles}</style>
        </head>
        <body>
            <table>
                <!-- Titel -->
                <tr>
                    <td colspan="8" class="title no-border">Vorlage zur Dokumentation der täglichen Arbeitszeit</td>
                </tr>
                <tr><td colspan="8" class="no-border"></td></tr>

                <!-- Benutzerinformationen -->
                <tr>
                    <td class="label no-border">Nachname:</td>
                    <td colspan="2" class="no-border">${esc(userInfo.nachname || '')}</td>
                    <td class="no-border"></td>
                    <td class="label no-border">Pers.-Nr.:</td>
                    <td colspan="3" class="no-border">${esc(userInfo.persNr || '')}</td>
                </tr>
                <tr>
                    <td class="label no-border">Vorname:</td>
                    <td colspan="2" class="no-border">${esc(userInfo.vorname || '')}</td>
                    <td class="no-border"></td>
                    <td class="label no-border">Abteilung:</td>
                    <td colspan="3" class="no-border">${esc(userInfo.abteilung || '')}</td>
                </tr>
                <tr><td colspan="8" class="no-border"></td></tr>

                <!-- Monat und Jahr -->
                <tr>
                    <td class="label no-border">Monat:</td>
                    <td class="no-border">${monthNames[month - 1]}</td>
                </tr>
                <tr>
                    <td class="label no-border">Kalenderjahr:</td>
                    <td class="no-border">${year}</td>
                </tr>
                <tr><td colspan="8" class="no-border"></td></tr>

                <!-- Tabellenkopf -->
                <tr>
                    <th>Datum</th>
                    <th>Wochentag</th>
                    <th>Beginn<br>(Uhrzeit)</th>
                    <th>Pause<br>(Dauer in<br>Minuten)</th>
                    <th>Ende<br>(Uhrzeit)</th>
                    <th>Dauer</th>
                    <th>Abwesenheits-<br>grund*</th>
                    <th>aufgezeichnet am</th>
                </tr>
        `;

        let totalDauer = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month - 1, day);
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const datumDisplay = `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;
            const wochentag = weekdaysDe[dateObj.getDay()];
            const isWE = Holidays.isWeekend(dateObj);
            const isHol = Holidays.isHoliday(dateObj);
            const entry = entries[dateStr] || null;

            // Stilklasse bestimmen
            let rowClass = '';
            if (isWE || isHol) {
                rowClass = 'bg-nonworking';
            }

            if (entry) {
                if (entry.type === 'homeoffice') rowClass = 'bg-homeoffice';
                else if (entry.type === 'urlaub') rowClass = 'bg-urlaub';
                else if (entry.type === 'krank') rowClass = 'bg-krank';
                else if (entry.type === 'kindkrank') rowClass = 'bg-kindkrank';
                else if (entry.type === 'sonstiges') rowClass = 'bg-sonstiges';
                else if (entry.type === 'gleitzeit') rowClass = 'bg-gleitzeit';
                else if (entry.type === 'azk') rowClass = 'bg-azk';
            } else if (isHol) {
                rowClass = 'bg-feiertag';
            }

            // Daten vorbereiten
            let beginn = '', pause = '', ende = '', dauer = '', abwesenheit = '', aufgezeichnet = '';

            if (entry) {
                if (entry.type === 'homeoffice') {
                    beginn = entry.beginn || '';
                    ende = entry.ende || '';
                    pause = (entry.isHalfDay) ? '' : (entry.pause !== undefined ? entry.pause : '');
                    if (entry.dauer !== undefined) {
                        dauer = entry.dauer.toFixed(1).replace('.', ','); // Eine Dezimalstelle erzwingen
                        totalDauer += entry.dauer;
                    }
                    abwesenheit = entry.isHalfDay ? '0,5 Home Office' : 'Homeoffice';
                } else if (entry.type === 'urlaub') abwesenheit = 'Urlaub';
                else if (entry.type === 'krank') abwesenheit = 'Krank';
                else if (entry.type === 'kindkrank') abwesenheit = 'Kind krank';
                else if (entry.type === 'sonstiges') abwesenheit = 'Sonstiges';
                else if (entry.type === 'gleitzeit') abwesenheit = 'Gleitzeit';
                else if (entry.type === 'azk') abwesenheit = 'Arbeitszeitkonto';
                else if (entry.type === 'feiertag') abwesenheit = 'Feiertag';

                aufgezeichnet = entry.aufgezeichnetAm || '';
            } else if (isHol) {
                abwesenheit = 'Feiertag';
            }

            // Alle Benutzerdaten escapen
            html += `<tr class="${escAttr(rowClass)}">
                <td>${esc(datumDisplay)}</td>
                <td>${esc(wochentag)}</td>
                <td>${esc(beginn)}</td>
                <td>${esc(String(pause))}</td>
                <td>${esc(ende)}</td>
                <td>${esc(dauer)}</td>
                <td>${esc(abwesenheit)}</td>
                <td>${esc(aufgezeichnet)}</td>
            </tr>`;
        }

        // Zusammenfassung
        html += `
                <tr><td colspan="8" class="no-border"></td></tr>
                <tr>
                    <td class="label no-border">Summe:</td>
                    <td class="no-border"></td>
                    <td class="no-border"></td>
                    <td class="no-border"></td>
                    <td class="no-border"></td>
                    <td class="label" style="border: 1px solid #000">${totalDauer.toFixed(1).replace('.', ',')}</td>
                    <td class="no-border"></td>
                    <td class="no-border"></td>
                </tr>
                <tr><td colspan="8" class="no-border"></td></tr>
                
                <!-- Unterschrift -->
                <tr>
                    <td class="label no-border" style="border-top: 1px solid #000 !important">Datum</td>
                    <td class="no-border"></td>
                    <td class="label no-border" colspan="3" style="border-top: 1px solid #000 !important">Unterschrift Mitarbeiter</td>
                </tr>
                <tr><td colspan="8" class="no-border"></td></tr>

                <!-- Code-Erklärung -->
                <tr><td colspan="8" class="no-border">* Tragen Sie in diese Spalte eines der folgenden Kürzel ein, wenn es für diesen Kalendertag zutrifft:</td></tr>
                <tr><td class="no-border">K</td><td class="no-border">Krank</td></tr>
                <tr><td class="no-border">TU</td><td class="no-border">Urlaub</td></tr>
                <tr><td class="no-border">F</td><td class="no-border">Feiertag</td></tr>
                <tr><td class="no-border">GLZ</td><td class="no-border">Gleitzeit</td></tr>
                <tr><td class="no-border">AZK</td><td class="no-border">Arbeitszeitkonto</td></tr>
            </table>
        </body>
        </html>
        `;

        // Datei generieren
        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        // Dateiname bereinigen (gefährliche Zeichen entfernen)
        const nachname = Security.sanitizeString(userInfo.nachname || 'Export', 50, false) || 'Export';
        // Gefährliche Zeichen aus Dateinamen entfernen
        const safeNachname = nachname.replace(/[<>:"/\\|?*]/g, '_');
        // .xls-Erweiterung verwenden, damit Excel HTML-Tabellen im Kompatibilitätsmodus öffnet
        const fileName = `Zeiterfassung_${safeNachname}_${year}_${String(month).padStart(2, '0')}.xls`;

        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        Toast.success('Excel-Datei erstellt');
    }

    return { exportToExcel };
})();
