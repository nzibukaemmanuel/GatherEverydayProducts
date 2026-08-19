# Gather — E-commerce UI (Angular)

Angular 17 standalone-component implementation of the homepage, sign up / register, and forgot-password design.

## Run it

```bash
npm install
npm start
```

Then open http://localhost:4200.

## Structure

```
src/app/
  core/                     AuthModalService (open/close + tab state) and shared validators
  models/                   Product / Category interfaces
  data/                     Catalog data (swap for a real API call)
  components/
    icon/                   Shared inline-SVG icon library, used by every other component
    header/                 Sticky nav, search, account/cart icons, Sign up button
    hero/                   Homepage hero + product-tag collage
    categories/             Category tile row
    product-grid/           Featured products grid ("New arrivals")
    promo-banner/           Free-shipping "ticket" banner
    newsletter/             Email signup strip (reactive form)
    footer/                 Footer links + payment icons
    auth-modal/             Login / Create account tabs + full forgot-password flow (steps 1–5)
```

Every component has its **own external `.css` file** (Angular view-encapsulated, so styles don't leak between components). Shared design tokens, resets, buttons, and icon-tint utility classes live in `src/styles.css` since they're reused across multiple components.

## Notable implementation details

- **`AuthModalService`** (`core/auth-modal.service.ts`) is a small RxJS-backed service so any component (currently just the header) can open the login or signup tab without prop-drilling. `AuthModalComponent` subscribes to it.
- **Reactive Forms** (`@angular/forms`) drive validation for login, signup, the forgot-password email step, and the reset-password step. A custom cross-field validator (`core/password-match.validator.ts`) checks password/confirm-password pairs and attaches a `passwordsMismatch` error to the confirm control.
- **Forgot password** is a single component with a numeric `forgotStep` (1–5): request → check inbox → set new password → success → expired-link error state. Steps 2 and 3 include a "prototype note" link so a reviewer can jump ahead without a real email.
- Everything used in more than one place (buttons, icons) is a shared component/utility class — there's no duplicated markup between the header's Sign Up button and the modal's Create Account button, for example.

## Wiring up a real backend

Currently `onLoginSubmit`, `onSignupSubmit`, `onForgotEmailSubmit`, and `onResetSubmit` (all in `auth-modal.component.ts`) simulate success with a `setTimeout` + `alert`. Swap those for calls into an injected `AuthService` that wraps `HttpClient`, and surface real server errors through the existing `err-msg` / `has-error` styling already in place.
