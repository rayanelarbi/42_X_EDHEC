# Présentation Orale - Projet Skincare 42 x EDHEC
## Durée : 8-10 minutes

---

## 📋 PLAN DE PRÉSENTATION

1. **Introduction** (1 min)
2. **Contexte et Objectifs** (1 min)
3. **Architecture et Stack Technique** (3 min)
4. **Fonctionnalités Clés** (2 min)
5. **Défis Techniques** (1-2 min)
6. **Conclusion et Perspectives** (1 min)

---

## 🎤 TEXTE DE PRÉSENTATION

### 1. INTRODUCTION (1 minute)

Bonjour à tous,

Je vais vous présenter aujourd'hui un projet de collaboration entre l'École 42 et l'EDHEC : une application web et mobile de diagnostic de peau et de recommandation de produits cosmétiques personnalisés.

Ce projet s'inscrit dans la tendance actuelle du "skincare" personnalisé et de l'analyse dermatologique assistée par intelligence artificielle. L'objectif est de démocratiser l'accès à une analyse de peau professionnelle et de proposer des recommandations produits adaptées à chaque utilisateur.

---

### 2. CONTEXTE ET OBJECTIFS (1 minute)

**Le problème identifié :**
Aujourd'hui, les consommateurs sont perdus face à la multitude de produits cosmétiques disponibles. Comment choisir les bons produits pour son type de peau et ses problèmes spécifiques ?

**Notre solution :**
Une application qui :
- Analyse la peau de l'utilisateur via une simple photo
- Détecte automatiquement les problèmes cutanés (acné, rides, cernes, pores, taches)
- Propose des produits adaptés avec des routines personnalisées
- Fonctionne sur web ET mobile (iOS/Android)

**Public cible :**
Les personnes soucieuses de leur peau qui cherchent des recommandations fiables et personnalisées, sans avoir besoin de consulter un dermatologue.

---

### 3. ARCHITECTURE ET STACK TECHNIQUE (3 minutes)

#### 3.1 - Frontend (Next.js 14)

Nous avons choisi **Next.js 14** comme framework principal pour plusieurs raisons :
- **App Router** : architecture moderne avec routes imbriquées
- **Server-Side Rendering** : meilleure performance et SEO
- **API Routes** : backend intégré pour la communication avec les APIs externes
- **TypeScript** : typage statique pour réduire les erreurs

L'interface utilise :
- **React 18** : composants réactifs et hooks modernes
- **Tailwind CSS** : styling utilitaire et responsive design
- **Lucide React** : bibliothèque d'icônes moderne
- **Shadcn/ui** : composants UI réutilisables et accessibles

#### 3.2 - Mobile (Capacitor)

Pour le déploiement mobile, nous utilisons **Capacitor 7** :
- Conversion de l'app web en applications natives iOS et Android
- Accès aux fonctionnalités natives : **caméra**, stockage, permissions
- Un seul code source pour toutes les plateformes
- Performance quasi-native

#### 3.3 - Gestion d'État (Zustand)

**Zustand** est notre solution de state management :
- Plus simple et léger que Redux
- API minimaliste et intuitive
- Parfaitement intégré avec React hooks
- Persistance locale des données utilisateur

Nous stockons :
- Les résultats du questionnaire
- Les photos de l'utilisateur
- L'analyse de peau
- Le panier et les recommandations

#### 3.4 - Intelligence Artificielle et Analyse d'Image

C'est le cœur technique du projet. Nous utilisons deux approches complémentaires :

**MediaPipe (Google) - Analyse locale :**
- Bibliothèque d'IA open-source de Google
- Détection faciale avec 468 points de repère
- Analyse en temps réel, 100% gratuite
- Fonctionne hors ligne
- Détection précise des zones du visage (yeux, joues, front, nez)

**AILabTools API - Analyse avancée (optionnel) :**
- API cloud pour analyse dermatologique professionnelle
- Détection de 6 types de problèmes cutanés
- Scoring de sévérité et confiance
- Système de fallback automatique vers MediaPipe en cas d'indisponibilité

Notre système garantit **entre 3 et 8 détections par visage** pour une analyse complète.

#### 3.5 - Structure du Projet

