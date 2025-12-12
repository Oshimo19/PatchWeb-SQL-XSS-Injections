# PatchWeb-SQL-XSS-Injections

**Amélioration et sécurisation du projet IPSSI_PATCH**

---

## 0. Contexte du projet (important)

Ce projet est une **amélioration et une sécurisation** du dépôt initial suivant :

➔ **Repository source** :
[https://github.com/ademjemaa/IPSSI_PATCH](https://github.com/ademjemaa/IPSSI_PATCH)

Le projet original avait pour objectif pédagogique de **montrer volontairement des failles de sécurité web**, notamment :

* SQL Injection
* Cross-site Scripting (XSS) stockée
* Mauvaise gestion des entrées utilisateur
* Exposition de la base de données
* Absence de séparation frontend / backend
* Absence de tests de sécurité

---

## 1. Objectif de ce projet

### Objectif

> **Sécuriser l’application contre les injections SQL et XSS**, tout en conservant la même architecture fonctionnelle.

Ce projet ne prétend **pas être parfaitement sécurisé**, mais vise à **réduire la surface d’attaque** en appliquant des **bonnes pratiques de sécurité et de développement**.

---

### Moyens techniques utilisés

Pour atteindre cet objectif, plusieurs améliorations majeures ont été introduites par rapport au projet initial :

* **Framework backend moderne (Express structuré)**
* **ORM (Sequelize)**
  → Suppression totale des requêtes SQL dynamiques
* **Découplage des responsabilités**
  * Routes
  * Contrôleurs
  * Services
  * Middlewares
* **Validation stricte des entrées**
* **Encodage défensif contre le XSS**
* **Séparation frontend / backend**
* **Conteneurisation Docker**
* **Tests automatisés (Jest + scripts bash) avec aide de wordlists SQLi & XSS**
* **Sécurité HTTP (Helmet, CORS, CSP)**
* **Healthcheck et routes explicites**

---

### Moyens techniques utilisés

Pour atteindre les objectifs de sécurité et de robustesse, plusieurs améliorations majeures ont été apportées par rapport au projet initial :

* **Framework backend moderne et structuré (Express)**

* **ORM Sequelize**
  → Suppression totale des requêtes SQL dynamiques
  → Protection native contre les injections SQL

* **Découplage strict des responsabilités**
  * Routes
  * Contrôleurs
  * Services
  * Middlewares

* **Validation stricte des entrées utilisateur**
  * Types
  * Formats
  * Valeurs attendues

* **Encodage défensif contre le XSS**
  * Données encodées avant stockage
  * Restitution sécurisée côté frontend
* **Séparation claire frontend / backend**

  * API REST dédiée
  * Aucune logique métier côté client
* **Conteneurisation Docker**

  * Environnements reproductibles
  * Isolation des services

* **Tests de sécurité automatisés**
  * Jest (tests unitaires backend)
  * Scripts Bash (tests SQLi, XSS, CORS, méthodes HTTP)
  * Utilisation de wordlists SQLi et XSS

* **Sécurité HTTP renforcée**
  * Headers via Helmet
  * CORS contrôlé
  * Politique CSP

* **Supervision applicative**
  * Endpoint `/health`
  * Healthcheck Docker
  * Routes explicitement exposées

---

## 2. Comparaison : Projet initial vs Projet actuel

### Projet initial (IPSSI_PATCH)

<div align="center">

| Élément                | État         |
| ---------------------- | ------------ |
| SQL Injection          | ❌ Vulnérable |
| XSS stockée            | ❌ Vulnérable |
| ORM                    | ❌ Non        |
| Validation des entrées | ❌ Non        |
| Content-Type strict    | ❌ Non        |
| Frontend sécurisé      | ❌ Non        |
| Tests de sécurité      | ❌ Non        |
| Docker                 | ❌ Non        |

</div>

Exemple de vulnérabilité critique dans le projet initial :

```js
db.run(req.body)
```

➔ **Exécution arbitraire de SQL fourni par l’utilisateur**

---

### Projet actuel (PatchWeb)

<div align="center">

| Élément                | État          |
| ---------------------- | ------------- |
| SQL Injection          | ✅ Bloquée     |
| XSS stockée            | ✅ Neutralisée |
| ORM (Sequelize)        | ✅ Oui         |
| Validation des entrées | ✅ Oui         |
| Content-Type strict    | ✅ Oui         |
| Frontend sécurisé      | ✅ Oui         |
| Tests automatisés      | ✅ Oui         |
| Docker                 | ✅ Oui         |

</div>

---

## 3. Architecture

```bash
PatchWeb-SQL-XSS-Injections/
├── backend/
│   ├── config/              # Sécurité, headers, CORS
│   ├── controllers/
│   ├── middlewares/
│   ├── models/              # ORM Sequelize
│   ├── routes/
│   ├── services/
│   ├── tests/               # Tests Jest
│   └── server.js
│
├── frontend/
│   └── my-app/
│       ├── components/
│       ├── router.jsx
│       └── utils/
│
├── tests/
│   ├── test_backend.sh      # Tests sécurité backend
│   ├── test_frontend.sh     # Tests sécurité frontend
│   └── samplesPayloads/     # Wordlists SQLi / XSS
│
├── docker/
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   ├── tests.Dockerfile
│   └── docker-compose.yml
│
├── .env.template
└── README.md
```

---

## 4. Cloner le dépôt et préparer l’environnement

### Prérequis

* Connexion Internet **obligatoire**
  * Docker Hub
  * npm
  * API `randomuser.me`
* Docker + Docker Compose
* Git
* Node.js (uniquement pour l’installation locale des dépendances)
* Navigateur web

---

### 4.1 Clonage du dépôt

```bash
git clone https://github.com/<ton-repo>/PatchWeb-SQL-XSS-Injections.git
cd PatchWeb-SQL-XSS-Injections
```

---

### 4.2 Installation des dépendances (obligatoire)

**Cette étape est nécessaire avant le lancement du projet**, même avec Docker.

Elle permet de :

* générer les répertoires `nodes_modules/` qui stockent toutes les dépendances et librairies définies dans les fichiers "package.json" nécessaire pour faire tourner les projets backend et frotend respectivement
* éviter les erreurs `npm ci` lors des builds Docker
* garantir la reproductibilité

#### Backend

```bash
cd backend
npm install
cd ..
```

#### Frontend

```bash
cd frontend/my-app
npm install
cd ../..
```

---

### 4.3 Variables d’environnement

Le projet utilise **un seul fichier `.env` global**, situé à la racine du projet.

#### Création du fichier `.env`

Créer le fichier à partir du template fourni :

```bash
cp .env.template .env
```

#### Configuration

Ouvrir le fichier `.env` et **remplacer les valeurs d’exemple** (notamment les ports) par des valeurs adaptées à votre environnement, en vous basant sur les commentaires présents dans le fichier.

> Attention : Les variables `<BACKEND_PORT>` et `<FRONTEND_PORT>` doivent être remplacées par des ports libres sur votre machine.

---

## 5. Lancement du projet

### 5.1 Build + démarrage

```bash
docker compose --env-file .env -f docker/docker-compose.yml up -d --build
```

Attendre que le backend soit **healthy**.

---

### 5.2 Accès aux services

* **Frontend**
    - [http://localhost:<FRONTEND_PORT>](http://localhost:<FRONTEND_PORT>)

* **Backend (API)**
    - [http://localhost:<BACKEND_PORT>](http://localhost:<BACKEND_PORT>)
    - [http://localhost:<BACKEND_PORT>/health](http://localhost:<BACKEND_PORT>/health)

---

### 5.3 Arrêt et nettoyage complet

```bash
docker compose --env-file .env -f docker/docker-compose.yml down -v
```

* Arrête tous les conteneurs
* Supprime les volumes
* Réinitialise la base SQLite Docker

---

## 6. Tests automatisés

### 6.1 Backend – `test_backend.sh`

Couvre :

* Healthcheck
* Initialisation de la base (`/populate`)
* SQL Injection (tous les payloads)
* XSS (tous les payloads)
* Content-Type strict (`application/json`)
* Méthodes interdites
* Routes non exposées

```bash
docker exec -it security-tests bash
./test_backend.sh
```

---

### 6.2 Frontend – `test_frontend.sh`

Couvre :

* Accessibilité frontend
* CORS
* Création utilisateur
* Query valide
* SQLi via frontend
* XSS via frontend
* Content-Type strict
* Routes frontend

```bash
docker exec -it security-tests bash
./test_frontend.sh
```

**Attention aux faux positifs**

Lors des tests via `curl`, certaines routes frontend peuvent répondre :

```
You need to enable JavaScript to run this app.
```

➔ **Ceci est normal pour une SPA React** et **ne constitue pas une vulnérabilité**.

➔ **Des tests manuels sont obligatoires** (voir section suivante).

---

## 7. Tests manuels

### 7.1 Initialisation obligatoire de la base (`/populate`)

Avant d’effectuer **tout test manuel** (frontend ou backend), la base de données doit être **explicitement initialisée**.

Cette étape est indispensable car :

* la base SQLite est **vide au démarrage**
* aucune donnée n’est créée automatiquement sans appel explicite
* les tests SQLi, XSS et frontend **dépendent de données existantes**

### Requête d’initialisation

```bash
curl -X POST http://localhost:8000/populate \
  -H "Content-Type: application/json" \
  -d "{}"
```

### Résultat attendu

* `200 OK` → base créée et initialisée avec **3 utilisateurs**
* `409 Conflict` → base déjà initialisée (**cas normal**)

➔ **Dans les deux cas, l’état est valide et les tests peuvent commencer.**

### Quand exécuter `/populate` ?

* Après le démarrage Docker
* Avant :

  * tests XSS manuels
  * tests SQL Injection manuels
  * navigation frontend
  * tests via `curl` ou navigateur

> Cette étape est automatiquement réalisée dans les scripts de tests automatisés, mais **doit être faite manuellement lors des tests manuels** 

---

### 7.2 Test XSS manuel

1. Aller sur [http://localhost:3000](http://localhost:3000)
2. Poster un commentaire :

   ```html
   <script>alert(1)</script>
   ```
3. Résultat attendu :

   * Aucun popup
   * Le script est affiché comme texte encodé

---

### 7.3 Test SQL Injection manuel

Dans le champ ID utilisateur :

```
1 OR 1=1
```

Résultat attendu : Rejet avec un message d'erreur

---

## 8. À propos de l’encodage HTML des noms

Exemples observés :

```
Name : N&uacute;ria Caldeira
Name : Ceyhan G&uuml;m&uuml;&scedil;pala
```

### Pourquoi c’est normal ?

* Les données sont **encodées côté backend**
* Le frontend n’interprète **aucun HTML**
* Cela empêche toute type de XSS

➔ **La sécurité est priorisée sur l’affichage esthétique**

---

## 9. Limites connues et pistes d’amélioration

**Ce projet n’est pas sécurisé à 100 %**

Il limite fortement les attaques les plus courantes, mais :

* Certaines injections complexes peuvent exister
* L’encodage global peut impacter l’affichage (noms, accents)

### Pistes d’amélioration :

* Encodage ciblé (< > " ') au lieu d’un encodage global
* Décodage sécurisé côté frontend avec **DOMPurify**
* Journalisation des tentatives d’attaque (OWASP Top 10 - A09)
* Rate limiting (éviter les attaques DoS / DDoS)
* Tests SAST pour tester la sécurité du code via des outils comme SonarQube
* Tests DAST pour tester la sécurité de l'application via des outils comme Burp DAST ou Qualys

---

## 10. Couverture OWASP Top 10 (2021 / 2025)

| Catégorie                       | Couverture                 |
| ------------------------------- | -------------------------- |
| A03 – Injection                 | ✅ Oui                      |
| A04 – Insecure Design           | ✅ Oui                      |
| A05 – Security Misconfiguration | ✅ Oui                      |
| A09 – Logging                   | ❌ Non                      |
| Autres                          | Hors périmètre |

---

## 11. Conclusion

Ce projet illustre :

* Une **amélioration concrète** d’un projet volontairement vulnérable
* Une **approche réaliste de sécurisation**
* L’usage d’outils modernes (ORM, Docker, tests)
* Une conformité partielle mais pertinente aux standards OWASP

➔ **Il s’agit d’un projet de sécurisation pédagogique**, pas d’un produit prêt pour la production.

---
