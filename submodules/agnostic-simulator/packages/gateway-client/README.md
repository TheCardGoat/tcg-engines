# @tcg/gateway-client

Framework-neutral WebSocket gateway client shared by the platform web app
(SvelteKit) and the game simulator (React Router). It owns the **transport
lifecycle**: the wire contract, single-use ticket clearing, ref-counted
per-namespace sockets, auth-state transitions, a credential-refresh loop that
recovers from auth failures, and an optional latency ping loop. It is consumed
as raw TypeScript source (no build step), exactly like `@tcg/protocol`.

With the transport lifecycle absorbed into the library, a consumer's job shrinks
to three steps: install a credentials controller, acquire a handle, and wire
game events.

## Purpose

Before this package, the platform web app (`apps/web`) and the simulator
runtime (`@tcg/simulator-runtime`) each shipped their own Socket.IO gateway
client with subtly different lifecycle wiring — most visibly, the web client
cleared the single-use ticket on the `connect` event while the simulator
cleared it inside the `auth` callback. `@tcg/gateway-client` unifies that
lifecycle into one framework-neutral library so both apps share identical wire
behavior, ticket handling, and reconnect semantics.

The library is intentionally narrow. It does **not**:

- import or expose Better Auth types,
- call any HTTP endpoint,
- resolve environment variables or gateway origins,
- acquire tickets or JWTs (the fetch itself stays the app's job — but the
  library **does** orchestrate a refresh by calling the installed credentials
  controller when the gateway rejects an authed socket),
- emit any game event (`join_game`, moves, heartbeats, …) on its own.

All of the above stay the app's responsibility. The library is fed ticket +
token through a small **credentials seam**, and it owns the refresh/reconnect
loop that consumes that seam on auth failure.

## The auth model

Three credentials cooperate, with different roles and lifetimes. The library
owns only the boxed one.

| Credential                 | Lifetime                | Transport                                                             | Owned by                                       |
| -------------------------- | ----------------------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| **Session token** (opaque) | Long-lived              | Better Auth session cookie (sent automatically via `withCredentials`) | The app's auth layer                           |
| **JWT**                    | ~30 min                 | `auth.token` in the handshake                                         | App fetches; gateway verifies via JWKS         |
| **Ticket**                 | ~30 seconds, single-use | `auth.ticket` in the handshake                                        | **The library consumes it once per handshake** |

- The **session token** is the long-lived opaque cookie owned entirely by the
  app's Better Auth layer. This library never reads it; the browser attaches it
  to the WebSocket handshake automatically because the socket is opened with
  `withCredentials: true`.
- The **JWT** is a short-lived, stateless reconnect proof. The app fetches it
  (typically alongside the ticket from the gateway ticket endpoint) and pushes
  it into the library. Because it is stateless, the gateway can verify it via
  JWKS on every reconnect without server-side session state.
- The **ticket** is a single-use nonce that bridges the HTTP world (where the
  app proved who it is) to the WebSocket world. The app obtains one ticket per
  new socket and pushes it in. **The library embeds the ticket in the first
  handshake `auth` object and then clears it from its internal snapshot**, so a
  reconnect never replays a consumed ticket. Subsequent reconnects fall back to
  the JWT / opaque token the app continues to supply.

## The wire contract

Socket.IO v4 over WebSocket-only, identical to both existing clients:

```ts
io(`${gatewayOrigin}/${slug}`, {
  path: "/socket.io/",
  transports: ["websocket"],
  parser: msgpackParser,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Number.POSITIVE_INFINITY,
  reconnectionDelay: 1_000,
  reconnectionDelayMax: 30_000,
  withCredentials: true,
  auth: (cb) => cb({ ticket?, token?, requireAuth? }),
});
```

- **Namespace** is per game: `${gatewayOrigin}/${slug}` (e.g.
  `wss://gateway.tcg.online/lorcana`).
- **Parser** is `socket.io-msgpack-parser`.
- **Path** is `/socket.io/`.
- **`withCredentials: true`** so the browser sends the Better Auth session
  cookie on cross-origin handshakes (web on `tcg.online`, gateway on
  `gateway.tcg.online`).
- **Credentials are sent in the handshake `auth` object** as
  `{ ticket?, token?, requireAuth? }` — never as query params or headers. The
  `auth` callback is the _function_ form so values are re-read on every
  reconnect and the single-use ticket is consumed there.
- **`autoConnect: false`** — the manager drives `connect()` after the
  `requireAuth` gate passes.

## Reconnect behavior

Reconnection is unbounded (`reconnectionAttempts: Infinity`) with a 1 s initial
backoff capped at 30 s. The library treats each (re)connect attempt identically:

