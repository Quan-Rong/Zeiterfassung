# Changelog

Alle wesentlichen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [2.1.0] — 2026-02-15

### Verbessert

- **PDF-Export**: 
  - Entfernung der "aufgezeichnet am"-Spalte aus dem PDF-Export
  - Hinweise zu Abwesenheitskürzeln wurden von der Mitte nach links unten verschoben
  - Verbesserte Layout-Optimierung für bessere Lesbarkeit
- **Backup-Funktion**: Verbesserte Benutzerführung beim Backup - klare Anweisung zum Speichern im "backup" Ordner
- **Dunkles Theme**: Optimierte Farbpalette für bessere Lesbarkeit und visuelles Wohlbefinden
  - Verbesserte Kontraste für Text und Hintergründe
  - Optimierte Farben für alle UI-Elemente (Buttons, Eingabefelder, Tabellen)
  - Bessere Sichtbarkeit von Abwesenheitstypen im dunklen Modus

### Dokumentation

- **README.md**: Vollständig überarbeitet und erweitert mit detaillierter Beschreibung aller Funktionen
- **ARCHITEKTUR.md**: Aktualisiert mit PDF-Export-Modul Details und neuen Modulen (Config, Logger)
- **CHANGELOG.md**: Aktualisiert mit allen Änderungen in Version 2.1.0

### Technisch

- **Code-Qualität**: Alle verbleibenden chinesischen Kommentare wurden ins Deutsche übersetzt
- **Versionsverwaltung**: Versionsnummer auf 2.1.0 aktualisiert
- **PDF-Modul**: Optimierte Spaltenbreiten nach Entfernung der "aufgezeichnet am"-Spalte

## [2.0.0] — 2026-02-13

### Neu

- **Heute-Button**: Kalender enthält nun einen "Heute"-Button zum schnellen Zurückspringen zum aktuellen Monat
- **Automatisches Backup**: Beim Excel-Export wird automatisch ein JSON-Backup erstellt
- **Erweiterte Suche**: Suchfunktion unterstützt jetzt Filterung nach Typ und Datumsbereich
- **Verbesserte Zeitkonfliktprüfung**: Detailliertere Warnungen bei Zeitüberschneidungen
- **Erweiterte Berichte**: Monats- und Jahresberichte mit detaillierten Statistiken (Durchschnittsstunden, Überstunden, etc.)
- **Dunkles Theme**: Vollständig überarbeitetes dunkles Theme mit optimierten Farben
- **Animationen**: Sanfte Übergangsanimationen für bessere Benutzererfahrung
- **Versionsverwaltung**: Verbesserte Versionsprüfung mit Update-Benachrichtigungen

### Verbessert

- **Benutzerinformationen**: Automatisches Speichern mit Toast-Benachrichtigung
- **Home Office Auto-Fill**: Verbesserte automatische Vorbefüllung der Zeitfelder
- **Feiertags-Cache**: Optimierte Caching-Strategie für Feiertagsberechnungen
- **Code-Qualität**: Alle Kommentare wurden ins Deutsche übersetzt
- **Dokumentation**: Umfassende Aktualisierung aller Dokumentationsdateien

### Technisch

- **Modularität**: Verbesserte Code-Organisation und Wiederverwendbarkeit
- **Fehlerbehandlung**: Einheitliche Fehlerbehandlung über die gesamte Anwendung
- **Performance**: Optimierungen für große Datenmengen

## [1.9.2] — 2026-02-13

### Dokumentation

- **Umfassendes Update**: Alle Projekt-Dokumente wurden auf Deutsch lokalisiert und detailliert.
- **Neu**: Hinzufügen von `ARCHITEKTUR.md` und `FUNKTIONEN.md` im Verzeichnis `DOKUMENTATION/` für tiefere technische und funktionale Einblicke.
- **README**: Die zentrale README wurde vollständig überarbeitet und auf den Stand von v1.9.1 gebracht.

## [1.9.1] — 2026-02-13

### UI

- **Header**: Die Monatsanzeige und der "Monat leeren"-Button oben rechts sind nun gleich groß und stehen ordentlich nebeneinander.

## [1.9.0] — 2026-02-13

### Neu

- **Excel Export**: Der Export wurde komplett überarbeitet.
  - Das Format ist nun `.xls` (kann von Excel geöffnet werden).
  - **Design**: Die Tabelle sieht nun genauso aus wie auf der Webseite (Farben für Homeoffice/Urlaub, Fettgedrucktes, Rahmen).
  - **Präzision**: Arbeitszeiten werden auch im Export mit einer Nachkommastelle (z.B. "8,0") ausgegeben.

