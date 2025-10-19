# Support Visuel pour la Présentation
## Slides recommandées pour accompagner l'oral

---

## 📊 STRUCTURE DES SLIDES (10-12 slides)

### Slide 1 : TITRE
```
ANALYSE DE PEAU & RECOMMANDATIONS PERSONNALISÉES
Application Web & Mobile

42 x EDHEC
[Votre nom]
[Date]
```

---

### Slide 2 : PROBLÉMATIQUE
```
LE PROBLÈME
• 70% des consommateurs ne savent pas quel produit choisir
• Trop de choix, informations contradictoires
• Consultations dermatologiques coûteuses et longues

LA SOLUTION
→ Analyse de peau par IA en 30 secondes
→ Recommandations personnalisées
→ Routine complète adaptée
```

---

### Slide 3 : DÉMONSTRATION DU PARCOURS
```
PARCOURS UTILISATEUR

1. Questionnaire (2 min)
2. Photo selfie (30 sec)
3. Analyse IA (instant)
4. Résultats + Recommandations
5. Routine personnalisée

[Insérer 5 captures d'écran illustrant chaque étape]
```

---

### Slide 4 : STACK TECHNIQUE - VUE D'ENSEMBLE
```
ARCHITECTURE

Frontend:           Mobile:              Backend:
• Next.js 14       • Capacitor 7        • API Routes
• React 18         • iOS/Android        • TypeScript
• TypeScript       • Camera native
• Tailwind CSS

Intelligence Artificielle:
• MediaPipe (Google) - Gratuit
• AILabTools - Cloud (optionnel)
```

---

### Slide 5 : NEXT.JS 14 - FRAMEWORK PRINCIPAL
```
POURQUOI NEXT.JS ?

✓ App Router moderne
✓ Server-Side Rendering (performance)
✓ API Routes intégrées
✓ TypeScript natif
✓ Optimisation automatique des images
✓ SEO-friendly

→ Framework full-stack en un seul outil
```

---

### Slide 6 : INTELLIGENCE ARTIFICIELLE
```
ANALYSE DE PEAU PAR IA

MediaPipe (Google):
• 468 points de détection faciale
• Analyse locale, 100% gratuite
• Temps réel, fonctionne offline

AILabTools (Cloud):
• Analyse dermatologique avancée
• 6 types de problèmes détectés
• Système de fallback automatique

RÉSULTAT: 3 à 8 détections par visage
```

---

### Slide 7 : DÉTECTIONS IA
```
6 TYPES DE PROBLÈMES DÉTECTÉS

🔴 Acné               → Joues, nez, front
📏 Rides              → Front, contour yeux
👁️ Cernes            → Sous les yeux
🔍 Pores dilatés     → Zone T
⚫ Taches pigmentaires → Joues, front
🌡️ Rougeurs          → Irritations

Chaque détection:
• Sévérité (0-100)
• Confiance (0-100)
• Localisation précise
```

---

### Slide 8 : ARCHITECTURE TECHNIQUE
```
STRUCTURE DU PROJET

app/                  → Pages Next.js
  ├── camera/        → Capture photo
  ├── quiz/          → Questionnaire
  ├── result/        → Analyse
  ├── routine/       → Recommandations
  └── api/           → Backend

components/          → Composants React
lib/                → Logique métier
  ├── skinAnalysis  → Algorithmes IA
  ├── scoring       → Calcul scores
  └── productData   → BDD produits

store/              → État global (Zustand)
```

---

### Slide 9 : MULTI-PLATEFORME AVEC CAPACITOR
```
UN CODE, 3 PLATEFORMES

Code Source (TypeScript/React)
         ↓
    Capacitor 7
         ↓
    ┌────┴────┐
    ↓    ↓    ↓
  Web  iOS  Android

Fonctionnalités natives:
✓ Caméra
✓ Stockage local
✓ Permissions
✓ Performance quasi-native
```

---

### Slide 10 : DÉFIS TECHNIQUES
```
PRINCIPAUX DÉFIS RELEVÉS

1. Analyse d'image en temps réel
   → MediaPipe + algorithmes optimisés

2. Performance mobile
   → Compression, traitement asynchrone

3. Dépendance API externe
   → Système de fallback 3 niveaux

4. Multi-plateforme
   → Capacitor + responsive design
```

---

### Slide 11 : DÉMO RÉSULTATS
```
ÉCRAN DE RÉSULTATS

[Capture d'écran de la page result avec:]

• Photo "Avant" avec marqueurs
• Photo "Après" simulée
• Score global: 72/100
• Type de peau: Mixte
• 5 problèmes détectés
• Produit recommandé
```

---

