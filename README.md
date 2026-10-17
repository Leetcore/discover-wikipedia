# discover-wikipedia

Eine App zum Entdecken von Wikipedia-Artikeln, als einzelne HTML-Datei mit Vanilla JavaScript ([index.html](index.html)).

## Funktionsweise

- Die App startet mit einem zufälligen Artikel, der auf `Wikipedia:Hauptseite/Schon gewusst` verlinkt ist.
- Angezeigt wird nur der Inhalt des Artikels.
- **Swipe nach rechts** (oder Pfeil rechts, Button „→“): ein zufälliger Artikel aus den Links des aktuellen Artikels.
- **Swipe nach links** (oder Pfeil links, Button „←“, Zurück-Button des Browsers): zurück zum vorherigen Artikel.
- **Verlauf**: Liste aller besuchten Artikel, ein Klick springt dorthin.
- Links im Artikeltext öffnen den verlinkten Artikel direkt.
- **Darkmode**: per Button umschaltbar, startet mit der Systemeinstellung.

## Nutzung

`index.html` im Browser öffnen. Die Artikel kommen live von der deutschen Wikipedia, es wird eine Internetverbindung benötigt.

Auf dem iPhone lässt sich die Seite über Safari („Teilen“ → „Zum Home-Bildschirm“) als App ablegen, sobald sie über das Netz erreichbar ist, z. B. per GitHub Pages.