## [1.8.1] — 2026-02-13

### Behoben

- **Berechnung**: Ein Fehler bei der Arbeitszeitberechnung wurde behoben, der dazu führte, dass Zeiten auf halbe Stunden gerundet wurden (z.B. 7h statt 7,2h). Nun wird die Zeit präzise berechnet.

## [1.8.0] — 2026-02-13

### Neu

- **Logik**: Die Dauer in der Tabelle wird nun immer mit einer Nachkommastelle angezeigt (z.B. "8,0 Std"), um die Genauigkeit zu erhöhen.
- **Sicherheit**: Wenn Sie mehr als 7 Stunden (ganztags) oder 3,5 Stunden (halbtags) Homeoffice eintragen, werden Sie nun um eine Bestätigung gebeten. Dies hilft, unbeabsichtigte Falscheinträge zu vermeiden.

## [1.7.0] — 2026-02-13

### Neu

- **Monat leeren**: Oben rechts, unter der Monatsanzeige, befindet sich nun ein roter Knopf "Monat leeren". Damit können Sie alle Einträge des aktuellen Monats auf einmal löschen (nach einer Sicherheitsabfrage).
- **Layout**: Die Monatsanzeige wurde etwas verkleinert, um Platz für den neuen Knopf zu schaffen.

## [1.6.1] — 2026-02-13

### Neu

- **Visuell**: Der aktuelle Tag im Kalender wird nun zusätzlich durch einen roten Punkt unter der Zahl hervorgehoben.
- **Fußzeile**: Ein Haftungsausschluss ("Disclaimer") wurde mittig im Fenster platziert. Er weist darauf hin, dass die Software Open Source ist und keine Haftung übernommen wird. Zudem wird auf den Gestamp "Code of Conduct" hingewiesen.

## [1.6.0] — 2026-02-13

### Neu

- **Farben**: Verschiedene Abwesenheitsarten (Urlaub, Krank, Gleitzeit etc.) werden nun sowohl im Kalender als auch in der Tabelle farblich unterschiedlich und konsistent dargestellt.
- **Wochenenden & Feiertage**: Diese Zeilen sind nun in der Tabelle grau hinterlegt.
- **Sicherheit**: Es ist nicht mehr möglich, an Wochenenden oder Feiertagen fälschlicherweise neue Einträge per Doppelklick zu erstellen (es sei denn, es existiert bereits ein Eintrag, der korrigiert werden muss).

## [1.5.3] — 2026-02-13

### Behoben

- **Layout**: Ein Fehler wurde behoben, der dazu führte, dass das Eingabefenster "abgeschnitten" wirkte (kein Scrollen möglich, Buttons fehlten).
- **Flexibilität**: Das Fenster darf nun über den Rand hinausgehen ("Overflow"), und der Inhalt wird nicht mehr versteckt. Scrollen innerhalb des Fensters ist weiterhin möglich.

## [1.5.2] — 2026-02-13

### Behoben

- **Layout**: Das Eingabefenster (Popup) war auf einigen Bildschirmen zu groß, wodurch die Buttons am unteren Rand abgeschnitten wurden.
- **Scroll**: Es wurde eine Scrollfunktion ("Scrollbar") zum Eingabefenster hinzugefügt, sodass man nun immer alle Felder und Buttons erreichen kann, auch wenn der Bildschirm klein ist.

## [1.5.1] — 2026-02-13

### Behoben

- **Kritischer Fehler**: Absturz behoben ("Cannot set properties of null"), der durch fehlende Labels im HTML verursacht wurde.
- **Sicherheit**: Alle Text-Zuweisungen sind nun abgesichert ("Safe Setters"), sodass fehlende Elemente nicht mehr zum Programmabsturz führen.

## [1.5.0] — 2026-02-13

### Behoben

- **Stabilität**: Ein kritischer Initialisierungsfehler in `app.js` wurde behoben. Dieser Fehler verursachte, dass Kalender und Listen nicht geladen wurden (Blank Screen).
- **Sicherheit**: Eine neue Fehlerüberwachung ("Try-Catch") wurde integriert. Sollte es dennoch zu Startproblemen kommen, wird nun eine klare Fehlermeldung angezeigt, statt dass die Anwendung stumm bleibt.
- **Bereinigung**: Letzte Reste der Sprachumschaltung wurden aus dem Programmcode entfernt.

