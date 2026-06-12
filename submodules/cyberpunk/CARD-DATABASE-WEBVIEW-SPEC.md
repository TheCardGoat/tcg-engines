# Cyberpunk Card Database Webview Integration Specification

## Summary

This specification defines how a Cyberpunk card database or deck browser can launch the simulator in a browser webview so players can play directly from a selected deck. The first integration target is local practice against an AI opponent, using the simulator's browser runtime and the engine's real setup flow.

The card database owns card browsing, deck editing, and player entry points. The simulator owns deck validation, game-state creation, rules enforcement, AI decisions, and board rendering.

## Goals

- Let a player click "Play" from a deck detail page in the card database and open an embedded simulator webview.
- Pass a complete player deck into the simulator without requiring a backend match record.
- Validate the incoming deck with the same Cyberpunk rules used by the simulator.
- Start a fresh practice match against a selected or default bot deck and strategy.
- Support host-webview communication for ready, error, match-started, and match-ended events.

## Non-Goals For V1

- Ranked matchmaking.
- Persisted server replays.
- Account-linked deck vault sync.
- Cross-device reconnect.
- Human-vs-human transport.
- Card database mutation from the simulator.

## Rule Constraints

The simulator must validate imported decks against the current alpha deckbuilding rules:

- Exactly 3 Legends.
- The 3 Legends must have unique names.
- 40 to 50 non-Legend cards in the main deck.
- At most 3 copies of the same card in the main deck.
- Main-deck card RAM must be covered by the color-specific RAM total from the chosen Legends.

Match setup must use the simulator engine's canonical setup:

- Legends start face-down in random order.
- Main decks are shuffled.
- Each player gets all Gig Dice in the fixer area.
- First player is chosen randomly.
- First player starts with 2 spent Legends.
- Each player draws a 6-card opening hand.
- Mulligan and manual `gainGig` choices remain player-facing.

## Integration Modes

### V1: URL Payload Bootstrap

The card database opens:

```text
https://<simulator-origin>/play/practice?source=card-db
```

The deck payload is delivered with `postMessage` after the iframe or webview loads. This avoids URL length limits and keeps full deck contents out of browser history.

### V1 Fallback: Encoded URL

For environments that cannot use `postMessage`, the card database may open:

```text
https://<simulator-origin>/play/practice?source=card-db&payload=<base64url-json>
```

The simulator should prefer `postMessage` when available. The URL payload is intended only for small deck payloads and debugging.

## Deck Payload Contract

The card database sends a `cyberpunk.deck.import.v1` message to the simulator window.

```typescript
interface CyberpunkDeckImportMessage {
  type: "cyberpunk.deck.import.v1";
  requestId: string;
  payload: CyberpunkDeckPayload;
}

interface CyberpunkDeckPayload {
  game: "cyberpunk";
  format: "alpha" | "constructed";
  deckId?: string;
  deckName?: string;
  playerName?: string;
  legends: DeckCardEntry[];
  mainDeck: DeckCardEntry[];
  bot?: PracticeBotConfig;
  launch?: PracticeLaunchConfig;
}

interface DeckCardEntry {
  cardId?: string;
  slug?: string;
  externalId?: string;
  quantity: number;
}

interface PracticeBotConfig {
  deckFixtureId?: string;
  deck?: {
    deckName?: string;
    legends: DeckCardEntry[];
    mainDeck: DeckCardEntry[];
  };
  strategyId?: "greedy" | "first-legal" | "random";
}

interface PracticeLaunchConfig {
  mode: "practice";
  autoStart: boolean;
  seed?: string;
}
```

### Card Identifiers

The preferred identifier is the simulator card `id` from `@tcg/cyberpunk-cards`. The simulator must also accept `slug` and `externalId` for card database compatibility.

Resolution order:

1. `cardId`
2. `slug`
3. `externalId`

If multiple identifiers are present and disagree, `cardId` wins and the simulator should include a warning in the import result.

### Quantity Expansion

The simulator expands each `DeckCardEntry` into a `DeckList`:

- `legends`: every entry quantity must resolve to exactly 1 total Legend card each, for 3 total.
- `mainDeck`: quantities expand into repeated card definition ids.

The simulator rejects non-positive quantities and non-integer quantities.

## Simulator Import Flow

1. Webview loads `/play/practice?source=card-db`.
2. Simulator posts `cyberpunk.webview.ready.v1` to `window.parent`.
3. Card database posts `cyberpunk.deck.import.v1`.
4. Simulator resolves card identifiers through the bundled card catalog.
5. Simulator validates the deck with `validateDeck`.
6. If valid, simulator creates a local practice config:
   - `matchId`
   - resolved player deck
   - bot deck fixture or resolved bot deck
   - bot strategy id
   - seed
   - created timestamp
7. If `launch.autoStart` is true, simulator immediately renders the board.
8. Simulator posts either `cyberpunk.practice.started.v1` or `cyberpunk.deck.import.error.v1`.

## Webview Events

### Ready

```typescript
interface CyberpunkWebviewReadyMessage {
  type: "cyberpunk.webview.ready.v1";
  capabilities: {
    deckImport: true;
    localPractice: true;
    botDeckPayload: boolean;
    sessionStorage: boolean;
  };
}
```

### Import Accepted