1. It reads the current credentials (from the installed credentials
   controller's `get()` and/or the pushed snapshot).
2. It builds the `auth` payload, embedding `ticket` only if one is still
   available.
3. It **consumes the ticket** by clearing it from the snapshot and marking it
   used — so the _first_ handshake uses the ticket, and _every_ subsequent
   handshake relies on the JWT / opaque token.

The library does not perform the ticket/JWT fetch itself — that is the
credentials controller's job. When a refresh is warranted (see
[Credential refresh on auth failure](#credential-refresh-on-auth-failure)), the
library calls the controller and re-dials on the same socket once fresh
credentials arrive. If the controller cannot restore access, the socket
transitions to terminal `disconnected` rather than looping.

### Forcing a reconnect (e.g. after a fresh ticket)

Automatic reconnection covers transport drops. To force a fresh handshake on
demand — typically because the app just obtained a new single-use ticket and
wants it consumed on the live socket — call `handle.reconnect()`:

```ts
manager.setCredentials("lorcana", { ticket: freshTicket, token: jwt });
socket.reconnect();
```

`reconnect()` disconnects the socket if it is currently live, then re-runs the
connect gate and dials. The **same Socket.IO instance is reused** (no new
`io()`), so the next handshake re-reads credentials via the `auth` callback and
consumes the ticket just pushed through `setCredentials` (which resets the
consumed-ticket guard). This is distinct from `release()` + `acquire()`, which
tears the socket down and builds a brand-new one — `reconnect()` is the right
tool for credential-refresh on an existing connection.

The `requireAuth` gate mirrors the web app's `connect()` guard: if the snapshot
says `requireAuth: true` but there is neither a ticket nor a token available,
the library refuses to dial and emits the analytics event
`ws_auth_policy_violation` (with `{ namespace, reason: "missing_credentials" }`)
through the injected `onAnalytics` sink — it never queues an anonymous socket
into a matchmaking flow that requires auth.

## One socket per namespace

The manager is ref-counted by slug. `acquire(slug)` the first time creates one
socket and connects it; `acquire(slug)` again returns a **new handle on the same
socket** and merely bumps the ref-count. Each handle scopes its own listeners;
`release()` removes only that handle's listeners and decrements the ref-count.
When the ref-count reaches zero, the socket is disconnected and torn down.

## Usage

```ts
import { createGatewayConnectionManager } from "@tcg/gateway-client";

const manager = createGatewayConnectionManager({
  // The app resolves the origin from its own env — the library never does.
  gatewayOrigin: "wss://gateway.tcg.online",
  // Optional analytics sink (e.g. the web app's trackEvent). Plain function,
  // never imported by the library.
  onAnalytics: (event, payload) => trackEvent(event, payload),
  // Optional library-owned latency ping loop. When omitted, no ping loop runs.
  ping: { intervalMs: 30_000 },
});

// 1. Push the freshly-fetched single-use ticket + JWT for this namespace.
//    The library will consume the ticket on the first handshake.
manager.setCredentials("lorcana", { ticket, token: jwt, requireAuth: signedIn });

// 2. Acquire a handle. The library dials immediately (subject to the
//    requireAuth gate).
const socket = manager.acquire("lorcana");

// 3. React to lifecycle. The CONSUMER owns join/idempotency logic — the
//    library never emits join_game on its own.
socket.onConnected(() => {
  socket.emit("join_game", { gameId, role: "player", gameProfileId, userId });
});

socket.onWelcome((welcome) => {
  // welcome.authenticated, welcome.authMethod, welcome.connectionId
});

// 4. Subscribe to typed server→client events.
const off = socket.on("game_joined", (payload) => render(payload));
const offAny = socket.onAny((event, payload) => dispatcher.dispatch(event, payload));

// 5. State + teardown.
const unsub = socket.subscribeState((state) => updateStatusBadge(state));
// …later
off();
offAny();
unsub();
socket.release(); // removes this handle's listeners; tears down the socket on last release.
```

A credentials controller is also supported as a per-acquire seam: `get()` is
re-read on every handshake (useful for JWT rotation) and `refresh()` is called
by the library on auth failure (see
[Credential refresh on auth failure](#credential-refresh-on-auth-failure)):

```ts
const socket = manager.acquire("lorcana", {
  credentials: {
    get: () => ({ token: currentJwt(), requireAuth: isSignedIn() }),
    refresh: async () => {
      const { ticket, token } = await fetchGatewayTicket();
      return { ticket, token, requireAuth: isSignedIn() };
    },
  },
});
```

For multi-consumer scenarios on the same namespace, prefer
`manager.setCredentials(slug, …)` as the single source of truth — the first
`acquire()` establishes the socket's credentials lifecycle, and a later
`acquire()` that supplies a **different** controller object throws (a namespace
owns a single credentials lifecycle).

## Credential refresh on auth failure

When a namespace requires auth (`requireAuth: true`) and the gateway sends a
`welcome` with `authenticated: false` (or the `requireAuth` connect gate
blocks because no live credentials are available), the library gives the
installed credentials controller **one** chance to recover, then re-dials:

1. It calls `controller.refresh()` and merges the returned snapshot (a fresh
   single-use ticket re-arms the ticket guard so it is consumed on the next
   handshake).
2. It disconnects the live socket (if any) and re-runs the connect gate on the
   **same** Socket.IO instance — no new `io()`.
3. If the refreshed welcome comes back authenticated, the one-shot is reset and
   the library emits `ws_auth_recovered`.

The budget is a single attempt per auth failure. A **second** unauthenticated
`welcome` with `requireAuth` (after a refresh already ran) does **not** refresh
again — the socket transitions to terminal `disconnected` with
`authStatus: "failed"` and emits `ws_auth_terminal_failure`
`{ namespace, reason: "refresh_exhausted" }`. The one-shot is reset only by a
subsequent authenticated `welcome`, so a future auth failure can refresh again.
If `controller.refresh()` itself rejects, the socket goes terminal with
`error: "Credential refresh failed."` and emits `ws_credentials_refresh_failed`.

The current phase of the refresh loop is observable on the state shape via
`authStatus: "ok" | "refreshing" | "failed"`. Relevant analytics events:
`ws_credentials_refresh_attempt`, `ws_credentials_refreshed`,
`ws_credentials_refresh_failed`, `ws_auth_recovered`, `ws_auth_terminal_failure`.

## Latency probing

When `ping: { intervalMs }` is supplied to the manager, the library owns a
`setInterval`-driven ping loop (a single cadence applied to every namespace).
Each tick emits a typed `ping` event with `{ t: Date.now() }` — but only while
the socket is live. The server's `pong` (payload `{ serverTime, t }`) is mapped
to a round-trip latency: `latencyMs = Date.now() - pong.t`, which is written to
state, surfaced to any `handle.onLatency(cb)` subscribers, and emitted as the
`ws_latency_sample` analytics event `{ namespace, latencyMs }`.

When `ping` is omitted, no ping loop runs and `latencyMs` stays `null`. The
ping timer and the `pong` listener are cleaned up on `release()` / teardown.

## State shape

`GatewayConnectionState` (returned by `getState` / `subscribeState`) is:

| Field              | Type                                                              | Notes                                                               |
| ------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------- |
| `status`           | `idle \| connecting \| connected \| disconnected \| reconnecting` | Connection status.                                                  |
| `authenticated`    | `boolean`                                                         | From the latest `welcome`.                                          |
| `authMethod`       | `AuthMethod \| null`                                              | `ticket \| jwt \| session \| authenticated \| anonymous`.           |
| `connectionId`     | `string \| null`                                                  | Server-assigned connection id.                                      |
| `latencyMs`        | `number \| null`                                                  | Latest round-trip sample from the ping loop; `null` until a `pong`. |
| `reconnectAttempt` | `number`                                                          | Socket.IO manager reconnect counter.                                |
| `error`            | `string \| null`                                                  | Last error string.                                                  |
| `authStatus`       | `"ok" \| "refreshing" \| "failed"`                                | Phase of the library-owned credential-refresh loop (observability). |

## Non-goals / non-exposure

This library deliberately does **not**:

- import or expose Better Auth types (`Session`, `User`, …);
- call any HTTP endpoint itself — no ticket fetch, no JWKS fetch, no session
  refresh. (It _orchestrates_ a refresh by calling the installed credentials
  controller; the controller performs whatever fetch it needs.);
- read environment variables or resolve gateway origins — the app passes a
  resolved `gatewayOrigin`;
- acquire/issue tickets or JWTs — the controller supplies them via `get()` /
  `refresh()`;
- emit any game event (`join_game`, `execute_move`, `heartbeat`, …) — consumers
  do that from `onConnected` / `onWelcome`;
- decide analytics sampling policy — it emits raw events (`ws_*`) through the
  injected `onAnalytics` sink and lets the app sample/filter.

The transport lifecycle — wire contract, ticket clearing, reconnects, the
credential-refresh-on-auth-failure loop, and the optional latency ping loop —
is owned by this library.

If any of those concerns need to cross the platform/simulator boundary, they
belong in a different seam, not here.
