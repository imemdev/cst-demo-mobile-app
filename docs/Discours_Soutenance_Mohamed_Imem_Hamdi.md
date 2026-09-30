# Discours de soutenance : Supervision de capteurs

**Mohamed Imem Hamdi · TEK-UP 2025–2026 · Canadian System Technology**
Durée visée : **environ 15 minutes** (sans la démo en direct). Les temps sont indiqués par section.

> Conseils : ne lisez pas les diapositives, elles servent d'appui. Les phrases **en gras** sont les idées à retenir si vous êtes pressé. Les passages *[entre crochets]* sont des indications de mise en scène.

---

## Diapo 1 · Titre (≈ 30 s)

Monsieur le Président, mesdames et messieurs les membres du jury, bonjour.

Je vous remercie d'être présents pour évaluer mon projet de fin d'études, réalisé au sein de **Canadian System Technology**. Je remercie également mon encadrant académique, **M. Mohamed Alouani**, et mon encadrant professionnel, **M. Yousef Lamouchi**, pour leur accompagnement tout au long de ce travail.

Mon projet s'intitule **« Supervision de capteurs : conception et développement »**.

## Diapo 2 · Plan (≈ 20 s)

Ma présentation suit six parties. Je commencerai par une introduction, puis je présenterai le contexte du projet et la spécification des besoins. Ensuite, j'aborderai la planification et l'approche DevOps, puis la réalisation, avant de conclure avec les perspectives.

## Diapo 3 · Introduction (≈ 45 s)

Aujourd'hui, les capteurs connectés produisent en continu des mesures : température, humidité, concentration de gaz… Mais **une mesure seule n'a pas de valeur**. Le chiffre 31,06 que vous voyez à l'écran ne veut rien dire tant qu'on ne sait pas de quel capteur il vient, dans quelle salle il se trouve, dans quelle unité il est exprimé et s'il dépasse un seuil.

C'est exactement le problème auquel répond ce projet : **relier chaque mesure à son contexte** pour qu'un utilisateur puisse la comprendre et agir.

---

## Diapo 4 · Organisme d'accueil (≈ 40 s)

J'ai effectué mon stage chez **Canadian System Technology**, une société fondée à Montréal en 1989 et implantée en Tunisie depuis 1997. CST développe des systèmes et propose du conseil en informatique, dans les domaines de la gestion, de la mobilité et de l'infrastructure.

Elle opère à travers trois marques : **GIC**, qui édite des logiciels de gestion, **GIC-Distribution**, orientée infrastructure, et **BS4M**, spécialisée dans la mobilité, la géolocalisation et la télémétrie.

## Diapo 5 · Secteurs d'activité (≈ 20 s)

Ses activités couvrent les logiciels de gestion, le conseil, les systèmes et réseaux, et la mobilité. **Mon projet se situe à la croisée de ces domaines** : il combine du développement logiciel, de la donnée, une application mobile et une infrastructure de déploiement.

## Diapo 6 · Contexte du projet *(transition, ≈ 5 s)*

Passons maintenant au contexte du projet.

## Diapo 7 · Description du projet (≈ 40 s)

L'objectif est de concevoir **un système centralisé de supervision de capteurs** pour CST.

Il répond à deux besoins complémentaires :
- **la configuration** : l'administrateur gère les utilisateurs, les sites (sociétés, établissements, entrepôts, salles), les équipements et les sondes ;
- **la consultation** : l'utilisateur autorisé consulte les cartes, les mesures, les historiques et les alertes.

## Diapo 8 · Problématique (≈ 1 min)

Au départ, plusieurs difficultés se posaient :
- **Le contexte était fragmenté** : l'organisation, la localisation, la configuration et les données des capteurs étaient traitées séparément.
- **La hiérarchie était profonde** : société, établissement, entrepôt, salle, équipement, sonde. Ces liens doivent rester cohérents après chaque création, modification ou suppression.
- **Les valeurs brutes étaient difficiles à interpréter** : un JSON reçu sur un topic ne dit ni l'unité, ni les seuils, ni la plage normale.
- **La configuration et les mesures devaient être corrélées manuellement**.
- Enfin, **la validation et le déploiement** restaient à structurer.

