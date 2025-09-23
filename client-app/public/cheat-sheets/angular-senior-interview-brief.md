# Cheat sheet — Senior Angular Interview

## Core Angular — Components, Modules, DI, Lifecycle

**What is an Angular module (NgModule) and why use it?**

NgModule groups related declarations, providers, and imports/exports to control compilation and DI scope.
Note: Angular 17+ defaults to standalone components, reducing NgModule usage. Still needed for lazy-loaded routes and legacy apps.

**Component vs Directive vs Pipe — when to use each?**

Component: UI with template and lifecycle. Directive: behavior/DOM manipulation without template (structural or attribute). Pipe: pure/impure data transformation for templates.
Modern: Use standalone components with imports array instead of NgModule declarations.

**Explain Angular's dependency injection hierarchy.**
Injectors form a tree mirroring the component tree; providers can be at root, platform, module, component, or view level. Resolution walks from requesting injector up to ancestors.
Modern: Use inject() function and DestroyRef for cleaner DI patterns.

**How to provide a service only to a lazy-loaded module?**
Provide it in the lazy module's providers or use providedIn: 'any' for module-specific instances.
Standalone: Use route-level providers in routing configuration.

**Key component lifecycle hooks and typical uses?**
ngOnInit: init logic; ngOnChanges: respond to input changes; ngDoCheck: custom change detection; ngAfterViewInit/ngAfterContentInit: DOM/content access; ngOnDestroy: cleanup.
Modern: Consider DestroyRef and takeUntilDestroyed() for cleaner cleanup.

## Modern Angular Features (16-18+)

**What are Signals and when to use them?**
Signals are Angular's new reactive primitive for fine-grained change detection. Use for component state, computed values, and when you need granular reactivity without RxJS overhead.

```typescript
export class Component {
  count = signal(0)
  doubled = computed(() => this.count() * 2)

  increment() {
    this.count.update((n) => n + 1)
  }
}
```

**What are defer blocks and their benefits?**
Defer blocks enable template-level lazy loading with triggers like viewport, interaction, or timer. Improves initial load performance.

```html
@defer (on viewport) {
<heavy-component />
} @placeholder {
<div>Loading...</div>
}
```

**New control flow syntax vs structural directives?**
Angular 17+ introduces `@if`, `@for`, `@switch` as built-in control flow, replacing `*ngIf`, `*ngFor`. Better performance, type safety, and developer experience.

```html
<!-- New syntax -->
@if (user) {
<p>Welcome {{user.name}}</p>
} @else {
<p>Please log in</p>
} @for (item of items; track item.id) {
<div>{{item.name}}</div>
}
```

## Change Detection & Zone.js

**How does Angular's change detection work (default)?**
Zone.js patches async APIs to trigger change detection; Angular walks component tree and checks bindings.
Modern: Signals enable fine-grained updates without full tree traversal.

**OnPush strategy — what changes and why use it?**
OnPush runs detection only when @Input reference changes, events originate from component, observables emit via async pipe, or manual `ChangeDetectorRef.markForCheck()`. Use with immutable data and signals for optimal performance.

**What is zone.js and when might you avoid it?**
Zone.js monkey-patches async APIs for change detection. Avoid for high-performance apps using manual detection or **experimental zone-less mode** (Angular 18+) with signals and `provideExperimentalZonelessChangeDetection()`.

##RxJS & Reactive Patterns

**Observable vs Promise vs Signal — when to use each?**
Observables: streams, cancellation, operators, complex async flows. Promises: single async operations. Signals: synchronous reactive state, fine-grained updates, simpler than RxJS for component state.

**Subject types and use cases?**
Subject: multicast, no initial value. BehaviorSubject: holds current value. ReplaySubject: replays N values. AsyncSubject: emits final value on completion.
Modern: Consider signals for simpler state management.

**Essential RxJS operators for 2025?**
Creation: `of`, `from`, `fromEvent`. Transformation: `map`, `switchMap`, `mergeMap`, `concatMap`. Filtering: `filter`, `take`, `takeUntilDestroyed`. Combination: `combineLatest`, `forkJoin`. Utility: `tap`, `shareReplay`, `debounceTime`.

**Modern memory leak prevention?**
Use `takeUntilDestroyed()` with `DestroyRef`, async pipe, or `Subscription.add()`.
Best: Prefer signals for component state to avoid subscription management.

```typescript
export class Component {
  private destroyRef = inject(DestroyRef)

  ngOnInit() {
    this.service.data$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => this.handleData(data))
  }
}
```

## State Management

**When to use NgRx vs alternatives in 2025?**
NgRx: complex shared state, time-travel debugging, large teams.
Alternatives: Signal Store (lightweight), Akita, or simple services with signals. Consider bundle size and team complexity.

**Modern NgRx patterns (15+)?**
Use functional effects, signal integration, and standalone APIs:

