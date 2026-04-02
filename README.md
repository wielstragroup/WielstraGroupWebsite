# Wielstra Group - Production Ready Website

Deze website is gebouwd voor Wielstra Group (Friesland, NL) met een luxe, moderne en minimalistische uitstraling.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4, Motion (framer-motion)
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Hosting**: GitHub Pages (met SPA routing fix)
- **SEO**: React Helmet Async, robots.txt, sitemap.xml

## Lokale Ontwikkeling
1. Installeer dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open `http://localhost:3000/WielstraGroup/`

## Firebase Setup
1. Maak een nieuw Firebase project aan in de [Firebase Console](https://console.firebase.google.com/).
2. Schakel **Google Sign-In** in bij Authentication.
3. Maak een **Firestore Database** aan.
4. Schakel **Firebase Storage** in.
5. Kopieer de configuratie naar `firebase-applet-config.json`.
6. Deploy de security rules uit `firestore.rules`.

## GitHub Pages Deployment
1. Push de code naar een GitHub repository genaamd `WielstraGroup`.
2. Ga naar repository **Settings > Pages**.
3. Selecteer **GitHub Actions** als source.
4. Voeg `FIREBASE_API_KEY` toe aan de repository secrets.
5. De website wordt automatisch gebouwd en gedeployed via de workflow in `.github/workflows/deploy.yml`.

## Admin Dashboard
- Ga naar `/WielstraGroup/admin` om in te loggen.
- Alleen het emailadres `wielstragroup@gmail.com` heeft toegang.
- Beheer portfolio items, pagina's en instellingen direct vanuit het dashboard.

## SEO & Analytics
- Pas de `SITE_CONFIG` in `src/constants.ts` aan voor uw eigen gegevens.
- Analytics kan worden toegevoegd in `src/main.tsx` of via een configuratie in het admin paneel.

## Migratie naar Vercel
1. Importeer de repository in Vercel.
2. Pas de `base` in `vite.config.ts` aan naar `/` (of verwijder de regel).
3. Update de `basename` in `src/App.tsx` naar `/`.
4. Update de `SITE_CONFIG.baseUrl` in `src/constants.ts`.