```typescript
interface CyberpunkDeckImportAcceptedMessage {
  type: "cyberpunk.deck.import.accepted.v1";
  requestId: string;
  matchId: string;
  warnings: string[];
}
```

### Import Error

```typescript
interface CyberpunkDeckImportErrorMessage {
  type: "cyberpunk.deck.import.error.v1";
  requestId: string;
  errors: DeckImportError[];
}

interface DeckImportError {
  code:
    | "UNKNOWN_CARD"
    | "INVALID_CARD_TYPE"
    | "INVALID_QUANTITY"
    | "INVALID_LEGEND_COUNT"
    | "DUPLICATE_LEGEND_NAME"
    | "INVALID_DECK_SIZE"
    | "LEGEND_IN_MAIN_DECK"
    | "EXCEEDS_COPY_LIMIT"
    | "EXCEEDS_RAM_LIMIT"
    | "UNSUPPORTED_FORMAT";
  message: string;
  cardRef?: DeckCardEntry;
}
```

### Practice Started

```typescript
interface CyberpunkPracticeStartedMessage {
  type: "cyberpunk.practice.started.v1";
  requestId: string;
  matchId: string;
  playerDeckName: string | null;
  botStrategyId: "greedy" | "first-legal" | "random";
}
```

### Practice Ended

```typescript
interface CyberpunkPracticeEndedMessage {
  type: "cyberpunk.practice.ended.v1";
  matchId: string;
  winner: "player" | "bot" | null;
  reason: string | null;
}
```

## Browser Storage

V1 can use `sessionStorage` for local webview sessions. Stored data must be scoped to the simulator origin and should expire after 7 days.

For imported card database decks, store only the resolved practice session needed to reload the current tab:

```typescript
interface ImportedPracticeSession {
  matchId: string;
  source: "card-db";
  playerDeck: ResolvedDeckList;
  botDeck: ResolvedDeckList | { fixtureId: string };
  botStrategyId: "greedy" | "first-legal" | "random";
  seed: string;
  createdAt: number;
}

interface ResolvedDeckList {
  playerId: string;
  playerName: string;
  legends: string[];
  mainDeck: string[];
}
```

The simulator must not assume the imported deck still exists in the card database after import.

## Security Requirements

- The simulator should accept messages only from configured card database origins.
- Unknown origins must be ignored.
- Unknown message types must be ignored.
- Payload parsing must be defensive and fail closed.
- The simulator must not execute scripts or HTML from deck names, player names, or card database metadata.
- Error messages should be useful but must not include secrets or raw untrusted blobs.

Recommended allowlist configuration:

```typescript
const ALLOWED_CARD_DATABASE_ORIGINS = [
  "https://cyberpunktcg.com",
  "https://www.cyberpunktcg.com",
  "https://thecardgoat.com",
];
```

Local development may allow `http://localhost:*` and `http://127.0.0.1:*` behind `import.meta.env.DEV`.

## Host Page Responsibilities

The card database should:

- Render a "Play in simulator" action only when the deck has enough card data to build the payload.
- Include stable card identifiers, preferably `cardId`.
- Include both Legends and main-deck cards with quantities.
- Listen for simulator ready, accepted, error, started, and ended messages.
- Show import validation errors in the deck UI when the simulator rejects the deck.
- Keep the iframe or webview focused during the match.

Example host flow:

```typescript
const iframe = document.querySelector<HTMLIFrameElement>("#cyberpunk-sim")!;

window.addEventListener("message", (event) => {
  if (event.origin !== SIMULATOR_ORIGIN) return;
  if (event.data?.type === "cyberpunk.webview.ready.v1") {
    iframe.contentWindow?.postMessage(
      {
        type: "cyberpunk.deck.import.v1",
        requestId: crypto.randomUUID(),
        payload: buildDeckPayloadFromCurrentDeck(),
      },
      SIMULATOR_ORIGIN,
    );
  }
});
```

## Simulator Implementation Requirements

Add these pieces to the simulator:

- `/play/practice` route for card database webview bootstrap.
- Deck payload parser that resolves `cardId`, `slug`, and `externalId`.
- Imported deck validation adapter around `validateDeck`.
- Imported practice session storage, separate from fixture-only sessions.
- Dynamic practice engine builder that accepts an imported `DeckList`.
- Origin allowlist and `postMessage` event bridge.
- Recovery UI for missing/expired imported sessions.

The existing fixture-only `/practice` flow can remain as a manual launcher. The `/play/practice` route is the embeddable card database entry point.

## Acceptance Criteria

- A valid card database payload starts a local AI practice match without a backend match record.
- Invalid deck payloads return structured validation errors to the host page.
- Refreshing the webview during the same browser session can recover the match from `sessionStorage`.
- The board uses the imported player deck, not a fixture deck.
- The bot uses either the requested fixture deck, an imported bot deck, or the default fixture deck.
- Simulator setup remains rules-faithful: face-down Legends, shuffled deck, opening hand, mulligan, and manual Gig choice.
- The card database can detect match start and match end through webview events.

## Open Decisions

- Final production allowlist of card database origins.
- Whether `format: "alpha"` should allow only fixed Alpha Kit decks or all currently legal alpha cards.
- Whether V2 should persist imported practice sessions as backend replay records.
- Whether the simulator should expose a "Return to deck" postMessage event or rely on host webview controls.
