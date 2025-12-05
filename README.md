# 🎵 SongSwipe

Application mobile de quiz musical où les joueurs devinent des chansons. Disponible en mode solo et multijoueur local (duel).

## 📱 Fonctionnalités

- **Mode Solo** : Testez vos connaissances musicales seul
- **Mode Duel Local** : Affrontez un ami sur le même téléphone, tour par tour
- **Deux niveaux de difficulté** :
  - 🟢 **Facile** : Questions à choix multiples (QCM)
  - 🔴 **Difficile** : Saisie libre du titre
- **Classement** : Suivez vos scores et comparez-vous aux autres joueurs
- **Interface moderne** : Design avec gradients et animations fluides

## 🛠️ Technologies

- React Native
- Expo
- React Navigation
- Expo Linear Gradient

## 📋 Prérequis

- Node.js (v16 ou supérieur)
- npm 
- Expo CLI
- Application Expo Go sur votre téléphone (pour les tests)

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/Math-Pav/SongSwipe

# Accéder au dossier
cd SongSwipe

# Installer les dépendances
npm install

```

## 📱 Commandes

### Développement

```bash
# Lancer le serveur de développement Expo
npm start
# ou
npx expo start
# ou
npx expo start --tunnel

# Lancer sur iOS (simulateur ou appareil)
npm run ios
# ou
npx expo start --ios

# Lancer sur Android (émulateur ou appareil)
npm run android
# ou
npx expo start --android

# Lancer dans le navigateur web
npm run web
# ou
npx expo start --web
```



```bash
# Vider le cache
npx expo start --clear

# Lancer les tests
npm test

# Vérifier le code (lint)
npm run lint

# Mettre à jour Expo SDK
npx expo upgrade
```

## 📂 Structure du projet

```
SongSwipe/
├── src/
│   ├── screens/          # Écrans de l'application
│   │   ├── MultiplayerScreen.js
│   │   ├── GameMultiLocal.js
│   │   └── ...
│   ├── components/       # Composants réutilisables
│   ├── theme/            # Styles et constantes (colors, typography, spacing)
│   └── utils/            # Fonctions utilitaires
├── assets/               # Images, sons, fonts
├── App.js                # Point d'entrée
├── app.json              # Configuration Expo
└── package.json          # Dépendances
```

## 🎮 Comment jouer

1. Lancez l'application
2. Choisissez votre mode de jeu (Solo ou Duel)
3. Pour le mode Duel :
   - Entrez les pseudos des deux joueurs
   - Sélectionnez la difficulté
   - Jouez à tour de rôle
4. Écoutez l'extrait musical et devinez le titre
5. Gagnez des points et grimpez dans le classement !

