# Funktionsbeschreibung & Benutzerhandbuch

**Version**: v1.9.1
**Zielgruppe**: Benutzer und Auditoren

## 1. Übersicht der Kernfunktionen

### 1.1 Zeiterfassung (Home-Office)

Das Hauptmodul erlaubt die Eingabe von Arbeitszeiten für Home-Office-Tage.

- **Eingabe**: Beginnzeit, Endezeit, Pause (in Minuten).
- **Logik**: Die Anwendung berechnet automatisch die Gesamtdauer.
- **Präzision**: Die Anzeige erfolgt minutengenau mit einer fixierten Nachkommastelle (z. B. `7,7 Std`).

### 1.2 Home-Office Counter & Limits

Auf der linken Seite befindet sich ein permanenter Zähler für den aktuellen Monat.

- **Berechnung**: Summiert alle eingetragenen Home-Office-Tage (Ganztag = 1,0; Halbtag = 0,5).
- **Limit**: Es wird gegen ein Standardlimit von **5,5 Tagen** geprüft.
- **Visualisierung**: Ein Fortschrittsbalken ändert seine Farbe bei Annäherung an das Limit; bei Überschreitung erscheint eine Warnung.

### 1.3 Abwesenheits-Management (Batch-Modus)

Um das Eintragen von Urlaub oder Krankheit zu beschleunigen, gibt es spezielle Funktionen:

- **Urlaub / Gleitzeit**: Ein modales Fenster ermöglicht die Auswahl eines Datumsbereichs. Wochenenden und Feiertage werden dabei automatisch übersprungen.
- **Krankheit / Sonstiges**: Ähnlicher Workflow für schnelle Einträge ohne Zeiterfassung (Dauer = 0).

### 1.4 Feiertags-Automatik

Die Anwendung erkennt automatisch alle gesetzlichen Feiertage für **Nordrhein-Westfalen (NRW)**.

- **Visualisierung**: Feiertage werden im Kalender mit einem speziellen Emoji (🎉) und einer Hintergrundfarbe markiert.
- **Regel**: An Feiertagen und Wochenenden ist die reguläre Home-Office-Buchung standardmäßig gesperrt, um Fehlbuchungen zu vermeiden.

## 2. Compliance-Regeln

Die Anwendung unterstützt aktiv die Einhaltung von Arbeitszeitrichtlinien:

| Regel-Typ | Bedingung | System-Reaktion |
| :--- | :--- | :--- |
| **Mindestpause** | Ganztags-Buchung | Mindestens 30 Minuten Pause erforderlich. |
| **Ganztags-Limit** | Ist Home-Office > 7,0 Std? | Sicherheitsabfrage ("Sind Sie sicher?"). |
| **Halbtags-Limit** | Ist Home-Office > 3,5 Std? | Sicherheitsabfrage ("Sind Sie sicher?"). |
| **Negative Dauer** | Ende vor Beginn | Warnung; Speichern nicht möglich. |

## 3. Excel-Export

Der Export-Button erzeugt eine `.xls`-Datei, die speziell für die Weitergabe an die Personalabteilung oder zur Archivierung optimiert ist.

- **Original-Layout**: Die Struktur entspricht der offiziellen Excel-Vorlage.
- **Farbtreue**: Wochenenden (Grau), Home-Office (Grün) und Urlaub (Gelb) bleiben im Excel-Dokument farblich hervorgehoben.
- **Summen**: Monatliche Gesamtsummen werden automatisch am Ende der Tabelle berechnet.

## 4. Datenverwaltung

- **Speicherung**: Automatisch bei jedem Klick auf "Bestätigen".
- **Monat leeren**: Über den Button oben rechts kann der aktuelle Monat komplett zurückgesetzt werden (nach Bestätigung).
- **Datensicherheit**: Da alle Daten lokal gespeichert sind, hat der Benutzer die volle Kontrolle. Ein Löschen des Browser-Caches löscht auch die Daten, sofern kein Backup (Export) gemacht wurde.