## [1.4.2] — 2026-02-13

### Behoben

- **Layout**: Kopfzeile (Header) korrigiert. Eingabefelder werden nun wieder ordentlich und stilvoll angezeigt.
- **Anzeige**: Fehler behoben, der verhinderte, dass Kalender und Tabelle sichtbar waren (verursacht durch Layout-Probleme).

## [1.4.1] — 2026-02-13

### Behoben

- **Kritischer Fehler**: Absturz behoben, der durch fehlende Eingabefelder verursacht wurde (Kalender reagierte nicht mehr).
- **Header**: Eingabefelder für Name, Vorname, Personalnummer und Abteilung wiederhergestellt (Standard-Design).
- **Bereinigung**: "Sprache"-Dropdown aus der Kopfzeile entfernt.

## [1.4.0] — 2026-02-13

### Geändert

- **Standard-Layout**: Rückkehr zur ursprünglichen Modulgröße (kein "Compact"-Modus mehr), für bessere Lesbarkeit und Bedienung.
- **Bereinigung**: Eingabefelder für Name und Personalnummer im Kopfbereich entfernt (wie gewünscht).
- **Sprache**: Sprachumschaltung und entsprechende UI-Elemente vollständig entfernt.

## [1.3.0] — 2026-02-13

### Geändert

- **Sprache**: Chinesisch entfernt. Die Anwendung ist nun rein deutschsprachig.
- **Statistik**: Neue monatliche Zusammenfassung am Tabellenende ("Anzahl Tage" für Homeoffice, Urlaub, Krank, etc.).
- **Datumswahl**: Wochenende und Feiertage werden bei der Berechnung der Abwesenheitstage automatisch abgezogen.

### Behoben

- Layout-Fix: Scrollbalken für die Tabelle auf der rechten Seite korrigiert.
- UI-Fix: Dropdown-Liste "Typ" ist nun immer sichtbar und gefüllt.

## [1.2.0] — 2026-02-13

### Behoben

- Kritischer Bug: Leere Anzeige beim Start (Fix für i18n-Initialisierung)

### Geändert

- UI-Optimierung: Kompaktes Layout ("Compact Edition"), kleinere Fenster und bessere Platznutzung
- Kopfdaten (Name, Abt., etc.) nun einzeilig und platzsparend
- Zusammenführung der Abwesenheitsdialoge in ein modulares System

### Hinzugefügt

- Neuer Button für "Krankheit / Sonstiges"
- Option "Gleitzeit" im Urlaubs-Dialog (Checkbox)
- Unterstützung für Abwesenheitsgründe: "Kind krank", "Sonstiges"
- Automatische Erkennung und Anzeige in der Zeiterfassungstabelle

## [1.1.0] — 2026-02-13

### Hinzugefügt

- Home-Office-Counter: Anzeige der verbrauchten Tage mit Limit-Warnung (> 5,5 Tage)
- Massenerfassung für Urlaub (Zeitraumauswahl)
- Emoji-Unterstützung im Kalender: 🎉 für Feiertage, 🏡 für Wochenenden
- Deaktivierung der Doppelklick-Funktion an Nicht-Arbeitstagen (Feiertage/Wochenende)
- Hinweis auf NRW-Feiertagsregelung unter dem Kalender
- Modernes UI-Design: Card-Layout, Schatten, verbesserte Typografie

## [1.0.0] — 2026-02-13

### Hinzugefügt

- Interaktiver Monatskalender mit Vor-/Zurück-Navigation
- Hervorhebung des heutigen Datums
- Automatische Erkennung der NRW-Feiertage
- Wochenend- und Feiertagsmarkierung (gelb)
- Home-Office-Zeiterfassung (Ganztag & Halbtag)
- Zeiterfassungstabelle gemäß Unternehmensvorlage
- Geschäftsregeln: Pause ≥ 30 Min, Stundenober­grenzen
- Abwesenheitstypen: Urlaub, Krank, Gleitzeit, Arbeitszeitkonto
- Datenpersistenz über localStorage
- Excel-Export (.xlsx) im Vorlagenformat
- Zweisprachige Oberfläche (Deutsch / Chinesisch)
- Persönliche Daten (Name, Pers.-Nr., Abteilung) mit Speicherfunktion
- Monatliche Stundenübersicht (Summe)
