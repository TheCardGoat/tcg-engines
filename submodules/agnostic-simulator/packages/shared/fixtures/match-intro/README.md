# Match introduction

This fixture exercises the shared cinematic across two real HTML documents. It
uses the production bootstrap, presentation controller, and CSS. The board is a
placeholder: this proves the browser handoff, not a hosted match or game assets.

Run from `packages/shared`:

```sh
bun fixtures/match-intro/server.ts
```

Open `http://127.0.0.1:4198/lobby`. Optional query flags: `?slow` (delayed match
readiness), `?stalled` (no readiness signal), `?no-native` (CSS-only fallback),
`?long` (long display names), and `?variant=banners` (Alpha Clash banner style). Emulate reduced motion in browser settings.

Browser regression checks use the simulator's existing Playwright dependency.
From `apps/multi-game-simulator`, run
`pnpm exec playwright test --config playwright.match-intro.config.ts`.
This starts only the small fixture server, not platform or game services.

The original sequence presents player identities for 2.1 seconds, closes over
450ms, then navigates from a covered frame. Both app root layouts opt into
cross-document View Transitions and render the same shell. A small inline head
script restores that frame before hydration. The simulator opens it over 700ms
after its match/preparation surface commits. Skip bypasses the presentation;
reduced motion omits it. Loading remains recoverable after an eight-second hold.

Only the confirmed `match_found` event starts the sequence. The existing accept
step, game clocks, match creation, and authentication are unchanged. Rejoining,
replaying, refreshing, and back/forward navigation do not replay the intro.
Lorcana retains its existing matchmaking and dedicated simulator flow.
The destination-scoped, versioned record expires after 30 seconds and is consumed
once. It contains display labels, not tokens, decks, or gameplay state.

The browser API requires the same scheme, hostname, and port on both sides of
the reverse proxy. Different local ports take normal navigation. If the API or
storage is unavailable, navigation still works. Svelte and React consumers use
`@tcg/shared/match-intro` to avoid introducing a framework dependency across apps.

Integration points:

- Platform matchmaking calls `beginMatchIntro` after a confirmed match.
- Each root layout includes the static bootstrap, shell, and stylesheet.
- Simulator roots call `resumeMatchIntro` at hydration.
- Match/preparation and error surfaces call `finishMatchIntro` once ready.

## Reference and Docker review (2026-10-11)

The supplied 10-second recording shows opposing player banners and a central
VS emblem (0–1.5s), a bright sweep into the board (1.5–3s), character cards
settling into their positions (3–5.5s), then the opening-hand deal and mulligan
(5.5–10s). The shared intro takes the banners, emblem and light sweep from that
sequence. Each game still owns its board, card deal and opening decisions.
No reference artwork or video is shipped.

Docker review found and repaired two integration gaps that the HTML fixture
could not detect: Vite scanned a script tag embedded in the Svelte template,
and function serialization generated different bootstrap markup in the server
and client bundles. The bootstrap now has static source, with validation parity
tests, and Svelte imports the complete head markup from the shared module.

Docker sets `PUBLIC_MULTI_GAME_SIMULATOR_ORIGIN` for the web app so enabled
cinematic destinations use its shared reverse proxy. Per-game overrides still
win; separate dev-server ports retain normal navigation.

Validated with two independent signed-in browser sessions, real Gundam starter
decks, queue entry and acceptance, and a server-hosted match. Both clients
reached the board; selecting the first player produced the opening hands.
The outgoing browser reported a native View Transition and the incoming cover
was visible. A second handoff after the fixes produced no new hydration errors.
The testing queue withholds the opponent name, so the intro uses the existing
localized anonymous label until the game exposes the name.

Focused validation: 26 navigation tests, 4 bootstrap/handoff tests, and strict
shared-module TypeScript checks. Manual fixture checks covered desktop/mobile,
native navigation, slow readiness, Escape, skip and reduced motion. This review
did not rerun every automated fixture scenario, complete a full game, validate
all six hosted game flows, or deploy to staging/production.


## Alpha Clash hosted handoff (2026-10-11)

Alpha Clash now registers the existing Preview Testing queue in the platform
web app. Its match links use the shared same-origin simulator mount, and the
proxy owns `/alpha-clash/simulator` and its child paths on local hosts too.
The optional `banners` presentation navigates under cover immediately after both
accepts. The receiver supplies public contender artwork and participant display
names. No deck or artwork data is added to the stored handoff record.

The receiver holds the versus scene for 1.3 seconds, closes for 250 ms, then
reveals the board over 700 ms. Artwork decoding is bounded at 600 ms. Alpha
Clash continues that reveal into contender docking and an eight-card deal using
the server-projected board. Animation timers never submit gameplay actions.
After the deal, the normal hosted keep/mulligan controls take over. Refresh,
rejoin, skip and reduced motion do not replay the opening deal. A critical head
cover prevents a white frame while the receiving document loads its stylesheet.

Verified through the Docker proxy with two signed-in local accounts and saved,
validated Hunters/Storm decks: queue, both accepts, contender banners, full
document navigation, board reveal, opening deal, both native keep actions,
and Begin game to turn one's Resource Step. Final recorded match:
`matchqh0OG2PGmSS7bb_IezfPu`. Both public contenders are correct, and the rival
hand stays face down. Refresh returns to the existing hand without an intro.

The 24-second full recording includes the covered development-server load
before the banners (about three seconds). The 10-second reference comparison
starts our clip at 4.5 seconds, at banner entrance; neither clip is sped up.
The visible sequence is closer to the reference: illustrated versus banners,
bright reveal, contender docking, then cards dealt from the decks. It does not
copy the reference's ranked badges, illustrated environment, or audio. Both
recordings are silent, and they are not a frame-rate benchmark.

Focused validation: 9 Alpha Clash opening hook/native fixture tests, 4 shared
presentation lifecycle tests (including skip and reduced motion), 4 handoff /
bootstrap parity tests, and shared TypeScript. A 390 x 844 browser fixture with
real artwork and long names fits without clipping. Reduced-motion navigation
returns an interactive board with zero active animations and no inert content.
The simulator-wide TypeScript check still reports unrelated missing One Piece
dependencies and existing test errors; changed implementation files are clean.
No staging or production deployment was performed.

For artwork in the banner fixture, pass `playerArt` and `opponentArt` image URLs
alongside `variant=banners`. These are fixture inputs only, not handoff fields.