### Slide 12 : PERSPECTIVES & CHIFFRES CLÉS
```
CHIFFRES CLÉS
• 3-8 détections par analyse
• 468 points de repère facial
• 6 types de problèmes
• 4 produits avec routines
• 3 plateformes (Web/iOS/Android)

PROCHAINES ÉTAPES
✓ Catalogue de produits élargi
✓ Suivi de routine (avant/après)
✓ Déploiement App Store / Play Store
✓ Partenariats marques cosmétiques

Questions ?
```

---

## 🎨 CONSEILS DESIGN DES SLIDES

### Palette de Couleurs
```css
Primaire:   #3B82F6 (bleu)
Secondaire: #8B5CF6 (violet)
Succès:     #10B981 (vert)
Alerte:     #F59E0B (orange)
Erreur:     #EF4444 (rouge)
Neutre:     #6B7280 (gris)
Fond:       #F9FAFB (gris très clair)
```

### Polices
- **Titres** : Inter Bold / Poppins Bold
- **Corps** : Inter Regular / Roboto
- **Code** : Fira Code / JetBrains Mono

### Éléments Visuels
1. **Icônes** : Utiliser Lucide Icons (cohérent avec l'app)
2. **Captures d'écran** : Encadrer avec ombres portées
3. **Graphiques** : Simples et épurés
4. **Animations** : Sobres, transitions douces

---

## 📸 CAPTURES D'ÉCRAN ESSENTIELLES

À préparer avant la présentation :

1. **Page d'accueil** : Écran de bienvenue
2. **Questionnaire** : 1-2 questions exemple
3. **Caméra** : Interface de capture
4. **Analyse en cours** : Loading state
5. **Résultats** : Avant/Après avec marqueurs
6. **Routine** : Étapes matin/soir
7. **Produits** : Fiche produit détaillée
8. **Mobile** : App sur iPhone/Android

---

## 🎬 DÉMONSTRATION LIVE (Optionnel)

### Scénario de Démo (2 minutes)

1. **Démarrer l'app** sur smartphone
2. **Prendre une photo** (préparée à l'avance)
3. **Montrer l'analyse** en temps réel
4. **Afficher les résultats** avec marqueurs
5. **Parcourir la routine** recommandée

### Plan B : Vidéo de Démo
Si la démo live n'est pas possible :
- Vidéo screencast de 60-90 secondes
- Parcours complet de l'utilisateur
- Voix off expliquant chaque étape

---

## 📱 QR CODE

Créer un QR code pour :
- Repository GitHub
- Version web déployée
- Documentation technique

Positionner sur la dernière slide pour questions.

---

## ✅ CHECKLIST AVANT PRÉSENTATION

### Matériel
- [ ] Laptop chargé + chargeur
- [ ] Clé USB backup avec slides
- [ ] Adaptateur HDMI/USB-C
- [ ] Smartphone avec app installée
- [ ] Connexion internet vérifiée

### Contenu
- [ ] Slides finalisées et relues
- [ ] Captures d'écran à jour
- [ ] Démonstration testée
- [ ] Timing vérifié (8-10 min)
- [ ] Réponses aux questions anticipées

### Préparation
- [ ] Répétition à voix haute (x3 minimum)
- [ ] Chronométrage précis
- [ ] Notes sur papier (backup)
- [ ] Tenue professionnelle

---

## 💬 RÉPONSES AUX QUESTIONS FRÉQUENTES

### Technique

**Q : Pourquoi TypeScript ?**
R : Typage statique = moins d'erreurs, meilleure maintenabilité, autocomplétion IDE.

**Q : Next.js vs React pur ?**
R : Next.js = React + SSR + routing + API + optimisations. Gain de productivité énorme.

**Q : Pourquoi Capacitor et pas React Native ?**
R : Capacitor = réutilisation du code web existant. Pas besoin de réécrire en natif.

**Q : MediaPipe vs API cloud ?**
R : MediaPipe = gratuit, offline, privacy. API cloud = plus précis mais payant. On utilise les deux avec fallback.

### Fonctionnel

**Q : Fiabilité de l'analyse ?**
R : MediaPipe est une technologie Google éprouvée. Précision ~85-90% pour détection faciale.

**Q : Protection des données ?**
R : Photos stockées localement uniquement. Pas d'envoi serveur sauf pour analyse API (optionnel).

**Q : Monétisation ?**
R : Commissions sur ventes produits + partenariats marques + version premium future.

### Projet

**Q : Durée de développement ?**
R : [Indiquer votre timeline réelle]

**Q : Équipe ?**
R : [Nombre de personnes, rôles]

**Q : Déploiement ?**
R : Prototype fonctionnel. Production avec partenariats marques cosmétiques.

---

Bon courage pour votre présentation ! 🎤🚀
