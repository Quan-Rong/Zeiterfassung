/**
 * backup.js — Backup- und Wiederherstellungsmodul
 * 
 * Ermöglicht das Erstellen und Wiederherstellen von Backups der Zeiterfassungsdaten.
 */

const Backup = (() => {
    function init() {
        // Backup-Funktionalität kann hier initialisiert werden
        // Z.B. Event-Listener für Backup-Button
        if (typeof Logger !== 'undefined') {
            Logger.debug('Backup-Modul initialisiert');
        }
    }

    /**
     * Erstellt ein Backup der aktuellen Daten
     * Versucht, die Datei automatisch im "backup" Ordner zu speichern (File System Access API)
     * Falls nicht unterstützt, wird der Benutzer aufgefordert, die Datei im "backup" Ordner zu speichern
     */
    async function createBackup() {
        try {
            const data = {
                userInfo: Storage.getUserInfo(),
                entries: Storage.getAllEntries(),
                timestamp: new Date().toISOString(),
                version: Version.getCurrentVersion()
            };
            const json = JSON.stringify(data, null, 2);
            const dateStr = new Date().toISOString().split('T')[0];
            const fileName = `zeiterfassung-backup-${dateStr}.json`;
            
            // Versuche File System Access API zu verwenden (Chrome/Edge)
            if ('showSaveFilePicker' in window) {
                try {
                    const fileHandle = await window.showSaveFilePicker({
                        suggestedName: fileName,
                        types: [{
                            description: 'JSON Backup Datei',
                            accept: { 'application/json': ['.json'] }
                        }],
                        startIn: 'downloads' // Startet im Downloads-Ordner, Benutzer kann zu backup navigieren
                    });
                    
                    const writable = await fileHandle.createWritable();
                    await writable.write(json);
                    await writable.close();
                    
                    Toast.success('Backup erfolgreich erstellt!');
                    return true;
                } catch (err) {
                    // Benutzer hat Dialog abgebrochen
                    if (err.name === 'AbortError') {
                        return false; // Keine Fehlermeldung, Benutzer hat abgebrochen
                    }
                    // Anderer Fehler, Fallback zu normalem Download
                    if (typeof Logger !== 'undefined') {
                        Logger.error('File System Access API Fehler:', err);
                    }
                    // Fallback: Nur wenn Logger nicht verfügbar (sollte in Produktion nicht auftreten)
                }
            }
            
            // Fallback: Normaler Download mit klarer Anweisung
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            Toast.success('Backup erstellt! Bitte speichern Sie die Datei im "backup" Ordner.');
            return true;
        } catch (e) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Backup-Fehler:', e);
            }
            // Fallback: Nur wenn Logger nicht verfügbar (sollte in Produktion nicht auftreten)
            Toast.error('Backup fehlgeschlagen');
            return false;
        }
    }

    /**
     * Stellt ein Backup wieder her
     */
    function restoreBackup(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.userInfo) {
                        Storage.saveUserInfo(data.userInfo);
                    }
                    if (data.entries) {
                        Object.keys(data.entries).forEach(dateStr => {
                            Storage.saveEntry(dateStr, data.entries[dateStr]);
                        });
                    }
                    Toast.success('Backup wiederhergestellt');
                    if (typeof App !== 'undefined' && App.refreshAll) {
                        App.refreshAll();
                    }
                    resolve(true);
                } catch (err) {
                    if (typeof Logger !== 'undefined') {
                        Logger.error('Wiederherstellungsfehler:', err);
                    }
                    // Fallback: Nur wenn Logger nicht verfügbar (sollte in Produktion nicht auftreten)
                    Toast.error('Ungültiges Backup-Format');
                    reject(err);
                }
            };
            reader.onerror = () => {
                Toast.error('Datei konnte nicht gelesen werden');
                reject(new Error('File read error'));
            };
            reader.readAsText(file);
        });
    }

    /**
     * Öffnet einen Dateidialog zum Importieren eines Backup-Files
     */
    function importBackup() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // Sicherheitsabfrage
            if (!confirm('Möchten Sie wirklich dieses Backup importieren? Alle aktuellen Daten werden überschrieben!')) {
                return;
            }
            
            try {
                await restoreBackup(file);
                Toast.success('Backup erfolgreich importiert!');
            } catch (err) {
                if (typeof Logger !== 'undefined') {
                    Logger.error('Import-Fehler:', err);
                }
                // Fallback: Nur wenn Logger nicht verfügbar (sollte in Produktion nicht auftreten)
                Toast.error('Backup konnte nicht importiert werden');
            }
        };
        input.click();
    }

    return {
        init,
        createBackup,
        restoreBackup,
        importBackup
    };
})();
