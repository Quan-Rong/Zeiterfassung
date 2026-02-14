/**
 * app.js — Hauptanwendungs-Controller
 * 
 * Initialisiert alle Module und koordiniert die Interaktionen zwischen Kalender, Zeitblatt und Formular.
 */

const App = (() => {
    let currentYear, currentMonth;
    let editingDate = null; // Aktuell bearbeitetes Datum
    let lastHomeOfficeTime = { beginn: '08:30', ende: '16:00', pause: 30 }; // Letzte Home Office Zeit für Auto-Fill

    function init() {
        try {
            // Module initialisieren
            Calendar.init('calendarContainer');
            Timesheet.init('timesheetContainer');

            const today = new Date();
            currentYear = today.getFullYear();
            currentMonth = today.getMonth() + 1;

            // Benutzerinformationen laden
            loadUserInfo();

            // Letzte Home Office Zeit laden
            loadLastHomeOfficeTime();

            // Benutzerinformationen-Auto-Save mit Debounce binden
            const debouncedSave = Utils.debounce(() => {
                saveUserInfo();
                Toast.success('Gespeichert');
            }, 500);

            ['inputNachname', 'inputVorname', 'inputPersNr', 'inputAbteilung'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener('input', debouncedSave);
                } else {
                    Logger.warn(`Element ${id} nicht gefunden`);
                }
            });


            // Kalender-Doppelklick
            Calendar.onDateDoubleClick((dateStr) => {
                openEntryForm(dateStr);
            });

            // Zeitblatt-Zeilen-Doppelklick
            Timesheet.onRowDoubleClick((dateStr) => {
                openEntryForm(dateStr);
            });

            // Formular-Ereignisse
            const formHalfDay = document.getElementById('formHalfDay');
            const formBeginn = document.getElementById('formBeginn');
            const formEnde = document.getElementById('formEnde');
            const formPause = document.getElementById('formPause');
            const formType = document.getElementById('formType');
            const btnFormConfirm = document.getElementById('btnFormConfirm');
            const btnFormCancel = document.getElementById('btnFormCancel');
            const btnFormDelete = document.getElementById('btnFormDelete');

            if (formHalfDay) formHalfDay.addEventListener('change', onHalfDayToggle);
            if (formBeginn) formBeginn.addEventListener('change', recalcDauer);
            if (formEnde) formEnde.addEventListener('change', recalcDauer);
            if (formPause) formPause.addEventListener('change', recalcDauer);
            if (formType) formType.addEventListener('change', onTypeChange);
            if (btnFormConfirm) {
                btnFormConfirm.addEventListener('click', confirmEntry);
            } else {
                Logger.error('Bestätigungs-Button (btnFormConfirm) nicht gefunden!');
            }
            if (btnFormCancel) btnFormCancel.addEventListener('click', cancelEntry);
            if (btnFormDelete) btnFormDelete.addEventListener('click', deleteEntry);

            // Export-Button (Excel)
            document.getElementById('btnExport').addEventListener('click', () => {
                ExportModule.exportToExcel(currentYear, currentMonth);
            });

            // PDF-Export-Button
            const btnPdfExport = document.getElementById('btnPdfExport');
            if (btnPdfExport) {
                btnPdfExport.addEventListener('click', () => {
                    if (typeof PdfExport !== 'undefined' && PdfExport.exportToPdf) {
                        PdfExport.exportToPdf(currentYear, currentMonth);
                    } else {
                        Toast.error('PDF-Export-Modul nicht verfügbar');
                        Logger.error('PdfExport-Modul nicht gefunden');
                    }
                });
            }

            // Druck-Button
            document.getElementById('btnPrint').addEventListener('click', () => {
                window.print();
            });

            // Backup-Button
            const btnBackup = document.getElementById('btnBackup');
            if (btnBackup) {
                btnBackup.addEventListener('click', () => {
                    if (typeof Backup !== 'undefined' && Backup.createBackup) {
                        Backup.createBackup();
                    } else {
                        Toast.error('Backup-Modul nicht verfügbar');
                    }
                });
            }

            // Import-Button
            const btnImport = document.getElementById('btnImport');
            if (btnImport) {
                btnImport.addEventListener('click', () => {
                    if (typeof Backup !== 'undefined' && Backup.importBackup) {
                        Backup.importBackup();
                    } else {
                        Toast.error('Backup-Modul nicht verfügbar');
                    }
                });
            }

            // Theme-Umschalt-Button
            const btnThemeToggle = document.getElementById('btnThemeToggle');
            if (btnThemeToggle) {
                btnThemeToggle.addEventListener('click', () => {
                    if (typeof Theme !== 'undefined' && Theme.toggleTheme) {
                        Theme.toggleTheme();
                        // Button-Text nach Theme-Wechsel aktualisieren
                        updateThemeButtonText();
                    } else {
                        Toast.error('Theme-Modul nicht verfügbar');
                    }
                });
                // Initial Button-Text setzen (nach Theme-Initialisierung)
                // Kurze Verzögerung, damit Theme.init() zuerst ausgeführt wird
                setTimeout(() => updateThemeButtonText(), 50);
            }

            // Monat leeren-Button (v1.7.0)
            const btnClear = document.getElementById('btnClearMonth');
            if (btnClear) {
                btnClear.addEventListener('click', () => {
                    const t = I18n.t;
                    // Einfaches Bestätigungsdialog
                    if (confirm(`Sind Sie sicher? Alle Einträge für ${currentMonth}/${currentYear} werden gelöscht.`)) {
                        Storage.clearMonthEntries(currentYear, currentMonth);
                        refreshAll();
                    }
                });
            }

            // Absence Modal initialisieren
            initAbsenceModal();

            // Backup-Funktionen initialisieren
            if (typeof Backup !== 'undefined') {
                Backup.init();
            }

            // Suchfunktion initialisieren
            if (typeof Search !== 'undefined') {
                Search.init();
            }

            // Theme-System initialisieren
            if (typeof Theme !== 'undefined') {
                Theme.init();
            }

            // Versionsprüfung initialisieren
            if (typeof Version !== 'undefined') {
                Version.init();
            }

            // Berichtsfunktion initialisieren
            if (typeof Report !== 'undefined') {
                Report.init();
            }

            // Initiales Rendering
            applyI18nToStatic();
            refreshAll();
            hideForm();
        } catch (e) {
            Logger.error('Initialisierungsfehler:', e);
            Toast.error('Ein kritischer Fehler ist aufgetreten: ' + e.message);
            // Fallback: Alert falls Toast nicht verfügbar
            if (typeof Toast === 'undefined') {
                alert('Ein kritischer Fehler ist aufgetreten:\n' + e.message + '\n\nBitte Seite neu laden.');
            }
        }
    }

    /**
     * Wendet Texte auf statische Elemente an (nur Deutsch)
     */
    function applyI18nToStatic() {
        const t = I18n.t;

        // Helper to prevent crash if element missing
        const setText = (id, key) => {
            const el = document.getElementById(id);
            if (el) Security.setTextContent(el, t(key));
            // else Logger.warn('Missing element:', id);
        };
        const setPlaceholder = (id, key) => {
            const el = document.getElementById(id);
            if (el) el.placeholder = t(key);
        };

        // Header Inputs
        setPlaceholder('inputNachname', 'nachname');
        setPlaceholder('inputVorname', 'vorname');
        setPlaceholder('inputPersNr', 'persNr');
        setPlaceholder('inputAbteilung', 'abteilung');

        // Buttons
        setText('labelBtnUrlaub', 'btnAddUrlaub');
        setText('labelBtnKrank', 'btnAddKrank');

        // Formular-Labels
        setText('formTitleText', 'formTitle');
        // labelFormDate wurde im Layout entfernt, überspringen
        // setText('labelFormDate', 'formDate'); 

        setText('labelFormBeginn', 'formBeginn');
        setText('labelFormEnde', 'formEnde');
        setText('labelFormPause', 'formPause');
        setText('labelFormHalfDay', 'formHalfDay');
        setText('labelFormType', 'formType');
        setText('labelFormDauer', 'formDauer');
        setText('btnFormConfirm', 'btnConfirm');
        setText('btnFormCancel', 'btnCancel');
        setText('btnFormDelete', 'btnDelete');
        setText('btnExport', 'btnExport');
        setText('btnPrint', 'btnPrint');

        // Abwesenheitstyp-Dropdown
        const typeSelect = document.getElementById('formType');
        if (typeSelect) {
            // Optionen auf sichere Weise erstellen
            typeSelect.innerHTML = '';
            const options = [
                { value: 'homeoffice', text: t('typeHomeoffice') },
                { value: 'urlaub', text: t('typeUrlaub') },
                { value: 'krank', text: t('typeKrank') },
                { value: 'gleitzeit', text: t('typeGleitzeit') },
                { value: 'azk', text: t('typeAZK') }
            ];
            options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                Security.setTextContent(option, opt.text);
                typeSelect.appendChild(option);
            });
        }

        // Monats-/Jahresinformationen
        updateMonthYearDisplay();
    }

    function updateMonthYearDisplay() {
        const t = I18n.t;
        const monthDisplay = document.getElementById('displayMonat');
        const yearDisplay = document.getElementById('displayJahr');
        if (monthDisplay) Security.setTextContent(monthDisplay, t('months')[currentMonth - 1]);
        if (yearDisplay) Security.setTextContent(yearDisplay, String(currentYear));
    }

    /**
     * Monatswechsel-Callback
     */
    function onMonthChange(year, month) {
        currentYear = year;
        currentMonth = month;
        Timesheet.render(year, month);
        updateMonthYearDisplay();
        updateHOCounter();
        hideForm();
    }

    /**
     * Aktualisiert alle Ansichten
     */
    function refreshAll() {
        Calendar.render(currentYear, currentMonth);
        Timesheet.render(currentYear, currentMonth);
        updateMonthYearDisplay();
        updateHOCounter();
    }

    /**
     * Springt zum aktuellen Monat
     */
    function jumpToToday() {
        const today = new Date();
        currentYear = today.getFullYear();
        currentMonth = today.getMonth() + 1;
        Calendar.setMonth(currentYear, currentMonth);
        refreshAll();
        Toast.info('Zum aktuellen Monat gesprungen');
    }

    // === Home Office Counter ===

    function updateHOCounter() {
        const entries = Storage.getMonthEntries(currentYear, currentMonth);
        let count = 0;

        Object.values(entries).forEach(entry => {
            if (entry.type === 'homeoffice') {
                if (entry.isHalfDay) {
                    count += 0.5;
                } else {
                    count += 1.0;
                }
            }
        });

        // Home Office Limit aus Konfiguration
        const limit = Config.get('HO_LIMIT_DAYS', 5.5);
        const limitDisplay = Config.get('HO_LIMIT_DISPLAY', '5,5');
        const remaining = limit - count;

        // Update UI
        const fillPercent = Math.min((count / limit) * 100, 100);
        document.getElementById('hoProgressBarFill').style.width = `${fillPercent}%`;

        // Zahlen formatieren: Deutsches Format 5,5
        const formatNum = (num) => String(num).replace('.', ',');

        Security.setTextContent(document.getElementById('hoCountDisplay'), `${formatNum(count)} / ${limitDisplay}`);

        const remainingText = I18n.t('hoRemaining') + ' ' + formatNum(Math.max(0, remaining));
        Security.setTextContent(document.getElementById('hoRemainingDisplay'), remainingText);

        const warningEl = document.getElementById('hoLimitWarning');
        if (count > limit) {
            warningEl.classList.remove('hidden');
            Security.setTextContent(warningEl, I18n.t('hoOverLimit'));
        } else {
            warningEl.classList.add('hidden');
        }
    }

    // === Urlaub Modal ===

    // === Absence Modal (Urlaub/Krank/Other) ===

    const ABSENCE_MODE = {
        URLAUB: 'urlaub',
        KRANK: 'krank'
    };
    let currentAbsenceMode = ABSENCE_MODE.URLAUB;

    function initAbsenceModal() {
        const modal = document.getElementById('absenceModal');
        const btnOpenUrlaub = document.getElementById('btnOpenUrlaubModal');
        const btnOpenKrank = document.getElementById('btnOpenKrankModal');
        const btnClose = document.getElementById('btnCloseAbsenceModal');
        const btnCancel = document.getElementById('btnCancelAbsence');
        const btnSave = document.getElementById('btnSaveAbsence');

        btnOpenUrlaub.addEventListener('click', () => openAbsenceModal(ABSENCE_MODE.URLAUB));
        btnOpenKrank.addEventListener('click', () => openAbsenceModal(ABSENCE_MODE.KRANK));

        const closeModal = () => modal.classList.add('hidden');
        btnClose.addEventListener('click', closeModal);
        btnCancel.addEventListener('click', closeModal);

        btnSave.addEventListener('click', () => {
            saveAbsenceBatch();
            closeModal();
        });
    }

    function openAbsenceModal(mode) {
        currentAbsenceMode = mode;
        const modal = document.getElementById('absenceModal');
        const titleEl = document.getElementById('modalTitleAbsence');
        const groupGleitzeit = document.getElementById('groupGleitzeit');
        const groupKrank = document.getElementById('groupKrankReason');
        const noteKrank = document.getElementById('noteKrank');

        // Reset fields
        const todayStr = new Date().toISOString().split('T')[0];
        document.getElementById('inputAbsenceStart').value = todayStr;
        document.getElementById('inputAbsenceEnd').value = todayStr;
        document.getElementById('checkGleitzeit').checked = false;
        document.getElementById('selectReason').value = 'krank';

        if (mode === ABSENCE_MODE.URLAUB) {
            Security.setTextContent(titleEl, I18n.t('modalTitleUrlaub'));
            groupGleitzeit.classList.remove('hidden');
            groupKrank.classList.add('hidden');
        } else {
            Security.setTextContent(titleEl, I18n.t('modalTitleKrank'));
            groupGleitzeit.classList.add('hidden');
            groupKrank.classList.remove('hidden');
            Security.setTextContent(noteKrank, I18n.t('noteKrank'));
        }

        // Update Static Labels inside dynamic contexts
        Security.setTextContent(document.getElementById('labelAbsenceRangeInfo'), I18n.t('labelRangeInfo'));
        Security.setTextContent(document.getElementById('labelAbsenceStart'), I18n.t('labelStart'));
        Security.setTextContent(document.getElementById('labelAbsenceEnd'), I18n.t('labelEnd'));
        Security.setTextContent(document.getElementById('labelCheckGleitzeit'), I18n.t('checkGleitzeit'));
        Security.setTextContent(document.getElementById('labelReason'), I18n.t('labelReason'));

        // Update Options
        Security.setTextContent(document.getElementById('optKrank'), I18n.t('optionKrank'));
        Security.setTextContent(document.getElementById('optKindKrank'), I18n.t('optionKindKrank'));
        Security.setTextContent(document.getElementById('optOther'), I18n.t('optionOther'));

        modal.classList.remove('hidden');
    }

    function saveAbsenceBatch() {
        const startInputEl = document.getElementById('inputAbsenceStart');
        const endInputEl = document.getElementById('inputAbsenceEnd');
        
        if (!startInputEl || !endInputEl) {
            alert('Fehler: Datumsfelder nicht gefunden');
            return;
        }

        // Datumswerte abrufen (bevorzuge value, da es Standardformat YYYY-MM-DD ist)
        let startStr = startInputEl.value.trim();
        let endStr = endInputEl.value.trim();

        // Prüfen ob leer
        if (!startStr || !endStr) {
            alert('Bitte wählen Sie Start- und Enddatum aus!');
            return;
        }

        // Datumsformat validieren
        if (!Security.isValidDateString(startStr)) {
            alert('Ungültiges Startdatum! Bitte wählen Sie ein gültiges Datum aus.');
            startInputEl.focus();
            return;
        }

        if (!Security.isValidDateString(endStr)) {
            alert('Ungültiges Enddatum! Bitte wählen Sie ein gültiges Datum aus.');
            endInputEl.focus();
            return;
        }

        // Datum parsen (lokale Zeitzone verwenden, um UTC-Probleme zu vermeiden)
        const startParts = startStr.split('-');
        const endParts = endStr.split('-');
        
        const startDate = new Date(
            parseInt(startParts[0], 10),
            parseInt(startParts[1], 10) - 1,
            parseInt(startParts[2], 10)
        );
        
        const endDate = new Date(
            parseInt(endParts[0], 10),
            parseInt(endParts[1], 10) - 1,
            parseInt(endParts[2], 10)
        );

        // Datumsobjekt validieren
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            alert('Ungültiges Datumsformat! Bitte wählen Sie gültige Daten aus.');
            return;
        }

        // Datumsreihenfolge prüfen
        if (endDate < startDate) {
            alert(I18n.t('warnEndBeforeStart') || 'Enddatum muss nach Startdatum liegen!');
            return;
        }

        // Typ bestimmen
        let type = 'urlaub';
        if (currentAbsenceMode === ABSENCE_MODE.URLAUB) {
            if (document.getElementById('checkGleitzeit').checked) {
                type = 'gleitzeit';
            } else {
                type = 'urlaub';
            }
        } else {
            // Krank-Modus
            const reason = document.getElementById('selectReason').value;
            type = reason; // 'krank', 'kindkrank', 'sonstiges'
        }

        // Heutiges Datum als String abrufen
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        // Datumsbereich durchlaufen und speichern
        let savedCount = 0;
        let curr = new Date(startDate);
        
        while (curr <= endDate) {
            // Wochenenden und Feiertage überspringen
            if (!Holidays.isNonWorkingDay(curr)) {
                const year = curr.getFullYear();
                const month = String(curr.getMonth() + 1).padStart(2, '0');
                const day = String(curr.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;
                
                // Datumsstring erneut validieren
                if (Security.isValidDateString(dateStr)) {
                    const entry = {
                        type: type,
                        aufgezeichnetAm: todayStr
                    };
                    
                    try {
                        Storage.saveEntry(dateStr, entry);
                        savedCount++;
                    } catch (e) {
                        Logger.error('Eintrag speichern fehlgeschlagen:', dateStr, e);
                    }
                }
            }
            
            // Zum nächsten Tag wechseln
            curr.setDate(curr.getDate() + 1);
        }

        if (savedCount > 0) {
            refreshAll();
            Toast.success(`${savedCount} ${savedCount === 1 ? 'Tag' : 'Tage'} gespeichert`);
        } else {
            alert('Keine gültigen Arbeitstage im ausgewählten Zeitraum gefunden.');
        }
    }

    // === Benutzerinformationen ===

    function loadUserInfo() {
        const info = Storage.getUserInfo();
        // Eingabewerte mit sicherer Escapierung setzen
        const setValue = (id, value) => {
            const el = document.getElementById(id);
            if (el) {
                el.value = Security.escapeHtml(value || '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
            }
        };
        setValue('inputNachname', info.nachname);
        setValue('inputVorname', info.vorname);
        setValue('inputPersNr', info.persNr);
        setValue('inputAbteilung', info.abteilung);
    }

    function saveUserInfo() {
        try {
            // Eingabewerte abrufen und bereinigen
            const maxLen = Security.MAX_FIELD_LENGTH || {};
            const nachname = Security.sanitizeString(document.getElementById('inputNachname').value, maxLen.nachname || 100, true);
            const vorname = Security.sanitizeString(document.getElementById('inputVorname').value, maxLen.vorname || 100, true);
            const persNr = Security.sanitizeString(document.getElementById('inputPersNr').value, maxLen.persNr || 50, true);
            const abteilung = Security.sanitizeString(document.getElementById('inputAbteilung').value, maxLen.abteilung || 100, true);
            
            Storage.saveUserInfo({
                nachname: nachname || '',
                vorname: vorname || '',
                persNr: persNr || '',
                abteilung: abteilung || '',
            });
        } catch (e) {
            Logger.error('Speichern der Benutzerinformationen fehlgeschlagen:', e);
            // Stillschweigend fehlschlagen, Benutzer nicht stören
        }
    }

    /**
     * Lädt die letzte Home Office Zeit für Auto-Fill
     */
    function loadLastHomeOfficeTime() {
        const stored = localStorage.getItem('zeiterfassung_last_ho_time');
        if (stored) {
            try {
                lastHomeOfficeTime = JSON.parse(stored);
            } catch (e) {
                Logger.warn('Fehler beim Laden der letzten Home Office Zeit:', e);
            }
        }
    }

    /**
     * Speichert die letzte Home Office Zeit
     */
    function saveLastHomeOfficeTime() {
        try {
            localStorage.setItem('zeiterfassung_last_ho_time', JSON.stringify(lastHomeOfficeTime));
        } catch (e) {
            Logger.warn('Fehler beim Speichern der letzten Home Office Zeit:', e);
        }
    }

    // === Eingabeformular ===

    function openEntryForm(dateStr) {
        if (!dateStr) {
            Logger.error('openEntryForm: Datumsstring ist leer');
            Toast.error('Fehler: Kein Datum angegeben');
            return;
        }

        // Datumsformat validieren
        const validatedDate = Security.validateDateString(dateStr);
        if (!validatedDate) {
            Logger.error('Ungültiges Datumsformat:', dateStr);
            Toast.error('Ungültiges Datumsformat: ' + dateStr);
            return;
        }

        // Validierte Datum verwenden
        dateStr = validatedDate;
        editingDate = dateStr;

        // Formular-Panel abrufen
        const formPanel = document.getElementById('entryFormPanel');
        if (!formPanel) {
            Logger.error('openEntryForm: Formular-Panel nicht gefunden');
            Toast.error('Fehler: Formular nicht gefunden');
            return;
        }

        // Formular anzeigen
        formPanel.classList.remove('hidden');
        formPanel.classList.add('visible');

        // Datum anzeigen
        const [y, m, d] = dateStr.split('-');
        const formDateDisplay = document.getElementById('formDateDisplay');
        if (formDateDisplay) {
            Security.setTextContent(formDateDisplay, `${d}.${m}.${y}`);
        }

        // Formular-Elemente abrufen
        const formType = document.getElementById('formType');
        const formBeginn = document.getElementById('formBeginn');
        const formEnde = document.getElementById('formEnde');
        const formPause = document.getElementById('formPause');
        const formHalfDay = document.getElementById('formHalfDay');
        const deleteBtn = document.getElementById('btnFormDelete');

        if (!formType || !formBeginn || !formEnde || !formPause || !formHalfDay || !deleteBtn) {
            Logger.error('openEntryForm: Formular-Elemente nicht gefunden');
            Toast.error('Fehler: Formularelemente nicht gefunden');
            hideForm();
            return;
        }

        // Bestehenden Eintrag abrufen
        const existing = Storage.getEntry(dateStr);

        if (existing) {
            // Bestehenden Eintrag bearbeiten
            formType.value = existing.type || 'homeoffice';
            onTypeChange();
            
            if (existing.type === 'homeoffice') {
                formBeginn.value = existing.beginn || '08:30';
                formEnde.value = existing.ende || '16:00';
                formPause.value = existing.pause !== undefined ? existing.pause : 30;
                formHalfDay.checked = existing.isHalfDay || false;
                onHalfDayToggle();
                recalcDauer();
            }
            deleteBtn.classList.remove('hidden');
        } else {
            // Neuen Eintrag erstellen - Standard Home Office
            formType.value = 'homeoffice';
            onTypeChange();
            formBeginn.value = lastHomeOfficeTime.beginn || '08:30';
            formEnde.value = lastHomeOfficeTime.ende || '16:00';
            formPause.value = lastHomeOfficeTime.pause || 30;
            formHalfDay.checked = false;
            onHalfDayToggle();
            recalcDauer();
            deleteBtn.classList.add('hidden');
        }

        clearWarnings();
    }

    function hideForm() {
        const formPanel = document.getElementById('entryFormPanel');
        formPanel.classList.remove('visible');
        formPanel.classList.add('hidden');
        editingDate = null;
    }

    function onTypeChange() {
        const type = document.getElementById('formType').value;
        const timeFields = document.getElementById('timeFieldsGroup');
        if (type === 'homeoffice') {
            timeFields.classList.remove('hidden');
        } else {
            timeFields.classList.add('hidden');
        }
    }

    function onHalfDayToggle() {
        const isHalf = document.getElementById('formHalfDay').checked;
        const pauseInput = document.getElementById('formPause');
        if (isHalf) {
            pauseInput.disabled = true;
            pauseInput.classList.add('disabled');
        } else {
            pauseInput.disabled = false;
            pauseInput.classList.remove('disabled');
        }
        recalcDauer();
    }

    function recalcDauer() {
        const beginn = document.getElementById('formBeginn').value;
        const ende = document.getElementById('formEnde').value;
        const pauseVal = parseInt(document.getElementById('formPause').value) || 0;
        const isHalf = document.getElementById('formHalfDay').checked;

        clearWarnings();

        if (!beginn || !ende) {
            Security.setTextContent(document.getElementById('formDauerDisplay'), '-');
            return;
        }

        const dauer = Timesheet.calculateDauer(beginn, ende, pauseVal, isHalf);

        if (dauer === null) {
            Security.setTextContent(document.getElementById('formDauerDisplay'), '-');
            showWarning(I18n.t('warnEndBeforeStart'));
            return;
        }

        Security.setTextContent(document.getElementById('formDauerDisplay'),
            `${String(dauer).replace('.', ',')} ${I18n.t('formStunden')}`);

        // Validierungsregeln
        if (!isHalf && pauseVal < 30) {
            showWarning(I18n.t('warnPauseMin'));
        }
        if (!isHalf && dauer > 7) {
            showWarning(I18n.t('warnOvertime'));
        }
        if (isHalf && dauer > 3.5) {
            showWarning(I18n.t('warnHalfDayMax'));
        }
    }

    function showWarning(msg) {
        const el = document.getElementById('formWarnings');
        if (!el) return;
        // Element und Text auf sichere Weise erstellen
        const div = Security.createElement('div', { className: 'form-warning' });
        Security.setTextContent(div, '⚠ ' + (msg || ''));
        el.appendChild(div);
    }

    function clearWarnings() {
        const el = document.getElementById('formWarnings');
        if (el) {
            // Inhalt auf sichere Weise leeren (bereits removeChild verwendet, keine Änderung nötig)
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        }
    }

    function confirmEntry() {
        Logger.debug('confirmEntry aufgerufen');
        if (!editingDate) {
            Logger.error('confirmEntry: editingDate ist leer');
            Toast.error('Fehler: Kein Datum ausgewählt');
            return;
        }

        const type = document.getElementById('formType').value;
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        let entry = {
            type: type,
            aufgezeichnetAm: todayStr,
        };

        // Variablen im Funktionsbereich deklarieren, für spätere Verwendung
        let beginn = null;
        let ende = null;
        let pauseVal = 0;

        if (type === 'homeoffice') {
            const beginnRaw = document.getElementById('formBeginn').value;
            const endeRaw = document.getElementById('formEnde').value;
            const pauseRaw = document.getElementById('formPause').value;
            const isHalf = Security.sanitizeBoolean(document.getElementById('formHalfDay').checked);
            
            // Zeitformat validieren
            if (!Security.isValidTimeString(beginnRaw) || !Security.isValidTimeString(endeRaw)) {
                alert('Ungültiges Zeitformat!');
                return;
            }
            
            beginn = beginnRaw;
            ende = endeRaw;
            pauseVal = Security.sanitizeNumber(parseInt(pauseRaw) || 0, Security.NUMERIC_LIMITS.pause) || 0;

            if (!beginn || !ende) {
                alert(I18n.t('errorTimeRange') || 'Zeitspanne ungültig');
                return;
            }
            // Zeitlogik validieren
            if (beginn >= ende) {
                alert(I18n.t('errorTimeRange') || 'Endzeit muss nach Startzeit liegen');
                return;
            }

            // Dauer berechnen (Stunden)
            const b = new Date(`2000-01-01T${beginn}`);
            const e = new Date(`2000-01-01T${ende}`);
            let diffMs = e - b;
            if (diffMs < 0) diffMs = 0;
            let diffMins = diffMs / 60000;

            // v1.8.0: Compliance-Validierung
            let workMins = 0;
            let hours = 0;
            if (isHalf) {
                workMins = diffMins; // Halbtag: keine Pause abziehen
                hours = workMins / 60;
                if (hours > 3.5) {
                    if (!confirm(`Hinweis: Halbtags-Homeoffice ist meist auf 3,5 Stunden begrenzt (Aktuell: ${hours.toFixed(1)} Std). Fortfahren?`)) {
                        return; // Speichern abbrechen
                    }
                }
            } else {
                workMins = diffMins - pauseVal;
                hours = workMins / 60;
                if (hours > 7.0) {
                    if (!confirm(`Hinweis: Ganztags-Homeoffice ist meist auf 7,0 Stunden begrenzt (Aktuell: ${hours.toFixed(1)} Std). Fortfahren?`)) {
                        return; // Speichern abbrechen
                    }
                }
            }

            entry.beginn = beginn;
            entry.ende = ende;
            entry.pause = isHalf ? 0 : pauseVal;
            entry.isHalfDay = isHalf;

            // Dauer neu berechnen und speichern (Zahl)
            if (isHalf) {
                entry.dauer = diffMins / 60;
            } else {
                entry.dauer = (diffMins - pauseVal) / 60;
            }
        }

        // Zeitkonflikt prüfen (nur für Home Office)
        if (type === 'homeoffice' && beginn && ende) {
            const existing = Storage.getEntry(editingDate);
            const excludeDate = existing ? editingDate : null;
            const conflicts = checkTimeConflicts(editingDate, beginn, ende, excludeDate);
            if (conflicts.length > 0) {
                const conflictDetails = conflicts.map(c => c.message || `Eintrag am ${c.date}`).join('\n');
                const conflictMsg = `Warnung: Zeitüberschneidung erkannt:\n\n${conflictDetails}\n\nMöchten Sie trotzdem speichern?`;
                if (!confirm(conflictMsg)) {
                    return;
                }
            }
        }

        try {
            Storage.saveEntry(editingDate, entry);
            
            // Letzte Home Office Zeit speichern
            if (type === 'homeoffice' && beginn && ende) {
                lastHomeOfficeTime = { beginn, ende, pause: pauseVal };
                saveLastHomeOfficeTime();
            }

            hideForm();
            refreshAll();
            Toast.success('Eintrag gespeichert');
        } catch (error) {
            Logger.error('Fehler beim Speichern des Eintrags:', error);
            Toast.error('Fehler beim Speichern: ' + error.message);
        }
    }

    /**
     * Prüft auf Zeitkonflikte
     * @param {string} dateStr - Datum
     * @param {string} startTime - Startzeit
     * @param {string} endTime - Endzeit
     * @param {string} excludeEntryDate - Optional: Datum eines Eintrags, der ignoriert werden soll (für Updates)
     * @returns {Array} Liste der Konflikte
     */
    function checkTimeConflicts(dateStr, startTime, endTime, excludeEntryDate = null) {
        const conflicts = [];
        const entry = Storage.getEntry(dateStr);
        
        // Prüfe bestehenden Eintrag am selben Tag (nur wenn nicht aktualisiert wird)
        if (entry && entry.type === 'homeoffice' && entry.beginn && entry.ende) {
            // Überspringe, wenn dieser Eintrag aktualisiert wird
            if (excludeEntryDate !== dateStr) {
                if (Utils.timeRangesOverlap(startTime, endTime, entry.beginn, entry.ende)) {
                    conflicts.push({ 
                        date: dateStr, 
                        entry,
                        message: `Zeitüberschneidung mit bestehendem Eintrag: ${entry.beginn} - ${entry.ende}`
                    });
                }
            }
        }
        
        return conflicts;
    }

    function cancelEntry() {
        hideForm();
    }

    function deleteEntry() {
        if (!editingDate) return;
        Storage.deleteEntry(editingDate);
        hideForm();
        refreshAll();
    }

    /**
     * Aktualisiert den Text des Theme-Buttons basierend auf dem aktuellen Theme
     */
    function updateThemeButtonText() {
        const btnThemeToggle = document.getElementById('btnThemeToggle');
        if (btnThemeToggle && typeof Theme !== 'undefined') {
            const currentTheme = Theme.getCurrentTheme();
            // Button-Text und Icon basierend auf Theme aktualisieren
            if (currentTheme === 'dark') {
                btnThemeToggle.innerHTML = '☀️ Theme';
                btnThemeToggle.title = 'Zu hellem Theme wechseln';
            } else {
                btnThemeToggle.innerHTML = '🌓 Theme';
                btnThemeToggle.title = 'Zu dunklem Theme wechseln';
            }
        }
    }

    return { 
        init, 
        onMonthChange, 
        refreshAll,
        openEntryForm,
        jumpToToday
    };
})();

// Initialisierung nach Seitenladung
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    // Modal-Initialisierung kann hier zusätzlich aufgerufen werden, oder bereits in App.init
});
