# 📱 Paula's Choice - Mobile App Guide

Cette application est maintenant configurée comme une **vraie application mobile** avec Capacitor !

## 🚀 Démarrage Rapide

### 1. Mode Développement avec QR Code

```bash
npm run dev:mobile
```

Cela va :
- Démarrer le serveur Next.js
- **Afficher un QR code dans le terminal**
- Afficher l'URL réseau locale

**📲 Scanne le QR code avec ton téléphone pour ouvrir l'app !**

> ⚠️ Assure-toi que ton téléphone et ton PC sont sur le **même réseau WiFi**

### 2. Build pour Production

```bash
npm run build:mobile
```

Cela va compiler l'app et synchroniser avec iOS/Android.

### 3. Ouvrir sur iOS (nécessite Mac + Xcode)

```bash
npm run ios
```

Ouvre Xcode avec le projet iOS. Tu peux ensuite :
- Lancer dans le simulateur iOS
- Installer sur un iPhone physique

### 4. Ouvrir sur Android (nécessite Android Studio)

```bash
npm run android
```

Ouvre Android Studio avec le projet Android. Tu peux ensuite :
- Lancer dans l'émulateur Android
- Installer sur un téléphone Android physique

## 📦 Nouvelles Fonctionnalités

### Bottom Navigation Bar
- **Home** : Page d'accueil
- **Scan** : Prendre une photo avec la caméra
- **Cart** : Voir votre panier
- **Profile** : Votre profil et résultats

### PWA Support
L'app peut être **installée sur l'écran d'accueil** comme une vraie app :
- Sur iOS : Safari > Partager > "Sur l'écran d'accueil"
- Sur Android : Chrome > Menu > "Ajouter à l'écran d'accueil"

### Capacitor Native Features
- ✅ Caméra native
- ✅ Stockage local
- ✅ Mode plein écran
- ✅ Splash screen

## 🎨 Design Mobile-First

L'interface a été optimisée pour mobile :
- Navigation en bas (bottom tabs)
- Interface touch-friendly
- Animations fluides
- Safe area respect (pour les notchs iPhone)

## 📝 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev:mobile` | Dev avec QR code pour mobile |
| `npm run build:mobile` | Build + sync Capacitor |
| `npm run ios` | Ouvrir dans Xcode |
| `npm run android` | Ouvrir dans Android Studio |
| `npm run sync` | Synchroniser le code avec les apps natives |

## 🔧 Fichiers Importants

- `capacitor.config.ts` - Configuration Capacitor
- `public/manifest.json` - PWA manifest
- `components/MobileNav.tsx` - Bottom navigation
- `app/cart/page.tsx` - Page panier
- `ios/` - Projet iOS natif
- `android/` - Projet Android natif

## 💡 Conseils

1. **Pour tester sur mobile** : Utilise `npm run dev:mobile` et scanne le QR code
2. **Pour publier sur les stores** : Utilise `npm run build:mobile` puis ouvre iOS/Android
3. **Pour changer les icônes** : Remplace `public/icon-192.png` et `public/icon-512.png`
4. **Pour ajouter des plugins natifs** : Installe via npm et ajoute dans `capacitor.config.ts`

## 🐛 Troubleshooting

### Le QR code ne fonctionne pas
- Vérifie que ton téléphone et PC sont sur le même WiFi
- Utilise directement l'URL affichée dans le terminal

### L'app ne se met pas à jour
```bash
npm run build:mobile
```

### Erreur "out directory missing"
```bash
npm run build
npx cap sync
```

## 📚 Documentation

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Next.js PWA](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [iOS Deployment](https://capacitorjs.com/docs/ios/deploying-to-app-store)
- [Android Deployment](https://capacitorjs.com/docs/android/deploying-to-google-play)
