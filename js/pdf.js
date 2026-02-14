/**
 * pdf.js — PDF-Export-Modul (Sandbox)
 * 
 * Generiert professionelle PDF-Dokumente im Hochformat (Portrait).
 * Alle Funktionen sind in einer isolierten Sandbox, um Sicherheitsrisiken zu minimieren.
 * Defensive Programmierung: Umfassende Validierung und Fehlerbehandlung.
 * 
 * Abhängigkeiten: jsPDF (extern, über CDN geladen)
 */

const PdfExport = (() => {
    'use strict';
    
    /**
     * Prüft ob jsPDF verfügbar ist
     * @returns {boolean} True, falls jsPDF verfügbar
     * @private
     */
    function _checkJsPdfAvailable() {
        try {
            return typeof window !== 'undefined' && 
                   typeof window.jspdf !== 'undefined' && 
                   typeof window.jspdf.jsPDF === 'function';
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Formatiert eine Zahl im deutschen Format (Komma als Dezimaltrennzeichen)
     * @param {number} num - Zu formatierende Zahl
     * @param {number} decimals - Anzahl Dezimalstellen
     * @returns {string} Formatierte Zahl
     * @private
     */
    function _formatNumber(num, decimals = 1) {
        try {
            if (typeof num !== 'number' || isNaN(num)) {
                return '-';
            }
            return num.toFixed(decimals).replace('.', ',');
        } catch (e) {
            return '-';
        }
    }
    
    /**
     * Formatiert ein Datum im deutschen Format (DD.MM.YYYY)
     * @param {string} dateStr - Datumsstring (YYYY-MM-DD)
     * @returns {string} Formatiertes Datum
     * @private
     */
    function _formatDate(dateStr) {
        try {
            if (!dateStr || typeof dateStr !== 'string') {
                return '';
            }
            const parts = dateStr.split('-');
            if (parts.length !== 3) {
                return dateStr;
            }
            return `${parts[2]}.${parts[1]}.${parts[0]}`;
        } catch (e) {
            return dateStr || '';
        }
    }
    
    /**
     * Ruft Typ-Label ab (mit I18n-Unterstützung)
     * @param {string} type - Eintragstyp
     * @returns {string} Typ-Label
     * @private
     */
    function _getTypeLabel(type) {
        try {
            if (typeof I18n !== 'undefined' && I18n.t) {
                const typeMap = {
                    'homeoffice': I18n.t('typeHomeoffice'),
                    'urlaub': I18n.t('typeUrlaub'),
                    'krank': I18n.t('typeKrank'),
                    'kindkrank': I18n.t('typeKindKrank'),
                    'sonstiges': I18n.t('typeSonstiges'),
                    'gleitzeit': I18n.t('typeGleitzeit'),
                    'azk': I18n.t('typeAZK')
                };
                return typeMap[type] || type;
            }
            // Fallback ohne I18n
            const fallbackMap = {
                'homeoffice': 'Homeoffice',
                'urlaub': 'Urlaub',
                'krank': 'Krank',
                'kindkrank': 'Kind krank',
                'sonstiges': 'Sonstiges',
                'gleitzeit': 'Gleitzeit',
                'azk': 'Arbeitszeitkonto'
            };
            return fallbackMap[type] || type;
        } catch (e) {
            return type || '';
        }
    }
    
    /**
     * Erstellt eine PDF-Datei mit Monatsdaten
     * @param {number} year - Jahr
     * @param {number} month - Monat (1-12)
     * @returns {boolean} True, falls erfolgreich
     */
    function exportToPdf(year, month) {
        try {
            // Prüfe jsPDF Verfügbarkeit
            if (!_checkJsPdfAvailable()) {
                if (typeof Logger !== 'undefined') {
                    Logger.error('jsPDF nicht verfügbar. Bitte jsPDF-Bibliothek laden.');
                }
                if (typeof Toast !== 'undefined') {
                    Toast.error('PDF-Export fehlgeschlagen: jsPDF-Bibliothek nicht gefunden');
                }
                return false;
            }
            
            // Prüfe Abhängigkeiten (defensive)
            if (typeof Storage === 'undefined' || !Storage.getUserInfo || !Storage.getMonthEntries) {
                if (typeof Logger !== 'undefined') {
                    Logger.error('Storage-Modul nicht verfügbar');
                }
                if (typeof Toast !== 'undefined') {
                    Toast.error('PDF-Export fehlgeschlagen: Storage-Modul nicht gefunden');
                }
                return false;
            }
            
            if (typeof Config === 'undefined' || typeof Config.get !== 'function') {
                if (typeof Logger !== 'undefined') {
                    Logger.warn('Config-Modul nicht verfügbar, verwende Standardwerte');
                }
            }
            
            // Validierung
            if (typeof year !== 'number' || isNaN(year) || year < 2000 || year > 2100) {
                if (typeof Logger !== 'undefined') {
                    Logger.error('Ungültiges Jahr:', year);
                }
                return false;
            }
            if (typeof month !== 'number' || isNaN(month) || month < 1 || month > 12) {
                if (typeof Logger !== 'undefined') {
                    Logger.error('Ungültiger Monat:', month);
                }
                return false;
            }
            
            // Daten abrufen
            const userInfo = Storage.getUserInfo();
            const entries = Storage.getMonthEntries(year, month);
            const daysInMonth = new Date(year, month, 0).getDate();
            
            // Konfiguration abrufen (defensive: Fallback-Werte)
            const pdfConfig = (typeof Config !== 'undefined' && Config.get) ? Config.get('PDF', {}) : {};
            const margin = pdfConfig.MARGIN || { TOP: 20, RIGHT: 15, BOTTOM: 20, LEFT: 15 };
            const fontSize = pdfConfig.FONT_SIZE || { TITLE: 16, HEADER: 12, BODY: 10, FOOTER: 8 };
            const colors = pdfConfig.COLORS || {};
            
            // PDF erstellen
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: pdfConfig.ORIENTATION || 'portrait',
                unit: pdfConfig.UNIT || 'mm',
                format: pdfConfig.FORMAT || 'a4'
            });
            
            let yPos = margin.TOP;
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const contentWidth = pageWidth - margin.LEFT - margin.RIGHT;
            
            // === TITEL ===
            doc.setFontSize(fontSize.TITLE);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...(colors.PRIMARY || [33, 37, 41]));
            const title = I18n.t('appTitle') || 'Vorlage zur Dokumentation der täglichen Arbeitszeit';
            doc.text(title, margin.LEFT, yPos, { align: 'left' });
            yPos += 10;
            
            // === BENUTZERINFORMATIONEN ===
            doc.setFontSize(fontSize.HEADER);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...(colors.PRIMARY || [33, 37, 41]));
            
            const t = I18n.t;
            const labelWidth = 40;
            const valueWidth = contentWidth - labelWidth;
            
            // Nachname (jsPDF text() rendert direkt, keine HTML-Escapierung nötig, aber defensive: sicherstellen dass String)
            const safeText = (str) => {
                try {
                    if (typeof str !== 'string') str = String(str || '');
                    // Entferne potenziell problematische Zeichen für PDF
                    return str.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, '');
                } catch (e) {
                    return '';
                }
            };
            
            // Nachname
            doc.setFont('helvetica', 'bold');
            doc.text(t('nachname') || 'Nachname:', margin.LEFT, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(safeText(userInfo.nachname || ''), margin.LEFT + labelWidth, yPos);
            
            // Pers.-Nr.
            doc.setFont('helvetica', 'bold');
            doc.text(t('persNr') || 'Pers.-Nr.:', margin.LEFT + contentWidth / 2, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(safeText(userInfo.persNr || ''), margin.LEFT + contentWidth / 2 + labelWidth, yPos);
            yPos += 7;
            
            // Vorname
            doc.setFont('helvetica', 'bold');
            doc.text(t('vorname') || 'Vorname:', margin.LEFT, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(safeText(userInfo.vorname || ''), margin.LEFT + labelWidth, yPos);
            
            // Abteilung
            doc.setFont('helvetica', 'bold');
            doc.text(t('abteilung') || 'Abteilung:', margin.LEFT + contentWidth / 2, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(safeText(userInfo.abteilung || ''), margin.LEFT + contentWidth / 2 + labelWidth, yPos);
            yPos += 7;
            
            // Monat und Jahr
            const monthNames = t('months') || ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
            doc.setFont('helvetica', 'bold');
            doc.text(t('monat') || 'Monat:', margin.LEFT, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(monthNames[month - 1] || '', margin.LEFT + labelWidth, yPos);
            
            doc.setFont('helvetica', 'bold');
            doc.text(t('kalenderjahr') || 'Kalenderjahr:', margin.LEFT + contentWidth / 2, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(String(year), margin.LEFT + contentWidth / 2 + labelWidth, yPos);
            yPos += 10;
            
            // === TABELLENKOPF ===
            const colWidths = [
                contentWidth * 0.13,  // Datum
                contentWidth * 0.16,  // Wochentag
                contentWidth * 0.13,  // Beginn
                contentWidth * 0.13,  // Pause
                contentWidth * 0.13,  // Ende
                contentWidth * 0.11,  // Dauer
                contentWidth * 0.21   // Abwesenheitsgrund
            ];
            
            let xPos = margin.LEFT;
            const headerY = yPos;
            
            doc.setFontSize(fontSize.BODY);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            
            const headers = [
                t('thDatum') || 'Datum',
                t('thWochentag') || 'Wochentag',
                'Beginn',
                'Pause',
                'Ende',
                t('thDauer') || 'Dauer',
                'Abwesenheits-\ngrund*'
            ];
            
            // Header-Hintergrund
            doc.setFillColor(...(colors.PRIMARY || [33, 37, 41]));
            doc.rect(xPos, headerY - 6, contentWidth, 8, 'F');
            
            // Header-Text
            headers.forEach((header, idx) => {
                if (idx > 0) xPos += colWidths[idx - 1];
                doc.text(header, xPos + colWidths[idx] / 2, headerY, { 
                    align: 'center',
                    maxWidth: colWidths[idx] - 2
                });
            });
            
            yPos = headerY + 4;
            doc.setTextColor(...(colors.PRIMARY || [33, 37, 41]));
            
            // === TABELLENZEILEN ===
            const weekdaysDe = t('weekdays') || ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
            let totalDauer = 0;
            
            // Versionsnummer abrufen (einmalig)
            let version = '2.1.0';
            if (typeof Version !== 'undefined' && Version.getCurrentVersion) {
                version = Version.getCurrentVersion();
            } else if (typeof Config !== 'undefined' && Config.get) {
                const configVersion = Config.get('VERSION');
                if (configVersion) version = configVersion;
            }
            
            // Funktion zum Hinzufügen der Versionsinformation auf einer Seite
            const addVersionFooter = () => {
                const versionY = pageHeight - margin.BOTTOM - 2;
                doc.setFontSize(fontSize.FOOTER - 1);
                doc.setTextColor(...(colors.SECONDARY || [108, 117, 125]));
                const versionText = `Zeiterfassung v${version} — Open Source. Nutzung auf eigene Gefahr. Keine Haftung für Fehler.`;
                doc.text(versionText, margin.LEFT, versionY, { maxWidth: contentWidth });
            };
            
            // Versionsinformation auf der ersten Seite hinzufügen
            addVersionFooter();
            
            for (let day = 1; day <= daysInMonth; day++) {
                // Seitenumbruch prüfen
                if (yPos > pageHeight - margin.BOTTOM - 15) {
                    doc.addPage();
                    yPos = margin.TOP;
                    // Versionsinformation auf der neuen Seite hinzufügen
                    addVersionFooter();
                }
                
                const dateObj = new Date(year, month - 1, day);
                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const datumDisplay = _formatDate(dateStr);
                const wochentag = weekdaysDe[dateObj.getDay()] || '';
                const isWE = Holidays.isWeekend(dateObj);
                const isHol = Holidays.isHoliday(dateObj);
                const entry = entries[dateStr] || null;
                
                // Zeilenhintergrund (optional, für bessere Lesbarkeit)
                if (day % 2 === 0) {
                    doc.setFillColor(...(colors.LIGHT || [248, 249, 250]));
                    doc.rect(margin.LEFT, yPos - 4, contentWidth, 5, 'F');
                }
                
                // Rahmen
                doc.setDrawColor(...(colors.BORDER || [200, 200, 200]));
                doc.setLineWidth(0.1);
                doc.rect(margin.LEFT, yPos - 4, contentWidth, 5);
                
                xPos = margin.LEFT;
                doc.setFontSize(fontSize.BODY);
                doc.setFont('helvetica', 'normal');
                
                // Datum
                doc.text(datumDisplay, xPos + 2, yPos, { maxWidth: colWidths[0] - 4 });
                xPos += colWidths[0];
                
                // Wochentag
                let wochentagText = wochentag;
                if (isWE || isHol) {
                    doc.setTextColor(...(colors.SECONDARY || [108, 117, 125]));
                    if (isHol) {
                        wochentagText = t('typeFeiertag') || 'Feiertag';
                    }
                } else {
                    doc.setTextColor(...(colors.PRIMARY || [33, 37, 41]));
                }
                doc.text(wochentagText, xPos + 2, yPos, { maxWidth: colWidths[1] - 4 });
                xPos += colWidths[1];
                
                // Daten vorbereiten
                let beginn = '', pause = '', ende = '', dauer = '', abwesenheit = '';
                let rowColor = colors.PRIMARY || [33, 37, 41];
                
                if (entry) {
                    if (entry.type === 'homeoffice') {
                        beginn = entry.beginn || '';
                        ende = entry.ende || '';
                        pause = (entry.isHalfDay) ? '' : (entry.pause !== undefined ? String(entry.pause) : '');
                        if (entry.dauer !== undefined) {
                            dauer = _formatNumber(entry.dauer);
                            totalDauer += entry.dauer;
                        }
                        abwesenheit = entry.isHalfDay ? (t('typeHalfHomeoffice') || '0,5 Home Office') : _getTypeLabel('homeoffice');
                        rowColor = colors.SUCCESS || [40, 167, 69];
                    } else {
                        abwesenheit = _getTypeLabel(entry.type);
                        if (entry.type === 'urlaub') rowColor = colors.WARNING || [255, 193, 7];
                        else if (entry.type === 'krank' || entry.type === 'kindkrank') rowColor = colors.DANGER || [220, 53, 69];
                        else if (entry.type === 'gleitzeit') rowColor = colors.INFO || [23, 162, 184];
                    }
                } else if (isHol) {
                    abwesenheit = t('typeFeiertag') || 'Feiertag';
                    rowColor = colors.SECONDARY || [108, 117, 125];
                }
                
                doc.setTextColor(...rowColor);
                
                // Beginn
                doc.text(beginn, xPos + 2, yPos, { maxWidth: colWidths[2] - 4, align: 'center' });
                xPos += colWidths[2];
                
                // Pause
                doc.text(pause, xPos + 2, yPos, { maxWidth: colWidths[3] - 4, align: 'center' });
                xPos += colWidths[3];
                
                // Ende
                doc.text(ende, xPos + 2, yPos, { maxWidth: colWidths[4] - 4, align: 'center' });
                xPos += colWidths[4];
                
                // Dauer
                doc.text(dauer, xPos + 2, yPos, { maxWidth: colWidths[5] - 4, align: 'center' });
                xPos += colWidths[5];
                
                // Abwesenheitsgrund
                doc.text(abwesenheit, xPos + 2, yPos, { maxWidth: colWidths[6] - 4 });
                
                yPos += 5;
                doc.setTextColor(...(colors.PRIMARY || [33, 37, 41]));
            }
            
            // === ZUSAMMENFASSUNG ===
            yPos += 3;
            doc.setFontSize(fontSize.HEADER);
            doc.setFont('helvetica', 'bold');
            doc.text(t('summe') || 'Summe:', margin.LEFT, yPos);
            
            // Summe-Wert in separater Spalte
            const summeX = margin.LEFT + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4];
            doc.setDrawColor(...(colors.PRIMARY || [33, 37, 41]));
            doc.setLineWidth(0.5);
            doc.rect(summeX, yPos - 4, colWidths[5], 5);
            doc.text(_formatNumber(totalDauer), summeX + colWidths[5] / 2, yPos, { align: 'center' });
            yPos += 10;
            
            // === UNTERSCHRIFT ===
            doc.setFontSize(fontSize.BODY);
            doc.setFont('helvetica', 'normal');
            doc.setDrawColor(...(colors.PRIMARY || [33, 37, 41]));
            doc.setLineWidth(0.3);
            
            // Datum
            doc.text(t('datum') || 'Datum', margin.LEFT, yPos);
            doc.line(margin.LEFT, yPos + 1, margin.LEFT + 30, yPos + 1);
            
            // Unterschrift
            doc.text(t('unterschrift') || 'Unterschrift Mitarbeiter', margin.LEFT + 50, yPos);
            doc.line(margin.LEFT + 50, yPos + 1, margin.LEFT + 120, yPos + 1);
            
            // === FOOTER / HINWEISE (links unten auf der letzten Seite) ===
            // Prüfe ob genug Platz für Hinweise vorhanden ist, sonst neue Seite
            const footerStartY = pageHeight - margin.BOTTOM - 25;
            if (yPos + 8 > footerStartY - 20) {
                // Nicht genug Platz, neue Seite für Hinweise
                doc.addPage();
                yPos = margin.TOP;
            } else {
                yPos += 8;
            }
            
            // Hinweise links unten positionieren
            const footerY = pageHeight - margin.BOTTOM - 20;
            doc.setFontSize(fontSize.FOOTER);
            doc.setTextColor(...(colors.SECONDARY || [108, 117, 125]));
            const footerText = t('footerNote') || '* Tragen Sie in diese Spalte eines der folgenden Kürzel ein, wenn es für diesen Kalendertag zutrifft:';
            doc.text(footerText, margin.LEFT, footerY, { maxWidth: contentWidth });
            
            let codeY = footerY + 4;
            const codes = [
                'K - Krank',
                'TU - Urlaub',
                'F - Feiertag',
                'GLZ - Gleitzeit',
                'AZK - Arbeitszeitkonto'
            ];
            codes.forEach(code => {
                doc.text(code, margin.LEFT + 5, codeY);
                codeY += 3;
            });
            
            // Versionsinformation auf der letzten Seite aktualisieren (falls sie durch Hinweise überschrieben wurde)
            addVersionFooter();
            
            // === DATEI SPEICHERN ===
            // Defensive: Dateiname bereinigen
            let nachname = 'Export';
            if (typeof Security !== 'undefined' && Security.sanitizeString) {
                nachname = Security.sanitizeString(userInfo.nachname || 'Export', 50, false) || 'Export';
            } else {
                // Fallback ohne Security-Modul
                nachname = String(userInfo.nachname || 'Export').substring(0, 50);
            }
            const safeNachname = nachname.replace(/[<>:"/\\|?*]/g, '_');
            const fileName = `Zeiterfassung_${safeNachname}_${year}_${String(month).padStart(2, '0')}.pdf`;
            
            doc.save(fileName);
            
            if (typeof Logger !== 'undefined') {
                Logger.info('PDF erfolgreich erstellt:', fileName);
            }
            if (typeof Toast !== 'undefined') {
                Toast.success('PDF-Datei erstellt');
            }
            
            return true;
            
        } catch (error) {
            if (typeof Logger !== 'undefined') {
                Logger.error('PDF-Export Fehler:', error);
            }
            // Fallback: Nur wenn Logger nicht verfügbar (sollte in Produktion nicht auftreten)
            if (typeof Toast !== 'undefined') {
                Toast.error('PDF-Export fehlgeschlagen: ' + (error.message || 'Unbekannter Fehler'));
            }
            return false;
        }
    }
    
    // Öffentliche API
    return Object.freeze({
        exportToPdf
    });
})();
