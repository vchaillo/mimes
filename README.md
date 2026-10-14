# MimXpression

A static expression game with Google sign-in and personal Firestore lists.

- Guests play with the 34 default expressions bundled with the app.
- On first Google sign-in, those defaults are copied automatically into `users/{uid}/expressions`.
- Each account can add, edit, hide, or delete its own expressions. Hidden expressions are excluded from that account's games.
- Initialization runs atomically once. Deleted defaults stay deleted across sign-ins, even after deleting the entire list.
- Sign-out restores the guest defaults and clears the previous account's displayed expression and game.
- There are no editor roles, manual imports, public cloud lists, or expression data in localStorage.

## Firebase setup

The Firebase web app configuration is already included.

1. Create Cloud Firestore and enable Google in Authentication > Sign-in method.
2. Add `vchaillo.github.io` to Authentication > Settings > Authorized domains.
3. Replace Firestore > Rules with the contents of `firestore.rules` and publish.
4. Sign in. Your personal default list is created automatically.

The rules permit each authenticated user to read and write only their own `users/{uid}` tree. All other paths are denied, including the previous shared `expressions` and `editors` collections. Existing shared records are not deleted or used by this version.

## GitHub Pages

Repository: `vchaillo/mim-xpression`.
Site: https://vchaillo.github.io/mim-xpression/

The original yellow/slate identity, menu animation, and theme toggle are retained. New-game setup supports point targets, adding/removing players, score attribution, skipping an expression, and restarting after a win.

## Verification

Run `node --test tests/*.test.cjs`.
Firebase sign-in, security rule deployment, and live writes also require verification against the configured project after the rules are published.
