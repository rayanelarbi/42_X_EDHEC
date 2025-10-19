# 📱 GUIDE COMPLET - App Mobile Paula's Choice

## 🎯 Comment ça Marche ?

### Architecture Technique

```
┌─────────────────────────────────────────┐
│  TON ORDINATEUR (Serveur de Dev)       │
│  - Next.js tourne sur http://0.0.0.0   │
│  - Accessible par ton IP réseau         │
│  - Port 3000                            │
└────────────┬────────────────────────────┘
             │
             │ WiFi
             │
┌────────────▼────────────────────────────┐
│  TON TÉLÉPHONE                          │
│  - Se connecte à http://10.10.243.25    │
│  - Affiche l'app comme site web         │
│  - Peut être installé (PWA)             │
└─────────────────────────────────────────┘
```

## ✅ CE QUI A ÉTÉ FAIT

### 1. **Bottom Navigation** (Barre d'icônes en bas)
- **Fichier**: `components/MobileNav.tsx`
- 4 onglets : Home, Scan (Camera), Cart, Profile
- Toujours visible en bas de l'écran
- Active visuellement selon la page

### 2. **Page Cart** (Panier)
- **Fichier**: `app/cart/page.tsx`
- Gestion quantités (+/-)
- Suppression d'articles
- Calcul du total
- Design mobile-first

### 3. **Capacitor** (App Native)
- **Dossiers**: `ios/` et `android/`
- Permet de transformer l'app web en app native
- Accès à la caméra native
- Installation sur les stores (Apple, Google Play)

### 4. **PWA** (Progressive Web App)
- **Fichier**: `public/manifest.json`
- Permet d'installer l'app sur l'écran d'accueil
- Fonctionne hors ligne (partiellement)
- Ressemble à une vraie app

### 5. **QR Code Dev**
- **Fichier**: `scripts/dev-mobile.js`
- Génère un QR code automatiquement
- Affiche toutes les IPs disponibles
- Facilite le test mobile

## 🚀 COMMENT UTILISER

### Mode 1: Test Rapide sur Mobile (RECOMMANDÉ)

```bash
npm run dev:mobile
```

**Ce qui se passe** :
1. Le serveur Next.js démarre sur `http://0.0.0.0:3000`
2. Un QR code s'affiche dans le terminal
3. Ton téléphone peut scanner le QR code
4. L'app s'ouvre dans le navigateur mobile

**Avantages** :
- ✅ Changements en temps réel (hot reload)
- ✅ Console de debug accessible
- ✅ Pas besoin de build
- ✅ CSS fonctionne parfaitement

**Pour ton pote** :
1. Assure-toi qu'il est sur le **MÊME WiFi**
2. Envoie-lui l'URL : `http://10.10.243.25:3000`
3. OU il scanne le QR code

### Mode 2: Installation comme App Native

#### Sur iOS (Temporaire - sans App Store)
```bash
npm run build:mobile  # Build l'app
npm run ios           # Ouvre Xcode
```

Dans Xcode :
1. Connecte ton iPhone en USB
2. Sélectionne ton iPhone dans les devices
3. Clique sur ▶️ Run
4. L'app s'installe sur ton iPhone

#### Sur Android (Temporaire - sans Play Store)
```bash
npm run build:mobile  # Build l'app
npm run android       # Ouvre Android Studio
```

Dans Android Studio :
1. Connecte ton Android en USB (mode debug activé)
2. Clique sur ▶️ Run
3. L'app s'installe sur ton Android

### Mode 3: PWA (Installable depuis navigateur)

Sur n'importe quel téléphone :
1. Ouvre `http://10.10.243.25:3000` dans le navigateur
2. **Sur iOS (Safari)** :
   - Clique sur l'icône Partager (carré avec flèche)
   - Sélectionne "Sur l'écran d'accueil"
   - Nomme l'app "Paula's Choice"
   - Une icône apparaît sur ton écran d'accueil

3. **Sur Android (Chrome)** :
   - Menu ⋮ > "Ajouter à l'écran d'accueil"
   - Confirme
   - Une icône apparaît

## ❌ PROBLÈMES COURANTS

### Problème 1: "CSS basique, pas joli"
**Cause** : Next.js en mode export statique
**Solution** : ✅ CORRIGÉ ! Utilise `npm run dev:mobile`

### Problème 2: "iPhone de mon pote ne marche pas"
**Causes possibles** :
1. ❌ Pas sur le même WiFi → Vérifier
2. ❌ Safari bloque HTTP → Utiliser Chrome
3. ❌ VPN activé → Désactiver
4. ❌ Pare-feu → Ajouter exception port 3000
5. ❌ Mauvaise IP → Utiliser celle affichée

