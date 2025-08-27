# Processus de Déploiement Sécurisé

Ce document explique comment garantir que votre code sera déployé uniquement s'il passe avec succès la vérification TypeScript.

## 📋 Prérequis
- Node.js et npm installés
- Dépôt cloné avec `typescript` déjà configuré
- Accès en écriture au dépôt GitHub

## 🚀 Processus en 3 étapes

### 1. Vérification TypeScript (avant chaque push)
```bash
npm run tck
```

**Résultats attendus :**
- ✅ **Succès** (0 erreur) → Le code peut être poussé et sera déployé
- ❌ **Échec** (erreurs affichées) → Le code ne sera PAS déployé

### 2. Correction des erreurs (si nécessaire)
1. Lisez attentivement les erreurs TypeScript
2. Corrigez votre code
3. Relancez `npm run tck` jusqu'à obtenir 0 erreur

### 3. Push et Déploiement
```bash
git add .
git commit -m "votre message descriptif"
git push origin votre-branche
```

## ⚙️ Configuration Technique
Le projet contient :
- `typescript` comme dépendance
- Un script `tck` dans `package.json` :

  ```json
   "scripts": {
    "dev": "vite",
    "tck": "vue-tsc",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  ```

## 🛡️ Bonnes Pratiques
- **Exécutez toujours `npm run tck` localement** avant de pousser
- **Ne forcez jamais un push** si la vérification échoue
- **Vérifiez les logs CI/CD** si le déploiement échoue

## ❓ Questions Fréquentes
**Q: Puis-je ignorer cette vérification en urgence ?**  
⚠️ **Non** - C'est une mesure de sécurité critique.

**Q: Comment accélérer le processus ?**  
Configurez votre IDE pour afficher les erreurs TypeScript en temps réel.

**Q: Où sont les logs complets ?**  
Dans l'onglet "Actions" de votre dépôt GitHub après un push.