La question est donc : **comment offrir une vue unique et fiable qui relie la mesure à son contexte ?**

## Diapo 9 · Valeur ajoutée (≈ 30 s)

La solution apporte trois gains :
1. une **configuration centralisée** des équipements ;
2. des **mesures reliées à leur contexte** : sonde, salle, unité, seuils ;
3. une **consultation visuelle** par cartes, jauges et alertes.

## Diapo 10 · Étude de l'existant (≈ 1 min)

Ce tableau résume l'étude de l'existant. Je précise qu'il ne s'agissait pas de partir de zéro : le backend et l'application Flutter contenaient déjà des fondations.

- Pour le **contexte**, les données étaient séparées et reliées manuellement : la réponse est **une API et un client unifiés**.
- Pour la **hiérarchie**, les affectations étaient fragiles : la réponse passe par **des entités et des validations** côté serveur.
- Pour les **mesures**, stockées par topic, leur sens devait être reconstitué : la réponse est **PostgreSQL JSONB combiné à la configuration** des types de mesure.
- Pour la **consultation**, les vues étaient dispersées : la réponse est **cartes, jauges et alertes**.
- Pour la **livraison**, une **chaîne CI/CD** est proposée.

---

## Diapo 11 · Spécification des besoins *(transition, ≈ 5 s)*

Je passe à la spécification des besoins.

## Diapo 12 · Acteurs et accès (≈ 30 s)

Le système compte deux acteurs :
- **l'administrateur**, qui configure et gère l'ensemble du système ;
- **l'utilisateur autorisé**, qui consulte la supervision.

Les deux partagent **un même mécanisme d'accès par rôle**, basé sur les **jetons JWT** et les permissions.

## Diapo 13 · Besoins fonctionnels (≈ 45 s)

Les besoins fonctionnels suivent la logique du système, du plus général au plus spécifique :
- l'**authentification**, la gestion des **utilisateurs** et des **profils** ;
- la hiérarchie physique : **sociétés, établissements, entrepôts et salles** ;
- les **équipements et les sondes**, avec les **types de mesure et leurs seuils**, puis l'**affectation des sondes** aux salles ;
- enfin, la supervision : **cartes et géolocalisation**, **mesures et historiques**, **analyses et alertes**, réunies dans un **tableau de supervision**.

## Diapo 14 · Diagramme de cas d'utilisation global (≈ 40 s)

Ce diagramme synthétise ces besoins. L'**utilisateur autorisé** peut gérer son profil, consulter la supervision et se déconnecter. L'**administrateur** hérite de ces droits et gère en plus les utilisateurs, les sociétés, les établissements, les entrepôts, les salles, les équipements et les sondes.

Tous les cas d'utilisation **incluent l'authentification** : aucune opération n'est accessible sans identité vérifiée.

## Diapo 15 · Diagramme de classes global (≈ 1 min)

Le diagramme de classes montre la structure du domaine. On retrouve la hiérarchie : **Société → Établissement → Entrepôt → Équipement (Device) → Sonde**. Chaque établissement a une **adresse** géolocalisée, et chaque sonde est rattachée à une **salle** et à un **type de mesure**.

Le **type de mesure** est la pièce centrale : il porte le libellé, l'unité et le **topic**. C'est lui qui fait le lien avec les données des capteurs, **Sensor** et **SensorInfo**, stockées dans PostgreSQL. Ce lien est une **corrélation par topic**, et non une clé étrangère, car les deux types de données vivent dans deux bases différentes.

## Diapo 16 · Besoins non fonctionnels (≈ 40 s)

