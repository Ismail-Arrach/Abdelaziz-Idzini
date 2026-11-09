# الموقع الشخصي — د. عبد العزيز إدزني

Site-portfolio en arabe (lecture de droite à gauche), adapté au mobile. Il s'ouvre par un double-clic sur `index.html`.

## Contenu

Tout le contenu est dans **`data.js`** et provient de la « السيرة العلمية » (`Downloads\السيرة_العلمية_عبد_العزيز_إدزني.docx`) ainsi que des pages de dépôt légal des livres.

| Section | Contenu |
|---|---|
| Accueil | Nom, grade, faculté, présidence du centre, photo, couvertures de livres |
| Chiffres | Calculés automatiquement à partir des listes |
| نبذة | Biographie et domaines d'intérêt |
| المسار | Parcours professionnel, diplômes, responsabilités |
| المؤلفات | Carrousel 3D animé (défilement automatique, flèches, points, swipe mobile) : 8 ouvrages et 7 ouvrages collectifs (une carte par tome), plus la liste des 15 articles |
| التدريس | Matières enseignées en licence et en master |
| الأنشطة العلمية | 9 colloques coordonnés et 22 interventions |
| الإشراف | Thèses dirigées, jurys, mémoires de master et projets de licence |
| القنوات | YouTube, page Facebook officielle, compte personnel |
| تواصل | E-mails académique et personnel, Facebook, YouTube |

## Consultation et statistiques

- Le bouton « استشارة قانونية » ouvre un e-mail pré-rempli vers `links.email2`. On peut forcer une autre adresse avec `links.consultEmail`.
- Les statistiques de visites et le rapport Excel mensuel sont décrits dans **`STATISTIQUES.md`** (`analytics.js` et `google-apps-script/Code.gs`).

## Images

| Fichier | Usage |
|---|---|
| `images/idzini.jpg` | Photo de la section « نبذة » |
| `images/idzini-portrait.jpg` | Photo du hero (recadrée) |
| `images/books/*.jpg` | Couvertures extraites des PDF de dépôt légal |

Les livres sans couverture reçoivent une couverture typographique générée automatiquement. Pour ajouter une vraie couverture, déposez l'image dans `images/books/` et indiquez son chemin dans `cover`.

## Données volontairement exclues (vie privée)

Ne figurent pas sur le site :
- numéro de CIN ;
- date de naissance ;
- adresse personnelle ;
- situation familiale ;
- téléphone (à ajouter seulement s'il le souhaite, dans `links.phone`) ;
- noms des étudiants encadrés (seuls les titres des thèses apparaissent).

## À vérifier avec le professeur

- **Grade** : « أستاذ التعليم العالي » est affiché (hero, biographie, poste actuel) à la demande de l'utilisateur. Le parcours garde « أستاذ محاضر مؤهل » pour 2020–2026.
- **Année du doctorat** : la CV indique « 14 نونبر 20215 », corrigé en **2015**.
- **ISBN du « الوجيز »** : la CV indique « 978-42-247-5 ». C'est le numéro complet de la page de dépôt qui est utilisé : 978-9920-42-247-5.
- **Biographie** : rédigée à partir de la CV, à faire valider.

## المحاضرات والمقالات (lecture protégée)

- Section `#lectures` : les articles se lisent dans le site, triés du plus récent au plus ancien (`lectures` dans `data.js`, champ `sort`).
- Les pages sont des images extraites des PDF, telles quelles, sauf la première page de chaque PDF (université, nom, titre), qui est retirée à la demande de l'utilisateur. Elles sont rangées dans `images/lectures/<id>/<n>.jpg`.
  - Chaque image est découpée en 48 tuiles mélangées : téléchargée seule, elle est illisible. `lectures.js` remet les tuiles en ordre sur un canvas et ajoute un filigrane.
- Protections : pas de clic droit, de glisser, de sélection, d'impression ni de Ctrl+S/P/C. Le texte est flouté quand la fenêtre perd le focus ou quand on appuie sur Impr. écran.
  - Aucun site ne peut empêcher totalement une capture (photo au téléphone, outils système). Ces mesures la rendent seulement plus difficile.
- Pour ajouter une conférence : envoyer le PDF à Claude, qui recrée les images avec le même mélange et ajoute une ligne dans `lectures`.
- À vérifier : l'année de « الاستئناف المثار » (مجلة المنبر القانوني، العدد 28), qui n'est pas indiquée dans le PDF.