/**
 * calendar.js — Kalender-Modul
 * 
 * Rendert interaktiven Monatskalender mit Monatswechsel, Heute-Hervorhebung und Feiertags-/Wochenend-Markierung.
 */

const Calendar = (() => {
    let currentYear, currentMonth; // month: 1-based
    let onDateDoubleClickCallback = null;
    let containerEl = null;

    function init(containerId) {
        containerEl = document.getElementById(containerId);
        const today = new Date();
        currentYear = today.getFullYear();
        currentMonth = today.getMonth() + 1;
    }

    function render(year, month) {
        if (year !== undefined) currentYear = year;
        if (month !== undefined) currentMonth = month;

        const t = I18n.t;
        const monthName = t('months')[currentMonth - 1];

        // Einträge des aktuellen Monats für Markierung abrufen
        const entries = Storage.getMonthEntries(currentYear, currentMonth);

        // Sichere Escapierung verwenden
        const esc = Security.escapeHtml;
        const escAttr = Security.escapeAttr;

        let html = `
        <div class="calendar-header">
            <button class="cal-nav-btn" id="calPrev" title="Vorheriger Monat">&#9664;</button>
            <span class="cal-month-title">${esc(monthName)} ${esc(String(currentYear))}</span>
            <button class="cal-nav-btn" id="calNext" title="Nächster Monat">&#9654;</button>
        </div>
        <div class="calendar-today-btn-container">
            <button class="cal-today-btn" id="calToday" title="Zum aktuellen Monat springen">Heute</button>
        </div>
        <table class="calendar-table">
            <thead><tr>`;

        // Wochentag-Header Mo-So
        const weekdaysShort = t('weekdaysShort');
        for (let i = 0; i < 7; i++) {
            html += `<th>${esc(weekdaysShort[i])}</th>`;
        }
        html += `</tr></thead><tbody>`;

        // Berechnen welcher Wochentag der erste Tag des Monats ist (0=Sonntag, muss zu Mo=0 konvertiert werden)
        const firstDay = new Date(currentYear, currentMonth - 1, 1);
        let startDow = firstDay.getDay(); // 0=Sonntag, 1=Montag, ...
        startDow = startDow === 0 ? 6 : startDow - 1; // Konvertieren zu Mo=0, Di=1, ... So=6

        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        let day = 1;
        for (let row = 0; row < 6; row++) {
            if (day > daysInMonth) break;
            html += '<tr>';
            for (let col = 0; col < 7; col++) {
                if (row === 0 && col < startDow) {
                    html += '<td class="cal-empty"></td>';
                } else if (day > daysInMonth) {
                    html += '<td class="cal-empty"></td>';
                } else {
                    const dateObj = new Date(currentYear, currentMonth - 1, day);
                    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isToday = dateStr === todayStr;
                    const isWE = Holidays.isWeekend(dateObj);
                    const isHol = Holidays.isHoliday(dateObj);
                    const holName = Holidays.getHolidayName(dateObj);
                    const hasEntry = entries[dateStr] !== undefined;

                    let classes = ['cal-day'];
                    if (isToday) classes.push('cal-today');
                    if (isWE || isHol) classes.push('cal-nonworking');
                    else classes.push('cal-working');
                    if (hasEntry) {
                        classes.push('cal-has-entry');
                        classes.push('cal-entry-' + entries[dateStr].type);
                    }

                    let title = '';
                    if (holName) title = holName;
                    if (hasEntry) {
                        const entry = entries[dateStr];
                        const typeName = getEntryTypeName(entry.type, entry.isHalfDay);
                        title += (title ? ' | ' : '') + typeName;
                    }

                    let displayContent = `<span class="cal-day-num">${esc(String(day))}</span>`;

                    // Emoji anzeigen (Feiertage/Wochenende)
                    const emoji = Holidays.getDayEmoji(dateObj);
                    if (emoji) {
                        displayContent += `<span class="cal-emoji">${esc(emoji)}</span>`;
                    } else if (hasEntry) {
                        displayContent += `<span class="cal-entry-dot"></span>`;
                    }

                    // Alle Benutzerdaten escapen
                    const safeDateStr = escAttr(dateStr);
                    const safeTitle = escAttr(title);
                    const safeClasses = escAttr(classes.join(' '));

                    html += `<td class="${safeClasses}" data-date="${safeDateStr}" title="${safeTitle}">
                        ${displayContent}
                    </td>`;
                    day++;
                }
            }
            html += '</tr>';
        }

        html += '</tbody></table>';

        // NRW-Hinweis
        html += `<div class="cal-footer-note">${esc(t('nrwHolidayNote'))}</div>`;

        containerEl.innerHTML = html;

        // Ereignisse binden
        document.getElementById('calPrev').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 1) { currentMonth = 12; currentYear--; }
            render();
            App.onMonthChange(currentYear, currentMonth);
        });

        document.getElementById('calNext').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 12) { currentMonth = 1; currentYear++; }
            render();
            App.onMonthChange(currentYear, currentMonth);
        });

        // Heute-Button
        const todayBtn = document.getElementById('calToday');
        if (todayBtn) {
            todayBtn.addEventListener('click', () => {
                if (typeof App !== 'undefined' && App.jumpToToday) {
                    App.jumpToToday();
                }
            });
        }

        // Datums-Doppelklick-Ereignis
        containerEl.querySelectorAll('.cal-day').forEach(cell => {
            cell.addEventListener('dblclick', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const dateStr = cell.getAttribute('data-date');
                
                if (!dateStr) {
                    if (typeof Logger !== 'undefined') {
                        Logger.warn('Doppelklick-Ereignis: Datumsattribut nicht gefunden');
                    }
                    return;
                }
                
                // Datumsformat validieren
                if (!Security.isValidDateString(dateStr)) {
                    if (typeof Logger !== 'undefined') {
                        Logger.warn('Doppelklick-Ereignis: Ungültiges Datumsformat', dateStr);
                    }
                    return;
                }
                
                // Doppelklick an Nicht-Arbeitstagen (Wochenende/Feiertage) deaktivieren, außer es existiert bereits ein Eintrag (zur Fehlerkorrektur)
                const dateObj = new Date(dateStr + 'T00:00:00');
                const isNonWorking = Holidays.isNonWorkingDay(dateObj);
                const hasEntry = cell.classList.contains('cal-has-entry');

                // Doppelklick verbieten, wenn Nicht-Arbeitstag und kein Eintrag vorhanden
                if (isNonWorking && !hasEntry) {
                    return;
                }

                // Callback-Funktion aufrufen
                if (onDateDoubleClickCallback) {
                    try {
                        onDateDoubleClickCallback(dateStr);
                    } catch (error) {
                        if (typeof Logger !== 'undefined') {
                            Logger.error('Doppelklick-Ereignis Callback-Fehler:', error);
                        }
                        // Fallback: Nur wenn Logger nicht verfügbar (sollte in Produktion nicht auftreten)
                    }
                } else {
                    if (typeof Logger !== 'undefined') {
                        Logger.warn('Doppelklick-Ereignis: Callback-Funktion nicht gesetzt');
                    }
                }
            });
        });
    }

    function getEntryTypeName(type, isHalfDay) {
        const t = I18n.t;
        const map = {
            homeoffice: isHalfDay ? t('typeHalfHomeoffice') : t('typeHomeoffice'),
            urlaub: t('typeUrlaub'),
            krank: t('typeKrank'),
            gleitzeit: t('typeGleitzeit'),
            azk: t('typeAZK'),
        };
        return map[type] || type;
    }

    function onDateDoubleClick(callback) {
        onDateDoubleClickCallback = callback;
    }

    function getYear() { return currentYear; }
    function getMonth() { return currentMonth; }

    function setMonth(year, month) {
        currentYear = year;
        currentMonth = month;
    }

    return { init, render, onDateDoubleClick, getYear, getMonth, setMonth };
})();
