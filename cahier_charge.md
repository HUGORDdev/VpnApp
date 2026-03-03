**Cahier des Charges – Plateforme Web AYE (African Youth Engagement)**  
**Version 1.0 – MVP en 5 semaines**  
**Rédigé par : Grok – Chef de Projet Digital & Architecte Full-Stack Senior**  
**Date : 03 mars 2026**  

### 1. Objectifs du projet

**Objectif général**  
Créer une plateforme web moderne, transparente et engageante qui renforce la visibilité de l’association AYE, facilite les dons et permet aux donateurs, partenaires et jeunes bénéficiaires de suivre en temps réel l’impact des projets.

**Objectifs spécifiques du MVP (5 semaines)**  
- Livrer une plateforme fonctionnelle, responsive et sécurisée en production.  
- Permettre la publication rapide de contenus (blog + projets).  
- Collecter des dons en ligne avec transparence financière immédiate.  
- Garantir une expérience utilisateur fluide pour maximiser l’engagement et les conversions.  
- Respecter un budget temps très contraint (équipe réduite : 1 Lead Full-Stack + 1 Développeur Junior + 1 Designer/UI-UX).

**Indicateurs de succès (KPI MVP)**  
- Mise en ligne avant J+35.  
- Minimum 5 articles publiés + 3 projets présentés.  
- Système de dons opérationnel (Stripe/PayPal).  
- Score Lighthouse ≥ 90 (Performance + SEO).  
- 100 % des fonctionnalités testées en recette.

### 2. Besoins fonctionnels

| Module | Fonctionnalités principales (MVP) | Priorité | Authentification requise |
|--------|-----------------------------------|----------|---------------------------|
| **Espace Blog** | - Publication d’articles (titre, contenu Markdown, image à la une, catégories)<br>- Système de commentaires (modération simple)<br>- Partage natif (Twitter/X, LinkedIn, WhatsApp, Facebook)<br>- Lecture optimisée (lecture mode + table des matières) | Haute | Non (lecture publique) / Oui (édition) |
| **Transparence Financière** | - Page “À propos” + statuts légaux<br>- Tableau de bord budgets (recettes/dépenses par projet – données statiques + mises à jour manuelles)<br>- Graphiques simples (Chart.js ou Recharts)<br>- Export PDF des rapports | Haute | Non |
| **Financement** | - Formulaire de don unique + récurrent<br>- Montants suggérés + champ libre<br>- Intégration Stripe (ou Flutterwave pour l’Afrique)<br>- Page de succès + email de remerciement<br>- Historique public des dons anonymisés | Haute | Non (don) / Oui (admin) |
| **Gestion de Projets** | - Vitrine “Nos Projets” (carte + filtre par statut : En cours / Réalisé)<br>- Fiche projet détaillée (description, impact, budget alloué, photos avant/après) | Haute | Non |
| **Administration** | - Dashboard admin unique (Next.js protected routes)<br>- CRUD articles, projets, budgets<br>- Modération commentaires<br>- Gestion des dons reçus | Moyenne | Oui (admin unique ou rôle “Board”) |

**Fonctionnalités hors MVP** (phase 2) : adhésion membres, newsletter automatisée, multi-langues (FR/EN), espace jeune bénévole.

### 3. Besoins non-fonctionnels

- **Technique** : Next.js 15 (App Router) + TypeScript + Tailwind CSS  
- **Backend** : voir section 2 ci-dessous  
- **Base de données** : Supabase (PostgreSQL + Auth + Storage) – gratuit jusqu’à 500k lignes, zéro gestion serveur  
- **Hébergement** : Vercel (frontend + API) + Supabase  
- **Performance** : Temps de chargement < 1,5 s (SSG + ISR pour blog/projets)  
- **Sécurité** : Authentification JWT + Row Level Security (Supabase), protection CSRF, rate limiting dons, HTTPS only  
- **SEO** : Meta dynamiques, sitemap.xml, Open Graph, schema.org Article/Project  
- **Accessibilité** : WCAG 2.1 AA (contrastes, alt textes, navigation clavier)  
- **Mobile-first** : 100 % responsive  
- **Maintenance** : Code propre, commentaires, documentation API (Swagger via Next.js)  
- **RGPD / Données** : Consentement cookies + politique de confidentialité (texte fourni par AYE)

