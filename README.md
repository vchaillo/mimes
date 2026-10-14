# MimXpression

Static expression game deployed on GitHub Pages. The original yellow and slate design is retained.

## Firebase setup

1. Create a Firebase web app and a Cloud Firestore database in production mode.
2. Enable Google in Authentication > Sign-in method.
3. Add `vchaillo.github.io` to Authentication > Settings > Authorized domains.
4. Paste the web app configuration into `assets/js/firebase-config.js`, replacing `null` with the configuration object.
5. Publish the contents of `firestore.rules` in Firestore > Rules. Public visitors can only read visible expressions. Google authentication alone does not grant editing rights.
6. Sign in on the site once. Copy the account UID from Authentication > Users. In Firestore create `editors/{UID}` with a boolean field `enabled: true`. Create this document only from the console; clients cannot grant themselves access. The existence of the document authorizes the account. Reload the site.
7. Open the expression list and click the import button. This imports the 34 original expressions with stable IDs. Repeated imports never overwrite existing documents. Importing again after deleting an original restores that expression.

Expressions are shared across visitors, not scoped to individual accounts. Authorized editors can add, edit, delete, and hide expressions. Hidden expressions are excluded from public queries and random selection. All expression text is rendered using DOM text nodes.

Until configuration is supplied, the existing 34 expressions remain available in an explicitly labeled preview mode. Once configured, Firestore is the only expression source; errors never silently fall back to the original list. No expression data is saved to localStorage.

## Repository rename

Rename the repository in GitHub Settings > General to `mim-xpression`. All asset URLs are relative, so no base-path update is required. GitHub Pages should then serve `https://vchaillo.github.io/mim-xpression/`. Verify Pages deployment after renaming and update external links. The old Pages URL should not be relied on as a redirect.

## Checks

`node --test tests/expressions.test.cjs` checks random selection and safe text rendering, including empty and single-expression datasets.

Firebase sign-in, rules, import, and write operations require the actual configured Firebase project for end-to-end verification.
