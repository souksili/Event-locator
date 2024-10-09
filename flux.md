flowchart TD
    A[Utilisateurs] -->|Cherche des événements| B[Recherche par critères]
    B -->|Sélectionne catégorie et date| B1[Critères de recherche]
    B1 -->|Soumet recherche| B2[Résultats de recherche]
    B2 -->|Affiche| C[Liste d'événements]
    C -->|Clique sur un événement| D[Détails de l'événement]
    D -->|Affiche informations| D1[Titre, Description, Date, Lieu]
    D -->|Ajoute à| E[Calendrier personnel]
    D -->|Laisse un| F[Avis et évaluation]
    F -->|Évalue| F1[Score et Commentaire]

    %% Notifications
    D -->|S'abonne à| G[Notifications]
    G -->|Reçoit alertes pour| H[Événements correspondants]

    G[Organisateurs] -->|Accède au| I[Formulaire de soumission]
    I -->|Remplit les détails| I1[Titre, Description, Date, Lieu, Catégorie de l'événement]
    I1 -->|Soumet l'événement| I2[Événement soumis]
    I2 -->|Événement vérifié par| J[Administrateurs]
    J -->|Approuve ou rejette| J1[Statut de l'événement]
    J1 -->|Affiche sur| C

    K[Développeurs] -->|Maintiennent| L[Application Web]
    L -->|Corrige| L1[Bugs]
    L -->|Implémente| L2[Nouvelles fonctionnalités]
    L -->|Intègrent| M[API de géocodage]
    M -->|Utilise pour| N[Localisation des événements]

    O[Administrateurs] -->|Gèrent| P[Utilisateurs et Événements]
    P -->|Vérifient| P1[Comptes utilisateurs]
    P -->|Surveillent| P2[Événements soumis]
    P2 -->|Analysent| Q[Rapports de performance]
    Q -->|Fournissent des| Q1[Retours pour amélioration]