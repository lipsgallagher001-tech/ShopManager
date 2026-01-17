
# ShopManager - Application de Gestion de Ventes

Une application web ultra-simple, mobile-first, conçue pour les petits commerçants. Elle permet de suivre les ventes quotidiennes sans aucune formation technique.

## 🚀 Installation & Lancement

1. Clonez ou téléchargez les fichiers du projet.
2. Assurez-vous d'avoir un environnement Node.js installé.
3. Installez les dépendances : `npm install`
4. Lancez l'application en mode développement : `npm start`

## 📁 Structure du Projet

- `constants.ts` : Centralise le thème (couleurs, arrondis) et la configuration textuelle.
- `types.ts` : Définit les structures de données (User, Sale).
- `services/storage.ts` : Gère la persistance des données via `localStorage`.
- `components/` : Contient les composants UI réutilisables (Boutons, Cartes, Inputs).
- `views/` : Contient les 6 écrans principaux de l'application.
- `App.tsx` : Orchestrateur de la navigation et de l'état global.

## 🛠 Guide de Modification Rapide

### Changer les Couleurs
Rendez-vous dans `constants.ts` et modifiez les valeurs de l'objet `THEME.colors`.
Exemple : pour passer du bleu au rouge :
```typescript
primary: '#EF4444'
```

### Changer la Devise
Modifiez `APP_CONFIG.currency` dans `constants.ts`.
Exemple : `currency: '€'` ou `currency: '$'`.

### Ajouter un champ dans une vente
1. Modifiez l'interface `Sale` dans `types.ts`.
2. Ajoutez le champ dans le formulaire de `views/NewSale.tsx`.
3. Mettez à jour l'affichage dans `views/SalesList.tsx`.

## 💾 Stockage des Données

L'application utilise le `localStorage` du navigateur. Les données persistent même si vous fermez l'onglet ou le navigateur.
- `shopmanager_user` : Stocke le nom, la boutique et le mot de passe.
- `shopmanager_sales` : Stocke la liste chronologique des ventes.
- `shopmanager_is_auth` : Suit l'état de connexion de la session actuelle.

## 📱 Mobile-First

L'interface a été conçue prioritairement pour les écrans de smartphones (largeur 320px - 480px). Sur ordinateur, le contenu est automatiquement centré avec une largeur maximale de 480px pour conserver l'aspect "application mobile".
