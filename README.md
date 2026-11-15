# Boutique d'ustensiles de cuisine — site vitrine

Site statique (HTML, CSS, JavaScript sans dépendance) pour présenter des couteaux, casseroles, pâtisserie et accessoires.

## Structure

```
boutique-ustensiles-cuisine/
├── index.html          Accueil : hero, univers, sélection, guides
├── pages/
│   ├── produits.html   Catalogue avec filtres (univers, marque, prix, tri)
│   ├── guides.html     Guides d'achat
│   └── contact.html    Formulaire de contact (envoi par e-mail)
├── css/style.css       Styles (couleurs dans :root)
├── js/
│   ├── main.js         Fonctions communes, accueil, contact
│   └── produits.js     Filtres de la page Produits
└── data/produits.json  Catalogue : modifiez ce fichier pour changer les produits
```

## Personnaliser

1. **Nom de la boutique** : remplacez `E-varotra` dans toutes les pages HTML.
2. **E-mail de contact** : modifiez `CONTACT_EMAIL` au début de `js/main.js`.
3. **Couleurs** : modifiez les variables dans `:root` de `css/style.css` (`--accent` pour la couleur principale).
4. **Produits** : éditez `data/produits.json`. Chaque entrée contient `id`, `nom`, `categorie`, `marque`, `prix`, `description`, `badge` et `vedette` (`true` pour l'afficher sur l'accueil, 4 maximum).
5. **Mentions légales** : complétez le texte « Mentions légales à compléter » dans les pieds de page.
6. **Images** : les produits affichent actuellement un cadre avec le nom de l'univers. Pour ajouter de vraies photos, ajoutez un champ `image` dans le JSON et adaptez `productCard()` dans `js/main.js`.

Les produits, marques et prix présents sont **fictifs** : à remplacer avant mise en ligne.

## Lancer en local

Ouvrez `index.html` dans le navigateur, ou depuis le dossier du projet :

```bash
python3 -m http.server 8000
```

Puis visitez `http://localhost:8000`.

## Publier sur GitHub Pages

```bash
git init
git add .
git commit -m "Premier commit : site vitrine"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/VOTRE-DEPOT.git
git push -u origin main
```

Sur GitHub : **Settings → Pages → Source : Deploy from a branch → main / (root)**. Le site sera disponible à l'adresse `https://VOTRE-COMPTE.github.io/VOTRE-DEPOT/`.

## Notes

- Le formulaire de contact ouvre le logiciel de messagerie de l'internaute avec le message prérempli. Il n'y a pas de serveur : aucune donnée n'est stockée.
- Les prix sont affichés en euros (`fr-FR`). Adaptez `EUR` dans `js/main.js` si besoin.
- Pour une boutique avec paiement en ligne, il faudra intégrer une solution dédiée (panier, Stripe, PayPal, etc.).
