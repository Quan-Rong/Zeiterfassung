# Zeiterfassung — Home-Office Dokumentation

**Version:** 2.1.0  
**Status:** Stabil  
**Letzte Aktualisierung:** 2026-02-15

---

## 📋 Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Schnellstart](#schnellstart)
3. [Kernfunktionen](#kernfunktionen)
4. [Detaillierte Funktionsbeschreibung](#detaillierte-funktionsbeschreibung)
5. [Geschäftsregeln & Compliance](#geschäftsregeln--compliance)
6. [Technische Architektur](#technische-architektur)
7. [Installation & Setup](#installation--setup)
8. [Bedienungsanleitung](#bedienungsanleitung)
9. [Datenverwaltung](#datenverwaltung)
10. [Export-Funktionen](#export-funktionen)
11. [Häufige Fragen (FAQ)](#häufige-fragen-faq)
12. [Dokumentation](#dokumentation)
13. [Lizenz & Rechtliches](#lizenz--rechtliches)

---

## 🎯 Übersicht

Die **Zeiterfassung** ist eine moderne, webbasierte Anwendung zur präzisen Dokumentation der täglichen Arbeitszeit, spezialisiert auf die Anforderungen für Home-Office-Regelungen. Dieses Projekt deckt alle Aspekte von der täglichen Erfassung über die Compliance-Prüfung bis hin zum professionellen Export (Excel und PDF) ab.

### Hauptmerkmale

- ✅ **100% lokal**: Alle Daten verbleiben in Ihrem Browser, keine Server-Kommunikation
- ✅ **Offline-fähig**: Funktioniert ohne Internetverbindung
- ✅ **Datenschutz**: Keine Datenübertragung an externe Server
- ✅ **Professionell**: Excel- und PDF-Export für die Personalabteilung
- ✅ **Compliance**: Automatische Prüfung von Arbeitszeitrichtlinien
- ✅ **Benutzerfreundlich**: Intuitive Bedienung, moderne Benutzeroberfläche

---

## 🚀 Schnellstart

### Schritt 1: Anwendung öffnen

Öffnen Sie die Datei `index.html` in einem modernen Webbrowser:
- **Chrome** 90+ (empfohlen)
- **Firefox** 88+
- **Edge** 90+
- **Safari** 14+

### Schritt 2: Persönliche Daten eingeben

Geben Sie Ihre persönlichen Daten ein:
- **Nachname**
- **Vorname**
- **Personalnummer**
- **Abteilung**

Diese Daten werden automatisch gespeichert und bei jedem Besuch wieder geladen.

### Schritt 3: Zeiten erfassen

1. **Doppelklicken** Sie auf einen Tag im Kalender
2. Wählen Sie den **Typ** (Home-Office, Urlaub, Krank, etc.)
3. Geben Sie **Beginn**, **Ende** und **Pause** ein (bei Home-Office)
4. Klicken Sie auf **"Bestätigen"**

### Schritt 4: Export

- **Excel-Export**: Klicken Sie auf "Als Excel exportieren" für eine `.xls`-Datei
- **PDF-Export**: Klicken Sie auf "PDF" für eine `.pdf`-Datei
- **Drucken**: Klicken Sie auf "Drucken" für eine Druckansicht

---

## ✨ Kernfunktionen

### 📅 Interaktiver Kalender

- **Monatsansicht**: Übersichtliche Darstellung des aktuellen Monats
- **Navigation**: Vor/Zurück-Buttons zum Wechseln zwischen Monaten
- **"Heute"-Button**: Schnelles Zurückspringen zum aktuellen Monat
- **Automatische Markierung**:
  - 🎉 Feiertage (NRW)
  - 🏡 Wochenenden
  - 🟢 Home-Office-Tage
  - 🟡 Urlaub
  - 🔴 Krankheit
  - 🔵 Gleitzeit/Arbeitszeitkonto

### 🏠 Präzise Home-Office Erfassung

- **Ganztags-Home-Office**:
  - Beginn- und Endzeit
  - Pause (mindestens 30 Minuten)
  - Automatische Berechnung der Arbeitsdauer
- **Halbtags-Home-Office**:
  - Beginn- und Endzeit
  - Keine Pause erforderlich
  - Automatische Berechnung (max. 3,5 Stunden)
- **Auto-Fill**: Automatische Vorbefüllung mit den letzten verwendeten Zeiten

### ⚠️ Compliance-Wächter

Die Anwendung prüft automatisch:

- **Mindestpause**: Bei Ganztags-Home-Office mindestens 30 Minuten
- **Ganztags-Limit**: Warnung bei > 7,0 Stunden
- **Halbtags-Limit**: Warnung bei > 3,5 Stunden
- **Zeitkonflikte**: Prüfung auf Überschneidungen mit anderen Einträgen
- **Home-Office-Limit**: Warnung bei Überschreitung des monatlichen Limits (Standard: 5,5 Tage)

### 📊 Echtzeit-Statistik

- **Home-Office-Counter**: Anzeige der verbrauchten Home-Office-Tage im aktuellen Monat
- **Fortschrittsbalken**: Visuelle Darstellung des Limits
- **Farbcodierung**:
  - 🟢 Grün: Unter dem Limit
  - 🟡 Gelb: Nahe am Limit
  - 🔴 Rot: Limit überschritten
- **Monatliche Zusammenfassung**: Anzahl der Tage pro Typ (Home-Office, Urlaub, Krank, etc.)

### 🌴 Batch-Erfassung

Schnelles Eintragen von Zeiträumen:

- **Urlaub**: Zeitraumauswahl mit automatischem Überspringen von Wochenenden und Feiertagen
- **Gleitzeit**: Optionale Gleitzeit-Markierung im Urlaubs-Dialog
- **Krankheit/Sonstiges**: Schnelle Einträge ohne Zeiterfassung
- **Kind krank**: Spezieller Eintragstyp

### 📥 Professional Export

#### Excel-Export (`.xls`)

- **Original-Layout**: Entspricht der offiziellen Excel-Vorlage
- **Farbtreue**: Alle Farben bleiben erhalten
- **Formatierung**: Fettgedruckte Überschriften, Rahmen, Hintergrundfarben
- **Summen**: Automatische Berechnung der monatlichen Gesamtsummen
- **Präzision**: Arbeitszeiten mit einer Nachkommastelle (z.B. "8,0")

#### PDF-Export (`.pdf`)

- **Hochformat (Portrait)**: Professionelles Layout
- **Vollständige Dokumentation**: Alle Benutzerdaten, Einträge und Summen
- **Automatische Seitennummerierung**: Bei langen Monaten
- **Unterschriftsfelder**: Für die Personalabteilung
- **Hinweise**: Erklärung der Abwesenheitskürzel

### 🔍 Erweiterte Suche

- **Typ-Filter**: Suche nach Home-Office, Urlaub, Krank, etc.
- **Datumsbereich**: Suche innerhalb eines bestimmten Zeitraums
- **Textsuche**: Suche in allen Feldern
- **Ergebnis-Navigation**: Direktes Springen zu gefundenen Einträgen

### 📈 Detaillierte Berichte

- **Monatsberichte**: 
  - Durchschnittsstunden pro Tag
  - Überstunden
  - Anzahl der Arbeitstage
  - Verteilung der Abwesenheitstypen
- **Jahresberichte**:
  - Gesamtübersicht über 12 Monate
  - Trends und Statistiken

### 🌙 Dunkles Theme

- **Automatische Erkennung**: Erkennt Systempräferenz
- **Manuelle Umschaltung**: Toggle-Button in der Benutzeroberfläche
- **Optimierte Farben**: Bessere Lesbarkeit bei wenig Licht
- **Persistenz**: Einstellung wird gespeichert

### 💾 Datenschutz

- **Lokale Speicherung**: Alle Daten in `localStorage` des Browsers
- **Keine Server-Kommunikation**: 100% offline-fähig
- **Backup-Funktion**: Export/Import von JSON-Backups
- **Automatisches Backup**: Beim Excel-Export wird automatisch ein Backup erstellt

---

## 📖 Detaillierte Funktionsbeschreibung

### Zeiterfassung (Home-Office)

#### Eingabeformular

Das Eingabeformular öffnet sich beim Doppelklick auf einen Kalendertag oder eine Tabellenzeile.

**Felder:**
- **Typ**: Dropdown-Auswahl (Home-Office, Urlaub, Krank, etc.)
- **Halbtag**: Checkbox für Halbtags-Home-Office
- **Beginn**: Zeit im Format HH:MM (z.B. "08:30")
- **Ende**: Zeit im Format HH:MM (z.B. "17:00")
- **Pause**: Minuten (nur bei Ganztags-Home-Office)
- **Dauer**: Wird automatisch berechnet

**Validierung:**
- Beginn muss vor Ende liegen
- Pause muss bei Ganztags-Home-Office ≥ 30 Minuten sein
- Warnung bei Überschreitung der Limits

#### Automatische Berechnung

Die Dauer wird minutengenau berechnet:
```
Dauer = (Ende - Beginn) - Pause
```

Beispiel:
- Beginn: 08:30
- Ende: 17:00
- Pause: 30 Minuten
- Dauer: 8,0 Stunden

### Home-Office Counter

Der Counter zeigt die Anzahl der Home-Office-Tage im aktuellen Monat:
- **Ganztag** = 1,0 Tag
- **Halbtag** = 0,5 Tag

**Limit-Prüfung:**
- Standard: 5,5 Tage pro Monat
- Konfigurierbar in `js/config.js`

**Visualisierung:**
- Fortschrittsbalken mit Farbcodierung
- Warnung bei Überschreitung

### Feiertags-Automatik

Die Anwendung erkennt automatisch alle gesetzlichen Feiertage für **Nordrhein-Westfalen (NRW)**:

- Neujahr (1. Januar)
- Karfreitag
- Ostermontag
- Tag der Arbeit (1. Mai)
- Christi Himmelfahrt
- Pfingstmontag
- Fronleichnam
- Tag der Deutschen Einheit (3. Oktober)
- Allerheiligen (1. November)
- Weihnachten (25./26. Dezember)

**Berechnung:**
- Verwendet die Gaußsche Osterformel
- Automatische Berechnung beweglicher Feiertage

### Batch-Erfassung

#### Urlaub

1. Klicken Sie auf "Urlaub"
2. Wählen Sie Start- und Enddatum
3. Wochenenden und Feiertage werden automatisch übersprungen
4. Optional: "Gleitzeit" aktivieren

#### Krankheit / Sonstiges

1. Klicken Sie auf "Krankheit / Sonstiges"
2. Wählen Sie Start- und Enddatum
3. Wählen Sie den Typ (Krank, Kind krank, Sonstiges)
4. Einträge werden ohne Zeiterfassung erstellt

---

## ⚖️ Geschäftsregeln & Compliance

### Home-Office-Regeln

| Regel | Bedingung | System-Reaktion |
|:------|:----------|:----------------|
| **Mindestpause** | Ganztags-Home-Office | Mindestens 30 Minuten Pause erforderlich |
| **Ganztags-Limit** | Dauer > 7,0 Stunden | Sicherheitsabfrage ("Sind Sie sicher?") |
| **Halbtags-Limit** | Dauer > 3,5 Stunden | Sicherheitsabfrage ("Sind Sie sicher?") |
| **Negative Dauer** | Ende vor Beginn | Warnung; Speichern nicht möglich |
| **Monatliches Limit** | > 5,5 Tage | Farbcodierte Warnung im Counter |

### Berechnungsregeln

- **Präzision**: Minutengenaue Berechnung, Anzeige mit einer Nachkommastelle
- **Pause**: Wird von der Gesamtdauer abgezogen
- **Halbtag**: Keine Pause erforderlich, max. 3,5 Stunden

### Abwesenheitstypen

| Typ | Kürzel | Beschreibung |
|:----|:-------|:-------------|
| **Home-Office** | - | Ganztags oder Halbtags |
| **Urlaub** | TU | Urlaubstag |
| **Krank** | K | Krankheit |
| **Kind krank** | - | Kind krank |
| **Gleitzeit** | GLZ | Gleitzeit |
| **Arbeitszeitkonto** | AZK | Arbeitszeitkonto |
| **Feiertag** | F | Gesetzlicher Feiertag |
| **Sonstiges** | - | Sonstige Abwesenheit |

---

## 🛠️ Technische Architektur

### Technologie-Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Speicher**: Browser `localStorage`
- **Externe Abhängigkeiten**:
  - jsPDF (für PDF-Export, über CDN)
- **Keine Build-Tools**: Läuft direkt im Browser

### Modulare Architektur

Das System nutzt eine modulare Architektur mit klarer Trennung der Verantwortlichkeiten:

**Kern-Module:**
- `app.js` - Zentraler Controller
- `storage.js` - Datenpersistenz
- `security.js` - Sicherheitsfunktionen
- `i18n.js` - Internationalisierung

**UI-Module:**
- `calendar.js` - Kalender-Komponente
- `timesheet.js` - Zeitblatt-Rendering
- `theme.js` - Theme-Verwaltung
- `toast.js` - Benachrichtigungen

**Feature-Module:**
- `export.js` - Excel-Export
- `pdf.js` - PDF-Export
- `backup.js` - Backup-Funktion
- `search.js` - Suchfunktion
- `report.js` - Berichte
- `holidays.js` - Feiertagsberechnung

**Hilfs-Module:**
- `utils.js` - Hilfsfunktionen
- `config.js` - Konfiguration
- `logger.js` - Logging
- `version.js` - Versionsverwaltung

> [!TIP]
> Eine detaillierte technische Beschreibung finden Sie in der [Architektur-Dokumentation](DOKUMENTATION/ARCHITEKTUR.md).

### Design-Prinzipien

- **KISS** (Keep It Simple, Stupid): Minimale Abhängigkeiten, keine Build-Tools
- **Privacy by Design**: Keine Daten verlassen den Browser
- **Defensive Programmierung**: Umfassende Validierung und Fehlerbehandlung
- **Modularität**: Klare Trennung der Verantwortlichkeiten
- **Performance**: Debounce/Throttle, Caching, optimierte DOM-Operationen

---

## 📦 Installation & Setup

### Systemanforderungen

- **Browser**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **JavaScript**: ES6+ Unterstützung
- **Speicher**: `localStorage` Unterstützung
- **Keine Installation**: Läuft direkt im Browser

### Installation

1. **Dateien herunterladen**: Laden Sie alle Projektdateien herunter
2. **Ordnerstruktur beibehalten**: Die Struktur muss erhalten bleiben
3. **Browser öffnen**: Öffnen Sie `index.html` in einem modernen Browser

### Erste Schritte

1. Öffnen Sie `index.html`
2. Geben Sie Ihre persönlichen Daten ein
3. Beginnen Sie mit der Zeiterfassung

**Keine weitere Konfiguration erforderlich!**

---

## 📚 Bedienungsanleitung

### Grundlegende Bedienung

#### 1. Eintrag erstellen

1. **Doppelklicken** Sie auf einen Tag im Kalender oder in der Tabelle
2. Wählen Sie den **Typ** aus dem Dropdown
3. Geben Sie die **Zeiten** ein (bei Home-Office)
4. Klicken Sie auf **"Bestätigen"**

#### 2. Eintrag bearbeiten

1. **Doppelklicken** Sie auf den Eintrag
2. Ändern Sie die Daten
3. Klicken Sie auf **"Bestätigen"**

#### 3. Eintrag löschen

1. Öffnen Sie das Eingabeformular
2. Klicken Sie auf **"Löschen"**
3. Bestätigen Sie die Löschung

#### 4. Monat wechseln

- Klicken Sie auf **"◀"** für den vorherigen Monat
- Klicken Sie auf **"▶"** für den nächsten Monat
- Klicken Sie auf **"Heute"** für den aktuellen Monat

#### 5. Export

- **Excel**: Klicken Sie auf "Als Excel exportieren"
- **PDF**: Klicken Sie auf "PDF"
- **Drucken**: Klicken Sie auf "Drucken"

### Erweiterte Funktionen

#### Batch-Erfassung

**Urlaub:**
1. Klicken Sie auf **"Urlaub"**
2. Wählen Sie Start- und Enddatum
3. Optional: "Gleitzeit" aktivieren
4. Klicken Sie auf **"Bestätigen"**

**Krankheit:**
1. Klicken Sie auf **"Krankheit / Sonstiges"**
2. Wählen Sie Start- und Enddatum
3. Wählen Sie den Typ
4. Klicken Sie auf **"Bestätigen"**

#### Suche

1. Klicken Sie auf **"Suche"**
2. Geben Sie Suchkriterien ein
3. Klicken Sie auf **"Suchen"**
4. Klicken Sie auf ein Ergebnis, um zum Eintrag zu springen

#### Berichte

1. Klicken Sie auf **"Berichte"**
2. Wählen Sie Monats- oder Jahresbericht
3. Wählen Sie den Zeitraum
4. Klicken Sie auf **"Generieren"**

---

## 💾 Datenverwaltung

### Speicherung

- **Automatisch**: Alle Änderungen werden automatisch gespeichert
- **Lokal**: Daten werden im Browser `localStorage` gespeichert
- **Persistent**: Daten bleiben auch nach Browser-Neustart erhalten

### Backup & Wiederherstellung

#### Backup erstellen

1. Klicken Sie auf **"Backup"**
2. Wählen Sie **"Export"**
3. Die Datei wird automatisch im `backup`-Ordner gespeichert
4. Dateiname: `Zeiterfassung_Backup_YYYY-MM-DD.json`

#### Backup wiederherstellen

1. Klicken Sie auf **"Backup"**
2. Wählen Sie **"Import"**
3. Wählen Sie die JSON-Datei aus
4. Bestätigen Sie die Wiederherstellung

**⚠️ Warnung:** Die Wiederherstellung überschreibt alle aktuellen Daten!

### Monat leeren

1. Klicken Sie auf **"Monat leeren"** (oben rechts)
2. Bestätigen Sie die Löschung
3. Alle Einträge des aktuellen Monats werden gelöscht

### Daten löschen

**Vorsicht:** Das Löschen des Browser-Caches löscht auch alle Daten!

**Empfehlung:** Erstellen Sie regelmäßig Backups!

---

## 📥 Export-Funktionen

### Excel-Export

**Format:** `.xls` (kompatibel mit Microsoft Excel)

**Features:**
- Original-Layout der Vorlage
- Farbtreue (Home-Office grün, Urlaub gelb, etc.)
- Formatierung (Fett, Rahmen, Hintergrundfarben)
- Automatische Summen
- Präzise Arbeitszeiten (eine Nachkommastelle)

**Verwendung:**
1. Navigieren Sie zum gewünschten Monat
2. Klicken Sie auf **"Als Excel exportieren"**
3. Die Datei wird heruntergeladen
4. Öffnen Sie die Datei in Excel

### PDF-Export

**Format:** `.pdf` (Portrait, A4)

**Features:**
- Professionelles Layout
- Vollständige Dokumentation
- Benutzerinformationen
- Alle Einträge mit Details
- Summen und Statistiken
- Unterschriftsfelder
- Hinweise zu Abwesenheitskürzeln

**Verwendung:**
1. Navigieren Sie zum gewünschten Monat
2. Klicken Sie auf **"PDF"**
3. Die Datei wird heruntergeladen
4. Öffnen Sie die Datei in einem PDF-Viewer

### Druck-Funktion

**Features:**
- Druckoptimiertes Layout
- Nur relevante Inhalte
- Keine UI-Elemente

**Verwendung:**
1. Navigieren Sie zum gewünschten Monat
2. Klicken Sie auf **"Drucken"**
3. Wählen Sie den Drucker
4. Drucken Sie das Dokument

---

## ❓ Häufige Fragen (FAQ)

### Allgemein

**F: Funktioniert die Anwendung offline?**  
A: Ja, die Anwendung funktioniert vollständig offline. Alle Daten werden lokal im Browser gespeichert.

**F: Werden meine Daten an Server übertragen?**  
A: Nein, alle Daten verbleiben in Ihrem Browser. Es findet keine Server-Kommunikation statt.

**F: Kann ich die Anwendung auf mehreren Geräten nutzen?**  
A: Die Daten sind gerätespezifisch. Sie können Backups erstellen und auf anderen Geräten wiederherstellen.

### Funktionen

**F: Wie ändere ich das Home-Office-Limit?**  
A: Das Limit kann in `js/config.js` geändert werden (Standard: 5,5 Tage).

**F: Kann ich mehrere Einträge pro Tag haben?**  
A: Nein, pro Tag ist nur ein Eintrag möglich. Sie können bestehende Einträge bearbeiten.

**F: Wie funktioniert die Feiertagsberechnung?**  
A: Die Anwendung verwendet die Gaußsche Osterformel zur Berechnung beweglicher Feiertage (NRW).

**F: Kann ich andere Bundesländer unterstützen?**  
A: Ja, die Feiertagslogik kann in `js/holidays.js` erweitert werden.

### Export

**F: Welches Excel-Format wird verwendet?**  
A: `.xls` Format (kompatibel mit Excel 2003+).

**F: Kann ich das PDF-Layout anpassen?**  
A: Ja, die PDF-Konfiguration kann in `js/config.js` angepasst werden.

**F: Werden Farben im Excel-Export beibehalten?**  
A: Ja, alle Farben werden im Excel-Export beibehalten.

### Probleme

**F: Die Anwendung lädt nicht.**  
A: Stellen Sie sicher, dass JavaScript aktiviert ist und Sie einen modernen Browser verwenden.

**F: Meine Daten sind verschwunden.**  
A: Prüfen Sie, ob der Browser-Cache gelöscht wurde. Stellen Sie ein Backup wieder her, falls vorhanden.

**F: Der Export funktioniert nicht.**  
A: Prüfen Sie, ob Popup-Blocker aktiv sind. Erlauben Sie Downloads für diese Seite.

---

## 📄 Dokumentation

### Verfügbare Dokumente

| Dokument | Beschreibung |
|:---------|:-------------|
| [README.md](README.md) | Diese Datei - Übersicht und Benutzerhandbuch |
| [DOKUMENTATION/ARCHITEKTUR.md](DOKUMENTATION/ARCHITEKTUR.md) | Technische Architektur und Modul-Details |
| [DOKUMENTATION/FUNKTIONEN.md](DOKUMENTATION/FUNKTIONEN.md) | Vollständiger Funktionskatalog |
| [CHANGELOG.md](CHANGELOG.md) | Versionshistorie und Änderungen |

### Code-Dokumentation

- **JSDoc-Kommentare**: Alle Funktionen sind dokumentiert
- **Inline-Kommentare**: Erklärende Kommentare im Code
- **Modul-Struktur**: Klare Trennung der Verantwortlichkeiten

---

## ⚖️ Lizenz & Rechtliches

### Verwendung

Dieses Tool ist für den **internen Gebrauch** bestimmt. Es entspricht den Richtlinien zur Dokumentation der täglichen Arbeitszeit.

### Haftungsausschluss

Die Software wird "wie besehen" bereitgestellt, ohne jegliche Gewährleistung. Die Nutzung erfolgt auf eigenes Risiko.

### Code of Conduct

Bitte beachten Sie den **Gestamp Code of Conduct** bei der Nutzung dieser Anwendung.

### Datenschutz

- **Keine Server-Kommunikation**: Alle Daten verbleiben lokal
- **Keine Tracking-Mechanismen**: Keine Analyse-Tools
- **Lokale Speicherung**: Daten nur im Browser `localStorage`

---

## 🔄 Versionshistorie

### Version 2.1.0 (2026-02-15)

**Verbessert:**
- PDF-Export: Entfernung der "aufgezeichnet am"-Spalte
- PDF-Export: Hinweise jetzt links unten positioniert
- Backup-Funktion: Verbesserte Benutzerführung
- Dunkles Theme: Optimierte Farbpalette

**Technisch:**
- Code-Qualität: Alle Kommentare ins Deutsche übersetzt
- Versionsverwaltung: Aktualisiert auf 2.1.0

### Version 2.0.0 (2026-02-13)

**Neu:**
- Heute-Button
- Automatisches Backup beim Excel-Export
- Erweiterte Suche
- Verbesserte Zeitkonfliktprüfung
- Erweiterte Berichte
- Dunkles Theme
- Animationen
- Versionsverwaltung

**Verbessert:**
- Benutzerinformationen: Auto-Save
- Home Office Auto-Fill
- Feiertags-Cache
- Code-Qualität
- Dokumentation

> Für die vollständige Versionshistorie siehe [CHANGELOG.md](CHANGELOG.md).

---

## 📞 Support & Kontakt

Bei Fragen oder Problemen:

1. Prüfen Sie die [FAQ](#häufige-fragen-faq)
2. Lesen Sie die [Dokumentation](#dokumentation)
3. Prüfen Sie die [Versionshistorie](CHANGELOG.md)

---

**Entwickelt für Effizienz und Genauigkeit.**  
**Version 2.1.0** | **2026-02-15**
