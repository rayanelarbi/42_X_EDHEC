# Dépannage - Filtre AILabTools

## 🔍 Vérifier vos crédits API

### Méthode 1 : Via l'application
1. Démarrez le serveur de développement : `npm run dev`
2. Allez sur : `http://localhost:3000/admin/credits`
3. Cette page affichera :
   - ✅ Votre solde de crédits actuel
   - 📊 Total des crédits
   - 🔑 État de la connexion API

### Méthode 2 : Via le terminal
```bash
curl -X GET https://www.ailabapi.com/api/common/query-balance \
  -H "ailabapi-api-key: Zl74J817zEy0YWMh1bpHqRR2BgOvFWLGAdrft9Q6e9XLtkUKhCPK4JUaXaoDV80m"
```

### Méthode 3 : Dashboard AILabTools
1. Connectez-vous sur : https://www.ailabtools.com
2. Allez dans votre tableau de bord
3. Section "Credits" ou "Balance"

## ❓ Pourquoi le filtre ne fonctionne plus ?

### Causes possibles :

#### 1. **Crédits épuisés** 💳
- **Symptôme** : L'API retourne une erreur 402 ou "insufficient credits"
- **Solution** : Recharger vos crédits sur ailabtools.com
- **Vérification** : Utilisez `/admin/credits` pour voir votre solde

#### 2. **Clé API invalide** 🔑
- **Symptôme** : Erreur 401 ou "unauthorized"
- **Solution** : Vérifier la clé dans `.env.local`
- **Vérification** : La clé doit être exactement celle fournie par AILabTools

#### 3. **Limite de taux dépassée** ⏱️
- **Symptôme** : Erreur 429 ou "rate limit exceeded"
- **Solution** : Attendre quelques minutes
- **Prévention** : Espacer les appels API

#### 4. **Format d'image incorrect** 🖼️
- **Symptôme** : Erreur 400 ou "invalid image"
- **Solution** : L'image doit être :
  - Format : JPG ou PNG
  - Taille : < 8 MB
  - Résolution : 200x200 à 4096x4096 pixels

## 🔧 Système de fallback

L'application a un système de fallback automatique :

```
AILabTools API
    ↓ (si échec)
Filtre local (MediaPipe)
    ↓ (si échec)
Image originale
```

### Comment voir quel système est utilisé ?

Ouvrez la console du navigateur (F12) et recherchez :
- `✅ Image traitée avec succès par AILab Tools` → API fonctionne
- `❌ Erreur AILab API, utilisation du filtre local` → Fallback actif

## 📊 Coûts de l'API

Chaque appel à l'API consomme des crédits :
- **Skin Analysis Advanced** : ~X crédits par analyse
- **Smart Skin Filter** : ~X crédits par filtre

*Remplacez X par les valeurs réelles selon la documentation AILabTools*

## 🐛 Logs de débogage

### Activer les logs détaillés

Dans le navigateur, ouvrez la console (F12) et exécutez :
```javascript
localStorage.setItem('DEBUG_AILAB', 'true');
```

Ensuite, rechargez la page et testez l'analyse de peau.

### Désactiver les logs
```javascript
localStorage.removeItem('DEBUG_AILAB');
```

## 🆘 Support

Si le problème persiste :

1. **Vérifier la documentation officielle** : https://www.ailabtools.com/doc
2. **Contacter le support AILabTools** : support@ailabtools.com
3. **Vérifier les status** : https://status.ailabtools.com (si disponible)

## 📝 Checklist de diagnostic rapide

- [ ] Crédits API > 0 (vérifier sur `/admin/credits`)
- [ ] Clé API valide dans `.env.local`
- [ ] Serveur démarré (`npm run dev`)
- [ ] Image < 8 MB
- [ ] Console du navigateur sans erreur 401/402/429
- [ ] Connexion Internet stable

## 🔄 Réinitialisation

Si rien ne fonctionne, essayez :

```bash
# 1. Nettoyer le cache
rm -rf .next

# 2. Réinstaller les dépendances
npm install

# 3. Rebuild
npm run build

# 4. Redémarrer le serveur
npm run dev
```

## 📞 Informations de contact

- **Dashboard AILabTools** : https://www.ailabtools.com/dashboard
- **Documentation API** : https://www.ailabtools.com/doc
- **Page de crédits locale** : http://localhost:3000/admin/credits