Côté besoins non fonctionnels :
- **Performance** : les historiques sont bornés par une période, pour ne jamais charger un flux illimité.
- **Sécurité** : JWT, rôles, et secrets configurés par environnement.
- **Disponibilité** : des contrôles de vie et de dépendances (health checks).
- **Maintenabilité** : séparation stricte du domaine, des cas d'usage et de la persistance.
- **Fiabilité** : des références valides et, point important, **une donnée absente n'est jamais affichée comme un zéro**.

---

## Diapo 17 · Plan du projet *(transition, ≈ 5 s)*

Voyons maintenant comment le projet a été organisé.

## Diapo 18 · Méthodologie de travail (≈ 30 s)

J'ai adopté **Scrum**. Le travail a été découpé en **deux releases et quatre sprints**, avec une revue et des retours à la fin de chaque incrément. Cela m'a permis de livrer progressivement et d'ajuster les priorités avec mon encadrant.

## Diapo 19 · Planification des sprints (≈ 45 s)

- **Sprint 1** : authentification et utilisateurs, 14 jours.
- **Sprint 2** : établissements, entrepôts et salles, 18 jours : c'est le plus long, car la hiérarchie impose beaucoup de règles de cohérence.
- **Sprint 3** : équipements et sondes, 12 jours.
- **Sprint 4** : supervision, visualisation et DevOps, 14 jours.

La **Release 1** pose les fondations : l'accès et l'infrastructure physique. La **Release 2** les transforme en supervision opérationnelle. Au total, **58 jours d'effort**, du 22 janvier au 1er août 2026.

## Diapo 20 · Architecture logique (≈ 1 min)

Le backend suit la **Clean Architecture**. Au centre, les **entités** du domaine, qui ne dépendent de rien. Autour, les **cas d'usage**, puis les contrôleurs et adaptateurs, et à l'extérieur la base de données, l'interface et le web. **Les dépendances pointent toujours vers l'intérieur** : les règles métier ne dépendent ni de Flutter, ni de la base.

J'y ai ajouté le pattern **CQRS**, qui sépare les commandes, qui modifient les données, des requêtes, qui les lisent.

Pour la persistance, j'ai fait un choix délibéré de **deux bases** : **SQL Server** pour les données de gestion, très relationnelles, et **PostgreSQL avec JSONB** pour les mesures des capteurs, dont le format est plus souple. L'API reste le point d'accès unique aux deux.

## Diapo 21 · Architecture DevOps proposée (≈ 45 s)

Pour la livraison, j'ai conçu une chaîne **GitHub Actions** : intégration continue, publication d'une image Docker sur **GHCR**, déploiement en **staging**, puis **approbation manuelle** avant la production, avec une vérification de santé et la conservation de l'image précédente pour un éventuel retour arrière.

Je tiens à être transparent : **il s'agit d'une conception**. L'exécution réelle et l'acceptation en production ne sont pas établies dans le rapport.

## Diapo 22 · Pipeline CI proposé (≈ 40 s)

Le pipeline CI enchaîne : récupération du code, installation de .NET 8, restauration, compilation, tests de domaine, analyse de code, validation Docker et quality gate.

Là encore, cette vue représente la conception, pas une preuve d'exécution. **La base actuelle compte 9 tests de domaine.** Les tests d'API, de capteurs, de bases de données et Flutter restent à compléter : c'est l'une de mes perspectives.

---

## Diapo 23 · Réalisation *(transition, ≈ 5 s)*

J'arrive maintenant à la réalisation.

## Diapo 24 · Technologies (≈ 40 s)

- **Flutter** pour l'application cliente ;
- **ASP.NET Core** (.NET 8) pour l'API, avec **MediatR** pour orchestrer les commandes et requêtes CQRS, et **EF Core** pour l'accès à SQL Server ;
- **SQL Server** et **PostgreSQL** pour les deux types de données ;
- **JWT** pour la sécurité ;
- **Docker** et **GitHub Actions** pour la conteneurisation et la livraison.

## Diapo 25 · Démonstration (≈ 1 min 30, ou plus si démo en direct)

*[Montrer chaque écran de gauche à droite.]*

Voici les trois interfaces principales de supervision.

