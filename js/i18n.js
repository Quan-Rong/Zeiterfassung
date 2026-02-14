/**
 * i18n.js — 国际化模块（德语 / 中文）
 */

const I18n = (() => {
    const translations = {
        // Header
        appTitle: 'Vorlage zur Dokumentation der täglichen Arbeitszeit',
        nachname: 'Nachname:',
        vorname: 'Vorname:',
        persNr: 'Pers.-Nr.:',
        abteilung: 'Abteilung:',
        monat: 'Monat:',
        kalenderjahr: 'Kalenderjahr:',

        // 月份名
        months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        monthsShort: ['Jan.', 'Feb.', 'Mär.', 'Apr.', 'Mai', 'Jun.',
            'Jul.', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'],

        // 星期
        weekdays: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
        weekdaysShort: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],

        // 表格表头
        thDatum: 'Datum',
        thWochentag: 'Wochentag',
        thBeginn: 'Beginn\n(Uhrzeit)',
        thPause: 'Pause\n(Dauer in\nMinuten)',
        thEnde: 'Ende\n(Uhrzeit)',
        thDauer: 'Dauer',
        thAbwesenheit: 'Abwesenheits-\ngrund*',
        thAufgezeichnet: 'aufgezeichnet\nam',
        summe: 'Summe:',
        statsTotalDays: 'Anzahl Tage:',

        // 录入表单
        formTitle: 'Zeiterfassung',
        formDate: 'Datum:',
        formBeginn: 'Beginn:',
        formEnde: 'Ende:',
        formPause: 'Pause (Min.):',
        formHalfDay: 'Halber Tag (0,5)',
        formType: 'Typ:',
        formDauer: 'Dauer:',
        formStunden: 'Stunden',
        btnConfirm: 'Bestätigen',
        btnCancel: 'Abbrechen',
        btnDelete: 'Löschen',

        // 缺勤类型
        typeHomeoffice: 'Homeoffice',
        typeHalfHomeoffice: '0,5 Home Office',
        typeUrlaub: 'Urlaub',
        typeKrank: 'Krank',
        typeFeiertag: 'Feiertag',
        typeGleitzeit: 'Gleitzeit',
        typeAZK: 'Arbeitszeitkonto',
        typeKindKrank: 'Kind krank',
        typeSonstiges: 'Sonstiges',

        // 提示
        warnPauseMin: 'Pause darf nicht weniger als 30 Minuten betragen!',
        warnOvertime: 'Arbeitszeit über 7 Stunden wird nicht auf das Zeitkonto angerechnet.',
        warnHalfDayMax: 'Arbeitszeit für einen halben Tag sollte 3,5 Stunden nicht überschreiten.',
        warnEndBeforeStart: 'Endzeit muss nach Startzeit liegen!',
        warnWeekend: 'Wochenenden können nicht als Arbeitstag erfasst werden.',

        // 按钮
        btnExport: 'Excel exportieren',
        btnPrint: 'Drucken',

        // 底部
        footerNote: '* Tragen Sie in diese Spalte eines der folgenden Kürzel ein, wenn es für diesen Kalendertag zutrifft:',
        datum: 'Datum',
        unterschrift: 'Unterschrift Mitarbeiter',
        language: 'Sprache:',

        // Home Office Counter
        hoCounterLabel: 'Homeoffice-Tage diesen Monat:',
        hoRemaining: 'Verbleibend:',
        hoOverLimit: 'Limit (5,5 Tage) überschritten!',

        // Absence Modal
        btnAddUrlaub: 'Urlaub / Gleitzeit',
        btnAddKrank: 'Krankheit / Sonstiges',
        modalTitleUrlaub: 'Abwesenheit: Urlaub / Gleitzeit',
        modalTitleKrank: 'Abwesenheit: Krankheit / Sonstiges',
        labelStart: 'Von (Datum):',
        labelEnd: 'Bis (Datum):',
        labelRangeInfo: 'Wählen Sie den Zeitraum aus.',
        checkGleitzeit: 'Als Gleitzeit (GLZ) buchen',
        labelReason: 'Grund / Art:',
        optionKrank: 'Krankheit (K)',
        optionKindKrank: 'Kind krank',
        optionOther: 'Sonstiges',
        noteKrank: 'Hinweis: Bitte ärztliches Attest ab dem 3. Tag einreichen.',

        // NRW Note
        nrwHolidayNote: 'Feiertage basieren auf den Regelungen für Nordrhein-Westfalen (NRW).',

        // 缺勤代码说明
        codeK: 'Krank',
        codeTU: 'Urlaub',
        codeF: 'Feiertag',
        codeGLZ: 'Gleitzeit',
        codeAZK: 'Arbeitszeitkonto',
    };

    function t(key) {
        return translations[key] || key;
    }

    // 兼容旧接口，虽然不再切换语言
    function getLang() { return 'de'; }
    function setLang() { } // op-op

    return { setLang, getLang, t };
})();
