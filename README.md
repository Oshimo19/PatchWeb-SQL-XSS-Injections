# PatchWeb-SQL-XSS-Injections

**Amélioration et sécurisation du projet IPSSI_PATCH**

---

## 0. Contexte du projet

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

* Une distribution Linux (Debian, Fedora, etc.)
* Une connexion Internet
* Docker Engine incluant Docker et Docker Compose
  - https://docs.docker.com/engine/install
* Node.js et npm  
  - https://nodejs.org/en/download
* Un accès à l’API `randomuser.me`
* Git installé sur la machine
* Un navigateur web (Firefox, Google Chrome, Opera, etc.)

---

### 4.1 Clonage du dépôt

```bash
git clone https://github.com/Oshimo19/PatchWeb-SQL-XSS-Injections.git
cd PatchWeb-SQL-XSS-Injections
```

---

### 4.2 Installation des dépendances NodeJS

**Cette étape est nécessaire avant le lancement du projet**, même avec Docker.

Elle permet de :

* générer les dossiers `node_modules/` dans `backend/` et `frontend/my-app/`, qui contiennent toutes les dépendances et bibliothèques indiquées dans les fichiers `package.json` de chaque projet, afin de pouvoir les exécuter.
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

Attendre que tous les services soient démarrés.

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

➔ **Ceci est normal pour une Single Page Application (SPA) React et ne devient une vulnérabilité qu’après confirmation par vérification manuelle (voir section suivante).**

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
curl -X POST http://localhost:<BACKEND_PORT>/populate \
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

1. Aller sur [http://localhost:<FRONTEND_PORT>](http://localhost:<FRONTEND_PORT>>)
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
1' OR 1=1
```

Résultat attendu : Rejet avec un message d'erreur

---

## 8. À propos de l’encodage HTML des noms dans la base de données

Exemples observés :

```
Name : N&uacute;ria Caldeira
Name : Ceyhan G&uuml;m&uuml;&scedil;pala
```

### Pourquoi c’est normal ?

* Les données sont **encodées côté backend**
* Le frontend n’interprète **aucun HTML**
* Cela empêche les principaux types de XSS (DOM‑XSS, XSS réfléchies et XSS stockées)

➔ **La sécurité est priorisée sur l’affichage esthétique**

---

## 9. Vérification de la vulnérabilité React2Shell

Dans le cadre de notre projet, nous avons testé si notre application frontend était vulnérable à la vulnérabilité critique **React2Shell**.

- Scanner utilisé : [assetnote/react2shell-scanner](https://github.com/assetnote/react2shell-scanner)  
- Documentation suivie : [IT-Connect – React2Shell : comment vérifier si votre application web est vulnérable](https://www.it-connect.fr/react2shell-comment-verifier-si-votre-application-web-est-vulnerable/)

#### 9.1. Vérification du fonctionnement normal du serveur (port <FRONTEND_PORT>)

Fonctionnement normal

```bash
# On interroge le frontend avec curl
$ curl -X GET http://localhost:<FRONTEND_PORT>/ -I  
                
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *
Content-Type: text/html; charset=utf-8
Accept-Ranges: bytes
Content-Length: 1711
ETag: W/"6af-+M4OSPFNZpwKBdFEydrj+1+V5xo"
Vary: Accept-Encoding
Date: Sat, 13 Dec 2025 14:54:43 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

#### 9.2. Lancement du scanner React2Shell

```bash
# Exécution du scanner sur l’URL du frontend
$ python3 scanner.py -u http://localhost:<FRONTEND_PORT>/ -v    

brought to you by assetnote

[*] Loaded 1 host(s) to scan
[*] Using 10 thread(s)
[*] Timeout: 10s
[*] Using RCE PoC check
[!] SSL verification disabled

[NOT VULNERABLE] http://localhost:<FRONTEND_PORT>/ - Status: 404
  Response snippet:
    HTTP/1.1 404 Not Found
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Methods: *
    Access-Control-Allow-Headers: *
    Content-Security-Policy: default-src 'none'
    X-Content-Type-Options: nosniff
    Content-Type: text/html; charset=utf-8
    Content-Length: 140
    Vary: Accept-Encoding

============================================================
SCAN SUMMARY
============================================================
  Total hosts scanned: 1
  Vulnerable: 0
  Not vulnerable: 1
  Errors: 0
============================================================

```

Notre application **frontend n’est pas vulnérable** à la vulnérabilité React2Shell selon ce scanner.

---


## 9. Limites connues et pistes d’amélioration

**Ce projet n’est pas sécurisé à 100 %**

Il limite fortement les attaques les plus courantes, mais :

* Certaines injections complexes peuvent exister
* L’encodage global peut impacter l’affichage (noms, accents)

### Pistes d’amélioration :

* Encodage ciblé (< > " ') au lieu d’un encodage global
* Décodage sécurisé côté frontend avec **DOMPurify**
* Journalisation des tentatives d’attaque (OWASP Top 10 - A09:2021 Carence des systèmes de contrôle et de journalisation)
* Rate limiting (éviter les attaques DoS / DDoS)
* Tests SAST pour tester la sécurité du code via des outils comme SonarQube
* Tests DAST pour tester la sécurité de l'application via des outils comme Burp DAST ou Qualys

---

## 10. Couverture de OWASP Top 10:2021

| Catégorie                       | Couverture                 |
| ------------------------------- | -------------------------- |
| A03 – Injection                 | ✅ Oui                      |
| A04 – Conception non sécurisée  | ✅ Oui                      |
| A05 – Mauvaise configuration de sécurité | ✅ Oui             |
| A09 – Carence des systèmes de contrôle et de journalisation           | ❌ Non                      |
| Autres                          | Hors périmètre |

---

## 11. Conclusion

Ce projet illustre :

* Une **amélioration concrète** d’un projet volontairement vulnérable
* Une **approche réaliste de sécurisation**
* L’usage d’outils modernes (ORM, Docker, tests)
* Une conformité partielle aux standards OWASP

➔ **Il s’agit d’un projet de sécurisation pédagogique**, pas d’un produit prêt pour la production.

---
