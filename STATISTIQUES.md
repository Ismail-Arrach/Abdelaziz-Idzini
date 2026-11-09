# Statistiques des visiteurs et rapport Excel mensuel

Le site enregistre les visites et les clics dans un Google Sheet, gratuitement. Le 1er de chaque mois à 8 h, un e-mail part avec un fichier Excel (.xlsx) qui couvre le mois précédent.

## Ce qui est compté

| Feuille Excel | Contenu |
|---|---|
| ملخص | Visites, visiteurs distincts, demandes de consultation, clics de contact et clics vers les réseaux sociaux |
| الأقسام | Nombre de vues de chaque section (نبذة، المسار، المؤلفات…) |
| الكتب | Livres les plus consultés, c'est-à-dire ceux sur lesquels on a cliqué dans le carrousel |
| النقرات | Onglets, consultation, e-mail, Facebook, YouTube, liens externes |
| حسب اليوم | Visites jour par jour |
| الأجهزة والمصادر | Téléphone, tablette ou ordinateur, et site d'origine (Google, Facebook…) |

Aucune donnée personnelle n'est collectée : ni nom, ni adresse IP, ni e-mail. Chaque visiteur reçoit seulement un identifiant aléatoire.

## Mise en place (une seule fois, environ 10 minutes)

1. Sur [sheets.google.com](https://sheets.google.com), connectez-vous avec le compte Gmail qui enverra les rapports. Créez une feuille vide nommée « Statistiques site Idzini ».
2. Ouvrez le menu **Extensions → Apps Script**. Effacez le contenu, collez tout le fichier `google-apps-script/Code.gs`, puis enregistrez.
   - Pour envoyer les rapports à une autre adresse, modifiez la ligne `REPORT_EMAIL`. Plusieurs adresses peuvent être séparées par des virgules.
3. Dans la liste des fonctions, choisissez **setup** puis cliquez sur **Exécuter**.
   - Acceptez les autorisations (Sheets, Gmail, Drive).
   - Si Google affiche « Application non validée », passez par **Paramètres avancés → Accéder au projet**.
4. Déployez le script :
   - Cliquez sur **Déployer → Nouveau déploiement → Type : Application Web**.
   - Choisissez **Exécuter en tant que : Moi** et **Qui a accès : Tout le monde**, puis cliquez sur **Déployer**.
   - Copiez l'URL qui se termine par `/exec`.
5. Dans `data.js`, collez cette URL :
   ```js
   analyticsUrl: "https://script.google.com/macros/s/XXXXXXXX/exec",
   ```
6. Mettez le site en ligne. Les visites ne sont comptées que lorsque le site est hébergé (Netlify, GitHub Pages, hébergeur…).

## Vérifier

- Ouvrez l'URL `/exec` dans le navigateur. Elle doit afficher « OK — N حدث مسجل ».
- Visitez le site, puis regardez la feuille **Events** : une ligne apparaît pour chaque action.
- Pour recevoir un rapport tout de suite sans attendre le 1er du mois, choisissez **testReportNow** dans Apps Script, puis cliquez sur **Exécuter**.

## Bon à savoir

- Le compte Gmail gratuit permet environ 100 e-mails par jour et 20 000 lectures d'URL par jour. C'est largement suffisant.
- Si vous modifiez `Code.gs` plus tard, passez par **Déployer → Gérer les déploiements → Modifier → Nouvelle version**. Ainsi, l'URL ne change pas.
- Pour désactiver les statistiques, laissez `analyticsUrl: ""` dans `data.js`.
