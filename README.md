# AdSync Landing Web

Projet web autonome en `React + TypeScript + Vite` pour la landing page AdSync.

Ce dossier est independant du projet mobile principal. Il peut etre deplace tel quel dans un autre repo ou exporte avec le script ci-dessous.

## Lancer le projet

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

## Exporter seulement la landing

Depuis la racine du projet :

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\export-landing-web.ps1
```

Le resultat sera cree dans `exports/adsync-landing-web`.
