# 🎬 TP7 – Microservices avec Kafka, gRPC et GraphQL

Ce projet implémente un mini système de gestion de films et séries TV basé sur une architecture microservices, intégrant :

- ✅ Kafka (messagerie)
- ✅ gRPC (communication inter-service)
- ✅ GraphQL (API unifiée)
- ✅ Express.js (API Gateway REST + GraphQL)
- ✅ Node.js (services backend)

---

## 🧱 Architecture

```text
+-------------+      +-------------+      +----------------+
|  API Gateway| ---> | Kafka Topic | ---> | Movie Service  |
| (REST + GQL)|      |             |      | gRPC + fichier |
+-------------+      +-------------+      +----------------+

                         |
                         v
                +----------------+
                | TV Show Service|
                |  (gRPC Server) |
                +----------------+
```

---

## 🚀 Lancement local

### 1. Prérequis

- Node.js
- Kafka & Zookeeper
- Git

### 2. Lancer Kafka et Zookeeper (exemple Windows)

```bash
cd C:\kafka_2.12-3.9.0
.in\windows\zookeeper-server-start.bat .\config\zookeeper.properties

.in\windows\kafka-server-start.bat .\config\server.properties
```

### 3. Créer les topics

```bash
.in\windows\kafka-topics.bat --create --topic movies_topic --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
.in\windows\kafka-topics.bat --create --topic tvshows_topic --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
```

---

### 4. Lancer les services

```bash
# Terminal 1
node movieMicroservice.js

# Terminal 2
node tvShowMicroservice.js

# Terminal 3
node apiGateway.js
```

---

## 📡 Accès GraphQL

> Via Apollo Sandbox  
👉 http://localhost:3000/graphql

### Exemple Mutation

```graphql
mutation {
  createMovie(id: "101", title: "Inception", description: "Science-fiction") {
    id
    title
    description
  }
}
```

### Exemple Query

```graphql
{
  movies {
    id
    title
    description
  }
}
```

---

## 📮 Test REST avec Postman

### POST http://localhost:3000/movies
```json
{
  "id": "102",
  "title": "Avatar",
  "description": "Film de James Cameron"
}
```

---

## 📁 Structure

```
├── apiGateway.js
├── movieMicroservice.js
├── tvShowMicroservice.js
├── schema.js
├── resolvers.js
├── movie.proto
├── tvShow.proto
├── film.json
├── package.json
```

---

## 🧑‍💻 Auteur

> 👤 [hergliyoussef](https://github.com/hergliyoussef)