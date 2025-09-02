# Bild-RPG mit modularer KI

Dieses Projekt ist ein einfaches MVP eines textbasierten Rollenspiels mit Bildausgabe. 

## Struktur
- **Frontend**: Statische Seite mit Eingabefeld und Bildanzeige
- **Backend**: Node.js + Fastify
- **Daten**: `data.json` enthält Beispielcharaktere und Szenen

## Start
```bash
npm install
npm start
```

## Hinweise
Die aktuellen Implementierungen nutzen Platzhalter für KI-Antworten und Bilder. 
Schnittstellen für unterschiedliche LLM- und Bild-Provider können über Adapter ergänzt werden.
