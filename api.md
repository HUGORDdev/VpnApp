**Documentation API Supabase – Backend pour Frontend (React / React Native)**  
**Version :** 1.0  
**Projet :** https://gpqctmoxphyrpsxhggyw.supabase.co  
**Auteur :** Expert Technical Writer & Senior Backend Developer  
**Date :** Mars 2026  

Tous les endpoints sont optimisés pour Supabase (PostgREST + RPC).  
Utilisez toujours la **supabase-js client** en production (plus simple pour l’authentification).  
Les exemples ci-dessous utilisent **fetch** comme demandé, mais vous pouvez les adapter en 1 ligne avec `supabase.rpc()` ou `supabase.from()`.

---

### 1. Détails d'une application (Jointures complètes)

**1. Description**  
Récupère la fiche complète d’une application avec toutes ses relations (studio, catégorie, sous-catégorie, pays, note d’âge, prix). Idéal pour la page de détail d’une app.

**2. Méthode & URL**  
`GET https://gpqctmoxphyrpsxhggyw.supabase.co/rest/v1/applications`

**3. Headers**  
```json
{
  "apikey": "VOTRE_SUPABASE_ANON_KEY",
  "Authorization": "Bearer VOTRE_JWT_TOKEN",
  "Content-Type": "application/json",
  "Prefer": "return=representation"
}
```
→ Authentification JWT **non obligatoire** (données publiques).

**4. Request**  
Query parameters (pas de body) :
- `select=id_app,app_name,logo,studios(studio_name,logo),categories(category_name),sub_categories(sub_category_name),countries(country_name),age_ratings(label),prices(is_free)`
- `id_app=eq.1`

**5. Success Response (200)**  
```json
[
  {
    "id_app": 1,
    "app_name": "KolaLearn",
    "logo": "https://storage.../kolalearn.png",
    "studios": { "studio_name": "Kola Tech", "logo": "https://..." },
    "categories": { "category_name": "Éducation" },
    "sub_categories": { "sub_category_name": "Langues" },
    "countries": { "country_name": "Sénégal" },
    "age_ratings": { "label": "Tout public" },
    "prices": { "is_free": true }
  }
]
```

**6. Error Handling**  
- 400 : Paramètres invalides  
- 401 : JWT manquant ou invalide (si RLS actif)  
- 404 : Aucune application trouvée  
- 500 : Erreur serveur

