# discover-wikipedia

Eine Progressive Web App in Vanilla JavaScript, die Wikipedia durchsucht und automatisch aktuelle Artikel vorschlägt.

## Features

- Automatische Vorschläge aus den aktuell meistgelesenen Wikipedia-Artikeln
- Direkte Suche nach Artikeln über die Wikipedia-API
- Installierbar als PWA (Manifest + Service Worker)
- Offline-fähige App-Shell durch Caching

## Lokal starten

Da Service Worker nur über HTTP/HTTPS funktionieren, starte die App mit einem lokalen Server:

```bash
python3 -m http.server 8080
```

Dann im Browser öffnen:

`http://localhost:8080`