- **À gauche, le tableau d'analyse** : une vue de répartition avec les états *In Range*, *Out of Range* et *Out of Service*, et une **carte** qui situe géographiquement les établissements supervisés.
- **Au centre, les alertes en direct** : la liste des sondes en anomalie, par exemple une valeur hors plage ou un équipement hors service, avec la date et le lieu. L'utilisateur identifie immédiatement **où** intervenir.
- **À droite, la jauge en temps réel** : ici la sonde *Azot_4* affiche **31,06 mg/m³**. La jauge compare la valeur aux bornes configurées, et la barre en bas montre la plage minimale et maximale.

C'est là que tout le travail de configuration prend son sens : **la valeur n'est plus un chiffre isolé, elle a une unité, des seuils et une localisation.**

---

## Diapo 26 · Conclusion et perspectives (≈ 1 min 15)

Pour conclure, ce projet a permis de construire **une base commune qui relie la configuration des capteurs aux cartes, mesures, historiques et alertes**. La solution s'appuie sur Flutter et ASP.NET Core, avec SQL Server et PostgreSQL, dans une architecture propre et maintenable.

Je reste lucide sur les limites, et elles définissent mes perspectives :
1. **élargir les tests** : intégration API, bases de données et tests Flutter ;
2. **compléter l'ingestion des capteurs** : les topics MQTT sont modélisés, mais l'abonné qui collecte les messages reste à mettre en place ;
3. **exécuter réellement la chaîne CI/CD** jusqu'à la production ;
4. **mesurer les gains opérationnels** en conditions réelles, avec les retours des utilisateurs.

Sur le plan personnel, ce stage m'a permis de mettre en pratique l'architecture logicielle, la conception UML, le travail en Scrum et les pratiques DevOps dans un contexte d'entreprise réel.

## Diapo 27 · Merci (≈ 10 s)

Je vous remercie pour votre attention, et je suis à votre disposition pour vos questions.

*[La diapo 28 « Projet et encadrement » peut rester affichée pendant les questions.]*

---

## Préparation aux questions probables du jury

**Pourquoi deux bases de données ?**
Les données de gestion sont fortement relationnelles et exigent l'intégrité référentielle, d'où SQL Server. Les mesures des capteurs ont un format variable et arrivent en volume, d'où PostgreSQL JSONB. L'API cache cette séparation au client.

**Pourquoi Clean Architecture et CQRS ?**
Pour isoler les règles métier des détails techniques : on peut changer de base ou de client sans toucher au domaine. CQRS sépare les écritures (commandes) des lectures (requêtes), ce qui clarifie le code et convient bien à une supervision majoritairement en lecture.

**Comment les données arrivent-elles dans PostgreSQL ?**
L'ingestion est une frontière d'intégration externe. Le domaine modélise les topics MQTT, mais je n'ai pas identifié d'abonné implémenté dans le périmètre inspecté. L'API consomme les données déjà persistées. C'est ma deuxième perspective.

**Comment sécurisez-vous l'application ?**
Authentification par JWT signé en HMAC-SHA256, mots de passe dérivés avec PBKDF2/SHA-512, contrôle d'accès par rôle, et secrets configurés par environnement.

**Votre CI/CD fonctionne-t-elle ?**
Les workflows sont définis et conçus (CI, staging, production avec approbation manuelle). Je ne présente pas les captures comme une preuve d'exécution : l'acceptation en production nécessite des logs, des artefacts et des vérifications de santé réels.

**Pourquoi le sprint 2 est-il le plus long ?**
La hiérarchie société → établissement → entrepôt → salle impose beaucoup de règles de cohérence, notamment lors des modifications, des suppressions et de l'affectation des sondes aux salles.

**Comment distinguez-vous une valeur normale d'une donnée absente ?**
Si une sonde est configurée mais qu'aucune mesure n'est disponible, l'interface affiche un état vide ou indisponible, jamais un zéro. Inversement, une mesure dont la configuration est introuvable n'est pas affichée avec une unité ou un seuil inventés.