**7. Exemple d'intégration (fetch)**  
```ts
const fetchAppDetails = async (appId: number) => {
  const res = await fetch(
    `https://gpqctmoxphyrpsxhggyw.supabase.co/rest/v1/applications?select=id_app,app_name,logo,studios(studio_name,logo),categories(category_name),sub_categories(sub_category_name),countries(country_name),age_ratings(label),prices(is_free)&id_app=eq.${appId}`,
    {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${await getSessionToken()}`,
      }
    }
  );
  return res.json();
};
```

---

### 2. Liens de téléchargement d’une application

**1. Description**  
Retourne tous les liens de téléchargement (Android, iOS, etc.) d’une application via une fonction optimisée.

**2. Méthode & URL**  
`POST https://gpqctmoxphyrpsxhggyw.supabase.co/rest/v1/rpc/get_download_links`

**3. Headers**  
```json
{
  "apikey": "VOTRE_SUPABASE_ANON_KEY",
  "Authorization": "Bearer VOTRE_JWT_TOKEN",
  "Content-Type": "application/json"
}
```
→ Authentification **non obligatoire** (données publiques).

**4. Request Body**  
```json
{
  "p_app_id": 42   // number
}
```

**5. Success Response (200)**  
```json
[
  {
    "platform": "android",
    "store_url": "https://play.google.com/store/apps/afriquest",
    "app_version": "1.4.3"
  },
  {
    "platform": "ios",
    "store_url": "https://apps.apple.com/app/afriquest",
    "app_version": "1.4.3"
  }
]
```

**6. Error Handling**  
- 400 : p_app_id manquant ou invalide  
- 404 : Application non trouvée  
- 500 : Erreur serveur

**7. Exemple d'intégration**  
```ts
const getDownloadLinks = async (appId: number) => {
  const res = await fetch('https://gpqctmoxphyrpsxhggyw.supabase.co/rest/v1/rpc/get_download_links', {
    method: 'POST',
    headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
    body: JSON.stringify({ p_app_id: appId })
  });
  return res.json();
};
```

---

### 3. Recherche d’une application précise

**1. Description**  
Recherche avancée par nom, catégorie et/ou pays (utilisée dans la barre de recherche).

**2. Méthode & URL**  
`POST https://gpqctmoxphyrpsxhggyw.supabase.co/rest/v1/rpc/search_apps`

**3. Headers**  
Authentification **non obligatoire**.

**4. Request Body**  
```json
{
  "p_search": "KolaLearn",      // string | null
  "p_category_id": 5,           // number | null
  "p_country_id": 1,            // number | null
  "p_limit": 10                 // number
}
```

**5. Success Response (200)**  
```json
[
  {
    "id_app": 1,
    "app_name": "KolaLearn",
    "logo": "...",
    "country_name": "Sénégal",
    "rating": 4.8
  }
]
```

**6. Error Handling**  
- 400 : Paramètres invalides  
- 500 : Erreur serveur

**7. Exemple d'intégration**  
```ts
const searchApps = async (searchTerm: string, categoryId?: number) => {
  const res = await fetch('.../rpc/search_apps', {
    method: 'POST',
    headers: { apikey: ..., Authorization: `Bearer ${token}` },
    body: JSON.stringify({ p_search: searchTerm, p_category_id: categoryId, p_limit: 20 })
  });
  return res.json();
};
```

---

### 4. Applications du pays de l’utilisateur

**1. Description**  
Retourne les applications disponibles dans le pays de l’utilisateur connecté (priorité `home_country` pour la diaspora). Utilisé pour la section “Applications locales”.

**2. Méthode & URL**  
`POST https://gpqctmoxphyrpsxhggyw.supabase.co/rest/v1/rpc/get_apps_by_user_country`

**3. Headers**  
Authentification JWT **obligatoire**.

**4. Request Body**  
```json
{
  "p_limit": 30   // number (optionnel, défaut 30)
}
```

**5. Success Response (200)**  
```json
[
  {
    "id_app": 42,
    "app_name": "AfriQuest",
    "logo": "...",
    "rating": 4.9,
    "country_name": "Cameroun",
    "category_name": "Jeux"
  }
]
```

**6. Error Handling**  
- 401 : Utilisateur non authentifié  
- 500 : Erreur serveur

**7. Exemple d'intégration**  
```ts
const getUserCountryApps = async (limit = 30) => {
  const res = await fetch('.../rpc/get_apps_by_user_country', {
    method: 'POST',
    headers: { apikey: ..., Authorization: `Bearer ${token}` },
    body: JSON.stringify({ p_limit: limit })
  });
  return res.json();
};
```

---

### 5. Suggestions d’applications (par pays + catégorie)

**1. Description**  
Recommandations intelligentes basées sur le pays de l’utilisateur + filtre catégorie optionnel.

**2. Méthode & URL**  
`POST https://gpqctmoxphyrpsxhggyw.supabase.co/rest/v1/rpc/suggest_apps`

**3. Headers**  
Authentification JWT **obligatoire**.

**4. Request Body**  
```json
{
  "p_category_id": 5,   // number | null
  "p_limit": 15         // number
}
```

**5. Success Response (200)**  
Même structure que `get_apps_by_user_country`.

**6. Error Handling**  
- 401, 500

**7. Exemple d'intégration**  
```ts
const suggestApps = async (categoryId?: number) => {
  const res = await fetch('.../rpc/suggest_apps', { /* ... */ body: JSON.stringify({ p_category_id: categoryId, p_limit: 20 }) });
  return res.json();
};
```

---

### 6. Noter et commenter une application

**1. Description**  
Note (1-5) + commentaire. Met à jour ou crée l’avis.

**2. Méthode & URL**  
`POST https://gpqctmoxphyrpsxhggyw.supabase.co/rest/v1/rpc/rate_and_comment_app`

**3. Headers**  
Authentification JWT **obligatoire**.

**4. Request Body**  
```json
{
  "p_app_id": 42,        // number
  "p_rating": 5,         // number (1-5)
  "p_comment": "Super !" // string | null
}
```

**5. Success Response (200)**  
`{}` (void)

**6. Error Handling**  
- 400 : Note hors 1-5  
- 401 : Non connecté  
- 404 : App inexistante

**7. Exemple**  
```ts
await fetch('.../rpc/rate_and_comment_app', {
  method: 'POST',
  headers: { ... },
  body: JSON.stringify({ p_app_id: 42, p_rating: 5, p_comment: "Top !" })
});
```

---

### 7. Mettre à jour (toggle) une application en favoris

**1. Description**  
Ajoute ou retire une app des favoris (retourne `true` si ajouté).

**2. Méthode & URL**  
`POST https://gpqctmoxphyrpsxhggyw.supabase.co/rest/v1/rpc/toggle_favorite`

**3. Headers**  
JWT obligatoire.

**4. Request Body**  
```json
{ "p_app_id": 42 }
```

**5. Success Response (200)**  
```json
true   // ou false si retiré
```

**6. Error Handling**  
401, 404, 500

**7. Exemple**  
```ts
const isFavorite = await fetch('.../rpc/toggle_favorite', { method: 'POST', body: JSON.stringify({ p_app_id: 42 }) }).then(r => r.json());
```

---

### 8. Suivre un studio de création

**1. Description**  
Toggle follow/unfollow d’un studio.

**2. Méthode & URL**  
`POST https://gpqctmoxphyrpsxhggyw.supabase.co/rest/v1/rpc/toggle_follow_studio`

**3-7.** Identique à `toggle_favorite` (remplacer `p_studio_id`).

---

### 9. Voter des applications (Polls)

**1. Description**  
Vote dans un sondage (peut voter pour plusieurs apps selon `max_choices`).

**2. Méthode & URL**  
`POST https://gpqctmoxphyrpsxhggyw.supabase.co/rest/v1/rpc/vote_in_poll`

**4. Request Body**  
```json
{
  "p_poll_id": 3,
  "p_app_ids": [42, 57]   // array de number
}
```

**5. Success Response**  
`{}` (void)

---

### 10. Consulter les classements

**1. Description**  
Récupère les classements généraux ou spécifiques avec récompenses.

**2. Méthode & URL**  
`POST https://gpqctmoxphyrpsxhggyw.supabase.co/rest/v1/rpc/get_rankings`

**4. Request Body**  
```json
{ "p_ranking_id": 1 }   // null = tous les classements
```

**5. Success Response**  
```json
[
  {
    "rank": 1,
    "app_name": "AfriQuest",
    "logo": "...",
    "rating": 4.95,
    "reward_name": "Meilleure app du mois"
  }
]
```

---