```
42_X_EDHEC/
├── app/                    # Pages et routes Next.js
│   ├── page.tsx           # Page d'accueil
│   ├── camera/            # Capture photo
│   ├── quiz/              # Questionnaire
│   ├── result/            # Résultats et analyse
│   ├── routine/           # Routine personnalisée
│   ├── cart/              # Panier
│   └── api/               # API routes
│       ├── skin-analysis/ # Analyse de peau
│       └── beauty-filter/ # Filtres beauté
├── components/            # Composants React réutilisables
├── lib/                   # Logique métier
│   ├── skinAnalysis.ts    # Algorithmes d'analyse
│   ├── scoring.ts         # Calcul des scores
│   ├── productData.ts     # Base de données produits
│   └── routine.ts         # Génération de routines
├── store/                 # État global Zustand
└── android/ios/           # Applications mobiles Capacitor
```

---

### 4. FONCTIONNALITÉS CLÉS (2 minutes)

#### 4.1 - Parcours Utilisateur

**Étape 1 : Questionnaire**
L'utilisateur remplit un questionnaire sur :
- Son type de peau
- Ses préoccupations principales
- Son âge et son genre
- Son exposition au soleil
- Ses habitudes cosmétiques actuelles

**Étape 2 : Capture Photo**
- Prise de selfie via la caméra native
- Guidelines pour une photo optimale (éclairage, distance, angle)
- Compression intelligente pour optimiser la taille

**Étape 3 : Analyse IA**
L'algorithme détecte automatiquement :
- **Acné** : boutons, inflammations (joues, front, nez)
- **Rides** : front, contour des yeux
- **Cernes** : sous les deux yeux
- **Pores dilatés** : zone T (nez, front)
- **Taches pigmentaires** : joues, front
- **Rougeurs** : irritations cutanées

Chaque problème reçoit :
- Un score de **sévérité** (0-100)
- Un niveau de **confiance** (0-100)
- Une **localisation précise** sur le visage

**Étape 4 : Résultats**
Affichage visuel avec :
- Photo "Avant" avec marqueurs colorés sur les zones problématiques
- Photo "Après" simulée avec application du produit recommandé
- Score global de qualité de peau
- Type de peau détecté

**Étape 5 : Recommandations**
- **Produit principal** adapté au genre et aux problèmes détectés
- **Produits complémentaires** pour une routine complète
- **Routine détaillée** matin et soir
- **Liste d'ingrédients** avec explications
- **Irritation Guard** : ingrédients à éviter selon le profil

#### 4.2 - Système de Scoring

Nous avons développé un algorithme de scoring sophistiqué qui :
- Pondère chaque type de problème selon sa gravité
- Calcule un score global de peau (40-95)
- Génère des recommandations personnalisées
- Adapte les produits selon le genre et l'âge

#### 4.3 - Base de Données Produits

4 produits principaux avec pour chacun :
- Compositions détaillées
- Ingrédients clés et leurs bénéfices
- Prix et disponibilité
- Routines d'utilisation complètes
- Traductions FR/EN

---

### 5. DÉFIS TECHNIQUES RENCONTRÉS (1-2 minutes)

#### 5.1 - Analyse d'Image en Temps Réel

**Défi :** Analyser une photo et détecter précisément les problèmes de peau.

**Solution :**
- Intégration de MediaPipe pour la détection faciale
- Algorithmes personnalisés d'analyse de couleur et texture
- Calcul de luminosité, rougeur, variations de texture
- Mapping précis des 468 landmarks du visage vers des zones cutanées

#### 5.2 - Performance Mobile

**Défi :** L'analyse IA est coûteuse en ressources, risque de ralentir l'app mobile.

**Solution :**
- Compression d'image intelligente avant analyse
- Traitement asynchrone avec loading states
- Optimisation des algorithmes (analyse par blocs de pixels)
- Caching des résultats

#### 5.3 - Gestion des API Externes

**Défi :** Dépendance à une API payante (AILabTools) avec risque de crédits épuisés.

**Solution :**
- Architecture à 3 niveaux avec fallback automatique :
  1. AILabTools (si crédits disponibles)
  2. MediaPipe (analyse locale gratuite)
  3. Résultats par défaut (si tout échoue)
- Monitoring des erreurs API
- Système de retry intelligent

#### 5.4 - Responsive Design et Multi-Plateforme

**Défi :** Une seule codebase pour web, iOS et Android.