**Solutions** :
```bash
# Vérifie ton IP WiFi
ipconfig getifaddr en0    # Sur Mac
ip addr show              # Sur Linux
ipconfig                  # Sur Windows

# L'IP doit commencer par :
# - 192.168.x.x (WiFi classique)
# - 10.x.x.x (certains réseaux)
```

### Problème 3: "L'app ne se met pas à jour"
**Solution** :
```bash
# Arrête le serveur (Ctrl+C)
rm -rf .next
npm run dev:mobile
```

### Problème 4: "MediaPipe ne fonctionne pas"
**Cause** : MediaPipe ne charge que côté client
**Solution** : C'est normal en dev, ça fonctionne une fois l'image chargée

## 🔍 DÉTAILS TECHNIQUES

### Pourquoi `-H 0.0.0.0` ?

```bash
next dev              # Écoute sur localhost seulement
next dev -H 0.0.0.0  # Écoute sur TOUTES les interfaces réseau
```

Sans `-H 0.0.0.0`, ton téléphone ne peut pas se connecter !

### Différence Dev vs Build

| Mode | Command | Usage | Hot Reload |
|------|---------|-------|------------|
| **Dev** | `npm run dev:mobile` | Test rapide | ✅ Oui |
| **Build** | `npm run build:mobile` | App finale | ❌ Non |

**En Dev** :
- Serveur Node.js actif
- CSS dynamique
- Debugging facile
- Changements instantanés

**En Build** :
- Fichiers statiques HTML/CSS/JS
- Plus rapide
- Prêt pour production
- Pas de serveur nécessaire

### Structure des Fichiers

```
paula-choice/
├── app/
│   ├── layout.tsx          # Layout avec MobileNav
│   ├── page.tsx            # Page d'accueil
│   ├── cart/page.tsx       # Page panier (NEW)
│   ├── camera/page.tsx     # Caméra
│   ├── profile/page.tsx    # Profil
│   └── result/page.tsx     # Résultats
├── components/
│   └── MobileNav.tsx       # Bottom navigation (NEW)
├── public/
│   └── manifest.json       # PWA config (NEW)
├── ios/                    # App iOS native (NEW)
├── android/                # App Android native (NEW)
├── scripts/
│   └── dev-mobile.js       # QR code generator (NEW)
└── capacitor.config.ts     # Capacitor config (NEW)
```

## 🎨 Customisation

### Changer les Icônes de l'App

1. Crée tes icônes (192x192 et 512x512 PNG)
2. Remplace :
   - `public/icon-192.png`
   - `public/icon-512.png`
3. Rebuild : `npm run build:mobile`

### Modifier la Bottom Nav

Édite `components/MobileNav.tsx` :

```typescript
const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Camera, label: "Scan", path: "/camera" },
  { icon: ShoppingCart, label: "Cart", path: "/cart" },
  { icon: User, label: "Profile", path: "/profile" },
  // Ajoute tes onglets ici !
];
```

### Changer les Couleurs

Dans `public/manifest.json` :
```json
{
  "theme_color": "#0065B7",       // Couleur principale
  "background_color": "#ffffff"   // Couleur de fond
}
```

## 📊 Checklist de Test

### Avant de présenter :

- [ ] `npm run dev:mobile` fonctionne
- [ ] QR code s'affiche
- [ ] CSS est correct (pas basique)
- [ ] Bottom navigation visible
- [ ] Page Cart fonctionne
- [ ] Caméra fonctionne
- [ ] MediaPipe détecte le visage
- [ ] Testé sur ton téléphone
- [ ] Testé sur un autre téléphone

## 🚀 Pour ta Présentation

### Option A: Demo WiFi (Recommandé)
```bash
npm run dev:mobile
```
- Ton iPhone connecté au WiFi
- Tu navigues en direct
- Hot reload si besoin de corriger

### Option B: App Native Installée
```bash
npm run build:mobile
npm run ios  # Installe sur iPhone
```
- App installée en local
- Pas besoin de WiFi
- Plus professionnel

### Option C: PWA Installée
- Ouvre l'app dans Safari
- "Ajouter à l'écran d'accueil"
- Lance depuis l'icône
- Ressemble à une vraie app

## 🆘 Besoin d'Aide ?

### Logs de Debug
```bash
# Dans le terminal du serveur
# Tous les logs s'affichent

# Sur mobile (Safari iOS)
# Connecte iPhone > Safari > Développeur > iPhone > Inspect

# Sur mobile (Chrome Android)
# chrome://inspect dans Chrome PC
```

### Reset Complet
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run dev:mobile
```

## 📝 Notes Importantes

1. **WiFi** : Ton PC et ton téléphone DOIVENT être sur le même réseau
2. **IP** : L'IP change si tu changes de WiFi
3. **Port** : Par défaut 3000, peut changer si occupé
4. **HTTPS** : Pour l'instant HTTP, HTTPS nécessite certificat
5. **Stores** : Pour publier, besoin de comptes développeur (99€/an Apple, 25€ unique Google)
