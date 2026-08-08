# Méthodologie de travail — Portfolio-2026

## Contexte

Portfolio créatif en HTML/CSS/JS vanilla (zéro framework), animé avec GSAP. Architecture BEM, CSS modulaire (reset/base/layout/animations), fichiers JS séparés par fonctionnalité.

## Règles strictes — à respecter absolument, pour toute session de debug ou d'optimisation

1. **Ne rien casser.** Tout ce qui fonctionne aujourd'hui doit continuer à fonctionner à l'identique après chaque modification. Aucune régression visuelle ou fonctionnelle tolérée.
2. **Une seule chose à la fois.** Un bug OU une optimisation par itération. Jamais plusieurs changements mélangés dans la même proposition.
3. **Diagnostic avant action.** Avant de toucher au code, explique :
   - quel est le problème exact,
   - où il se situe (fichier + zone de code),
   - pourquoi il se produit,
   - ce qui est proposé comme changement, et pourquoi c'est sûr.
4. **Attendre une validation explicite** avant d'appliquer chaque modification. Ne jamais passer à l'étape suivante sans un "ok" explicite.
5. **Priorité à la simplicité.** Si un bloc peut être rendu plus court/plus lisible sans changer son comportement, le proposer — mais seulement si le gain est réel (lisibilité, poids, performance), pas juste pour faire différent.
6. **Pas de refactor invisible.** Ne pas introduire de nouvelle dépendance, pattern, ou changement d'architecture sans le signaler clairement et demander un accord.
7. **Ne jamais commit sans confirmation explicite.** Après avoir appliqué une modification, il faut s'arrêter et attendre que je teste moi-même le site et confirme que ça fonctionne bien. Le commit (message clair `fix:`/`perf:`/`refactor:`) n'a lieu qu'après mon "ok, ça marche" — jamais automatiquement juste après l'application du code.
8. **En cas de doute** sur l'impact d'un changement, le dire plutôt que de trancher seul.
9. **Commentaires propres et utiles.** Chaque modification de code doit être commentée comme le ferait un ingénieur senior dans une vraie startup — clair, structuré, utile pour comprendre *pourquoi* (pas juste *quoi*), sans excès. Pas de commentaire pour chaque ligne triviale, mais un commentaire là où la logique n'est pas évidente à la relecture (edge case géré, choix technique non intuitif, dépendance entre deux parties du code). Cette règle s'applique à toute nouvelle modification, pas seulement lors d'une relecture dédiée.

## Objectif permanent

Un code :
- **léger** (poids, requêtes, complexité réduits au strict nécessaire),
- **solide** (pas de bugs, pas de edge cases oubliés),
- **concis et lisible** (facile à reprendre dans 6 mois),
- **scalable** (facile d'ajouter une feature sans tout casser),
- au service d'une **expérience premium et fluide** pour l'utilisateur final.

## Déroulé par défaut pour tout cycle de debug/optimisation

1. **Audit** — analyser les fichiers concernés, lister les problèmes (bug critique / bug mineur / optimisation possible), sans rien modifier.
2. **Priorisation** — proposer un ordre de traitement (bugs bloquants → optimisations sans risque → optimisations profondes), validation avant de commencer.
3. **Exécution point par point** — pour chaque point validé : diagnostic → proposition → accord → application → **j'effectue moi-même le test sur le site** → je confirme que ça fonctionne → commit. Un point fermé avant de passer au suivant.
4. **Bilan** — une fois les points traités, résumer ce qui a été corrigé/optimisé et l'impact (poids, perf, lisibilité).