**Solution :**
- Tailwind CSS avec breakpoints mobile-first
- Capacitor pour les APIs natives
- Tests sur différents devices
- Adaptations spécifiques pour les contraintes mobiles (permissions caméra, stockage)

---

### 6. CONCLUSION ET PERSPECTIVES (1 minute)

#### Bilan du Projet

Nous avons réussi à créer une **application complète et fonctionnelle** qui :
- ✅ Analyse la peau avec précision (3-8 détections par visage)
- ✅ Fonctionne sur web et mobile (iOS/Android)
- ✅ Propose des recommandations personnalisées
- ✅ Offre une expérience utilisateur fluide
- ✅ Utilise des technologies modernes et scalables

#### Points Forts

1. **Architecture technique solide** : Next.js 14, TypeScript, Capacitor
2. **IA performante** : MediaPipe + AILabTools avec fallback
3. **Design professionnel** : UI moderne et intuitive
4. **Multi-plateforme** : un seul code pour toutes les plateformes
5. **Scalabilité** : facile d'ajouter de nouveaux produits ou analyses

#### Perspectives d'Amélioration

**Court terme :**
- Élargir le catalogue de produits
- Ajouter un système de notation et avis utilisateurs
- Intégrer un système de suivi de routine (avant/après sur plusieurs semaines)

**Moyen terme :**
- Déploiement sur App Store et Google Play
- Partenariats avec marques cosmétiques
- Système de recommandations basé sur machine learning (historique utilisateur)

**Long terme :**
- Téléconsultation avec dermatologues
- Marketplace de produits
- Communauté et partage de routines

#### Technologies Clés Apprises

- Next.js 14 (App Router, Server Components)
- Computer Vision avec MediaPipe
- Déploiement mobile avec Capacitor
- State management moderne (Zustand)
- TypeScript avancé
- Intégration d'APIs externes

---

## 🎯 MESSAGES CLÉS À RETENIR

1. **Innovation** : Application IA pour analyse dermatologique accessible à tous
2. **Technique** : Stack moderne (Next.js, MediaPipe, Capacitor) avec architecture scalable
3. **Complet** : Solution end-to-end du diagnostic aux recommandations produits
4. **Multi-plateforme** : Web + Mobile avec un seul code source
5. **Robuste** : Système de fallback et gestion d'erreur avancée

---

## 📊 CHIFFRES CLÉS

- **3-8** défections par analyse de visage
- **468** points de repère facial (MediaPipe)
- **6** types de problèmes détectés
- **4** produits recommandés avec routines complètes
- **2** langues supportées (FR/EN)
- **3** plateformes : Web, iOS, Android
- **100%** gratuit et illimité (avec MediaPipe)

---

## 💡 CONSEILS DE PRÉSENTATION

1. **Introduction** : Captez l'attention avec un exemple concret
2. **Démo** : Si possible, montrez l'app en action
3. **Technique** : Soyez précis mais évitez le jargon excessif
4. **Défis** : Montrez que vous avez surmonté des obstacles
5. **Passion** : Montrez votre enthousiasme pour le projet
6. **Questions** : Anticipez les questions potentielles

### Questions Fréquentes à Anticiper

**Q : Pourquoi Next.js plutôt que React seul ?**
R : Next.js offre le SSR, les API routes intégrées, et une meilleure performance out-of-the-box.

**Q : Comment garantissez-vous la précision de l'analyse ?**
R : Nous utilisons MediaPipe (Google) avec des algorithmes éprouvés, plus validation par seuils adaptatifs.

**Q : Quelle est la différence avec les apps existantes ?**
R : Analyse locale gratuite, multi-plateforme, focus sur les routines complètes pas juste la vente.

**Q : Temps de développement ?**
R : [Adaptez selon votre timeline]

**Q : Déploiement prévu ?**
R : Prototype fonctionnel, déploiement en production envisageable avec partenariats marques.

---

## ⏱️ TIMING INDICATIF

- **00:00 - 01:00** : Introduction et contexte
- **01:00 - 02:00** : Objectifs et problématique
- **02:00 - 05:00** : Architecture et stack technique
- **05:00 - 07:00** : Fonctionnalités et démonstration
- **07:00 - 08:30** : Défis techniques
- **08:30 - 10:00** : Conclusion et perspectives

**Durée totale : 8-10 minutes**

---

Bonne présentation ! 🚀
