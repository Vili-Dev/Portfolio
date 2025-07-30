# Portfolio Développeur Web & Mobile

## Description
Portfolio complet et impressionnant pour un développeur web & web mobile en formation, avec un design ténébreux/sombre, minimaliste, inspiré de l'univers anime/geek. Le site met en valeur les projets, le parcours, les compétences et inclut un formulaire de contact sécurisé.

## Fonctionnalités principales
- **Design ténébreux immersif** : Animation de fond en JavaScript avec particules brumeuses et ombres mouvantes
- **Navigation responsive** : Menu mobile avec hamburger et navigation fluide
- **Sections interactives** :
  - Page d'accueil avec animation d'entrée
  - Parcours interactif avec timeline animée
  - Galerie de projets avec filtres et modales
  - Section "À propos" immersive avec micro-interactions
  - Formulaire de contact sécurisé avec EmailJS
- **Accessibilité** : Conforme WCAG 2.1 AA avec navigation clavier et ARIA
- **Responsive** : Design mobile-first parfaitement adapté à tous les écrans
- **Mode sombre/clair** : Toggle pour basculer entre les modes
- **Easter eggs** : Animation anime activée par le code Konami

## Technologies utilisées
- **Frontend** : HTML5, SCSS moderne, JavaScript natif
- **Animations** : GSAP pour les animations fluides
- **Formulaires** : EmailJS pour la sécurité
- **Build** : Sass pour la compilation CSS

## Structure du projet
```
Portfolio/
├── index.html
├── parcours.html
├── projects.html
├── about.html
├── contact.html
├── dist/
│   └── css/
│       └── main.css
├── src/
│   ├── js/
│   │   ├── particles.js
│   │   ├── navigation.js
│   │   ├── hero.js
│   │   ├── timeline.js
│   │   ├── projects.js
│   │   ├── about.js
│   │   ├── contact.js
│   │   └── dark-mode.js
│   └── scss/
│       ├── _variables.scss
│       ├── _mobile.scss
│       ├── _dark-mode.scss
│       ├── main.scss
│       ├── particles.scss
│       ├── navigation.scss
│       ├── hero.scss
│       ├── timeline.scss
│       ├── projects.scss
│       ├── about.scss
│       └── contact.scss
└── assets/
    ├── favicon.ico
    ├── profile.jpg
    └── project-*.jpg
```

## Installation et utilisation
1. Clonez le dépôt
2. Ouvrez simplement les fichiers HTML dans un navigateur (pas besoin de serveur local)
3. Pour modifier le style, éditez les fichiers SCSS dans `src/scss/` et compilez avec Sass

## Personnalisation
- **Animations de fond** : Modifiez `src/js/particles.js` pour ajuster la densité, la vitesse et les couleurs des particules
- **Couleurs** : Changez les variables dans `src/scss/_variables.scss`
- **Contenu** : Mettez à jour les textes et images dans les fichiers HTML
- **Projets** : Ajoutez ou modifiez les projets dans `projects.html`

## Améliorations possibles
- Ajout d'une section blog
- Intégration de statistiques de visite
- Mode de démo avec changement automatique de thème
- Intégration de réseaux sociaux en direct
- Ajout de témoignages clients

## Crédits
Développé avec passion par un développeur en formation depuis mai 2025.