```typescript
const loadUsers = createEffect(
  () =>
    inject(Actions).pipe(
      ofType(UserActions.loadUsers),
      switchMap(() => inject(UserService).getUsers()),
    ),
  { functional: true },
)
```

**Signal Store vs NgRx?**
Signal Store: lighter, better DX, signals-based. NgRx: mature ecosystem, DevTools, complex state management. Choose based on app complexity and team needs.

## Angular Material / CDK / accessibility

**How to ensure accessible Angular Material usage?**
Use ARIA attributes, semantic HTML, keyboard navigation, focus management (FocusTrap), and test with screen readers. Material components are accessible by default but need correct usage.

**When to use CDK vs Material?**
CDK provides building blocks (overlay, drag-drop, accessibility) for custom UI; Material provides ready-made components styled per Material guidelines.

## Testing (Modern Approaches)

**Testing strategy: Unit vs Integration vs E2E?**
Unit: component logic, services, pipes in isolation. Integration: feature modules, component interaction. E2E: user journeys with Cypress/Playwright (Protractor is deprecated).

**Testing Observables and async code?**
Use waitForAsync (not deprecated async), fakeAsync + tick, marble testing with TestScheduler. For signals, test synchronously or with TestBed.flushEffects().

**Modern E2E testing stack?**
Primary: Cypress (developer-friendly), Playwright (cross-browser).
Avoid: Protractor (removed). Focus on stable selectors, page objects, and deterministic tests.

## Performance & bundling

AOT vs JIT in 2025?
AOT is default since Angular 9; View Engine removed in Angular 13. JIT requires explicit opt-in and is rarely used.
Focus: Ivy renderer optimizations and partial compilation.

**Bundle optimization strategies?**
Standalone components, lazy loading with loadChildren, defer blocks, tree-shaking with proper imports, differential loading, source-map-explorer for analysis.
New: Route-level code splitting with standalone components.

**Runtime performance best practices?**
OnPush + signals, trackBy functions, virtual scrolling (CDK), defer blocks for heavy components, NgOptimizedImage directive, avoid heavy computations in templates.

## Modern Architecture & Patterns

**Functional vs Class-based patterns?**
Modern approach: Functional guards, interceptors, and effects. Standalone components with inject(). Class-based still valid but functional is preferred for new development.

```typescript
// Functional guard
export const authGuard: CanActivateFn = () => {
  return inject(AuthService).isAuthenticated()
}

// Functional interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token()
  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  )
}
```

**Enterprise Angular app structure (2025)?**

```text
src/
├── app/
│   ├── core/           # Singleton services, guards, interceptors
│   ├── shared/         # Reusable components, pipes, directives
│   ├── features/       # Feature modules (lazy-loaded)
│   │   └── user/
│   │       ├── components/
│   │       ├── services/
│   │       └── user.routes.ts
│   ├── layout/         # Shell components
│   └── app.routes.ts   # Main routing
```

**Micro-frontend considerations?**
Module Federation with Webpack, standalone components for better isolation, shared dependencies management, consistent design systems. Consider single-spa or Angular Elements for legacy integration.

**How to evaluate trade-offs when choosing libraries or patterns?**
Consider team familiarity, maintenance, performance, bundle impact, long-term support, testability, and integration complexity. Prototype critical paths before committing.

## Security & Forms

**XSS prevention strategies?**
Angular auto-escapes interpolations; avoid bypassSecurityTrust\* unless necessary. Use CSP headers, validate server-side, sanitize with DomSanitizer.
New: Trusted Types support in modern browsers.

**Reactive vs Template-driven forms?**
Reactive: Complex forms, better testing, type safety (Angular 14+ typed forms). Template-driven: Simple forms, rapid prototyping.
Modern: Strongly typed reactive forms with FormBuilder.

```typescript
interface UserForm {
  name: FormControl<string>
  email: FormControl<string>
}

this.userForm = this.fb.group<UserForm>({
  name: this.fb.control('', { nonNullable: true }),
  email: this.fb.control('', { nonNullable: true }),
})
```

## HTTP & Interceptors

**How to use HTTP interceptors and common use cases?**
Interceptors implement HttpInterceptor to modify requests/responses globally — use for auth tokens, logging, error handling, caching, and retry logic.

**Modern HTTP patterns?**
Functional interceptors (Angular 15+), provideHttpClient() with interceptors array, better type safety, and error handling with retry strategies.

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, loggingInterceptor])),
  ],
}
```

## SSR & Hydration

**Angular Universal improvements?**
Angular 16+ introduced non-destructive hydration, better performance, and hydration debugging. Angular 17+ has improved SSR with better streaming and partial hydration support.

**Hydration best practices?**
Use provideClientHydration(), avoid DOM manipulation before hydration, use afterNextRender() for client-only code, implement proper loading states.