### 4. Architecture Backend proposée

**Choix retenu : Full-Stack Next.js avec API Routes (App Router) + Supabase**

**Justification forte pour respecter les 5 semaines :**

| Critère | Next.js API Routes + Supabase | Express | NestJS |
|---------|-------------------------------|---------|--------|
| Temps de setup | 1 jour (même repo) | 2-3 jours | 4-5 jours |
| Courbe d’apprentissage | Nulle (même framework) | Faible | Moyenne (decorators, modules) |
| Typage partagé | Complet (TypeScript end-to-end) | Manuel | Oui mais plus lourd |
| Déploiement | 1 clic Vercel | Configuration serveur | Plus complexe |
| Scalabilité MVP | Largement suffisante | Suffisante | Overkill |
| Productivité équipe | Maximale | Bonne | Moindre |

**Pourquoi ce choix bat les alternatives**  
- Pas de repo séparé, pas de CORS, pas de communication inter-serveurs.  
- ISR + Server Actions = zéro effort pour le blog et les projets (regénération automatique).  
- Supabase gère l’authentification, la base de données et le stockage en 10 minutes.  
- Si besoin d’évolution forte plus tard → migration facile vers NestJS (même code métier).  

**Stack technique final**  
- Frontend + API : Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui  
- Base de données & Auth : Supabase  
- Paiement : Stripe (webhooks via Next.js API Route)  
- Déploiement : Vercel (preview + production)  
- Monitoring : Vercel Analytics + Supabase logs  

### 5. Planning de développement – Gantt simplifié (5 semaines)

**Équipe** : Lead Full-Stack (moi), Développeur Junior, Designer (mi-temps)

| Semaine | Phase | Tâches principales | Livrables | Responsable | Jalon |
|---------|-------|---------------------|-----------|-------------|-------|
| **S1** | Setup & Design | - Initialisation repo Next.js + Supabase<br>- Maquettes Figma (blog, projets, dons, admin)<br>- Mise en place Tailwind + shadcn/ui<br>- Configuration Stripe & Auth | Repo Git prêt + Maquettes validées | Lead + Designer | J+7 |
| **S2** | Core + Blog | - Auth admin<br>- CRUD Articles (Server Actions)<br>- Page Blog + Article dynamique (SSG + ISR)<br>- Commentaires + modération<br>- Partage réseaux | Blog 100 % fonctionnel | Lead + Junior | J+14 |
| **S3** | Projets & Transparence | - CRUD Projets<br>- Page “Nos Projets” + filtres<br>- Section Transparence Financière (tableaux + graphiques)<br>- Page À propos | Vitrine Projets + Transparence | Junior (lead) | J+21 |
| **S4** | Financement & Admin | - Intégration Stripe (Checkout + Webhooks)<br>- Page Don + récurrent<br>- Dashboard Admin complet<br>- Email de remerciement (Resend) | Dons opérationnels | Lead | J+28 |
| **S5** | Tests, SEO, Recette & Déploiement | - Tests unitaires + e2e (Playwright)<br>- SEO complet + sitemap<br>- Optimisation perf (Lighthouse)<br>- Recette avec AYE<br>- Mise en production + formation | Plateforme live + documentation | Toute l’équipe | J+35 |


### 6. chef de projets
**Maitre d'ouvrage**: African Youth Engagement
**Maitre d'oeuvre**: departement numeriques 
**Rituel hebdomadaire**  
- Lundi 9h : Sprint planning (15 min)  
- Vendredi 17h : Démo + feedback AYE  

**Risques & mitigation**  
- Délai Stripe : commencer S3 (test mode dès S1)  
- Contenu : AYE fournit textes/images dès S1  
- Changement de scope : tout ce qui n’est pas dans le tableau ci-dessus = phase 2  

Ce cahier des charges est prêt à être signé.  
Je peux dès maintenant créer le repo GitHub privé, la board Notion/Trello et lancer la phase S1 dès validation.

