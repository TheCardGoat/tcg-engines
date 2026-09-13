/**
 * NarutoPracticePage: solo practice against the engine's greedy AI
 * (chooseAiAction) or solo-vs-self (hot seat, viewer follows the decider).
 *
 * Setup screen: preview deck pickers (engine PREVIEW_DECKS), deck-list
 * textarea import validated via deckIssues, seed field. In game: Undo via a
 * state history stack (engine states are immutable), New game via EndOverlay.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  DEFAULT_SEED,
  PREVIEW_DECKS,
  applyAction,
  createInitialState,
  chooseAiAction,
  createPracticeState,
  deciderOf,
  previewDeckList,
} from "@tcg-engines/naruto-engine";
import type { Action, DeckList, GameState, PlayerId } from "@tcg-engines/naruto-engine";

import { NarutoBoard } from "../board/NarutoBoard.tsx";
import { NarutoCardImage } from "../board/NarutoCardImage.tsx";
import { cardImageUrl, cardName, deckIssueText } from "../projection/labels.ts";
import { parseDeckListText, parseNarutoPracticeDeckPayload } from "./deckImport.ts";
import { useRegisterSimulatorDebugExportSource } from "../../../simulator/debug-export/SimulatorDebugExportContext.tsx";
import { LocalSimulatorDebugHistoryRecorder } from "../../../simulator/debug-export/local-debug-history.ts";
import classes from "./pages.module.css";

const AI_SEAT: PlayerId = "p2";
const AI_DELAY_MS = 450;

type OpponentMode = "ai" | "self";
type BotStrategy = "greedy" | "passive";

interface PracticeSetup {
  readonly deckKey: string;
  readonly opponentDeckKey: string;
  readonly customText: string;
  readonly useCustom: boolean;
  readonly seedText: string;
  readonly mode: OpponentMode;
  readonly strategy: BotStrategy;
}

interface PracticeSession {
  readonly state: GameState | null;
  readonly history: readonly GameState[];
}

const DEFAULT_SETUP: PracticeSetup = {
  deckKey: PREVIEW_DECKS[0]?.key ?? "",
  opponentDeckKey: PREVIEW_DECKS[2]?.key ?? PREVIEW_DECKS[0]?.key ?? "",
  customText: "",
  useCustom: false,
  seedText: String(DEFAULT_SEED),
  mode: "ai",
  strategy: "greedy",
};

function resolveDeck(
  setup: PracticeSetup,
  key: string,
): { deck: DeckList | null; problems: string[] } {
  if (key === "custom") {
    const parsed = parseDeckListText(setup.customText);
    const problems = [
      ...parsed.errors.map((line) => `Could not parse: ${line}`),
      ...parsed.practiceIssues.map(deckIssueText),
    ];
    return { deck: problems.length === 0 ? parsed.deck : null, problems };
  }
  const previewDeck = PREVIEW_DECKS.find((d) => d.key === key);
  if (!previewDeck) return { deck: null, problems: ["Unknown preview deck"] };
  return { deck: previewDeckList(previewDeck), problems: [] };
}

function parseSeed(seedText: string): number {
  const parsed = Number(seedText.trim());
  return Number.isFinite(parsed) ? Math.abs(Math.trunc(parsed)) : DEFAULT_SEED;
}

function previewDeckKey(value: string | null): string | null {
  return value && PREVIEW_DECKS.some((deck) => deck.key === value) ? value : null;
}

function parseHandoffSeed(value: string | null): number | null {
  if (value === null || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function choosePracticeAiAction(
  state: GameState,
  player: PlayerId,
  strategy: BotStrategy,
): Action | null {
  if (strategy === "greedy") return chooseAiAction(state, player);
  if (state.pendingChoice || state.awaitingMulligan === player)
    return chooseAiAction(state, player);
  if (state.step === "counter" && state.priority === player) {
    return { type: "PASS_COUNTER", player };
  }
  if (state.activePlayer === player && state.phase === "main") return { type: "END_TURN", player };
  return null;
}

export function NarutoPracticePage() {
  const [setup, setSetup] = useState<PracticeSetup>(DEFAULT_SETUP);
  const [session, setSession] = useState<PracticeSession>({ state: null, history: [] });
  const [debugHistory, setDebugHistory] = useState<LocalSimulatorDebugHistoryRecorder | null>(null);
  const [startProblems, setStartProblems] = useState<readonly string[]>([]);
  const [pendingHandoffStart, setPendingHandoffStart] = useState(false);
  const { state, history } = session;
  useRegisterSimulatorDebugExportSource(debugHistory);

  const dispatch = useCallback(
    (action: Action) => {
      setSession((current) => {
        if (!current.state) return current;
        const next = applyAction(current.state, action);
        if (next === current.state) return current; // illegal: engine no-op by identity
        debugHistory?.record({
          stateAfter: next,
          turnNumber: next.turn,
          actorId: action.player,
          moveId: action.type,
          commandId: localCommandId("player"),
          input: action,
          processedCommand: action,
          timestamp: Date.now(),
          domainEvents: next.log.slice(current.state.log.length),
        });
        return { state: next, history: [...current.history, current.state] };
      });
    },
    [debugHistory],
  );

  const undo = useCallback(() => {
    setSession((current) => {
      const previous = current.history[current.history.length - 1];
      if (!previous) return current;
      debugHistory?.record({
        stateAfter: previous,
        turnNumber: previous.turn,
        actorId: "p1",
        moveId: "debug.undo",
        commandId: localCommandId("undo"),
        input: { historyIndex: current.history.length - 1 },
        timestamp: Date.now(),
        domainEvents: [],
      });
      return { state: previous, history: current.history.slice(0, -1) };
    });
  }, [debugHistory]);

  const startGame = useCallback(() => {
    const p1 = resolveDeck(setup, setup.useCustom ? "custom" : setup.deckKey);
    const p2 = resolveDeck(setup, setup.opponentDeckKey);
    const problems = [
      ...p1.problems.map((p) => `Your deck: ${p}`),
      ...p2.problems.map((p) => `Opponent deck: ${p}`),
    ];
    if (!p1.deck || !p2.deck || problems.length > 0) {
      setStartProblems(problems);
      return;
    }
    setStartProblems([]);
    const seed = parseSeed(setup.seedText);
    const createState = setup.useCustom ? createPracticeState : createInitialState;
    const initialState = createState({
      decks: { p1: p1.deck, p2: p2.deck },
      seed,
      names: { p1: "You", p2: setup.mode === "ai" ? "AI Opponent" : "Player 2" },
    });
    const localId = `naruto-practice-${Date.now()}`;
    setDebugHistory(
      new LocalSimulatorDebugHistoryRecorder(
        {
          slug: "naruto",
          gameId: localId,
          matchId: localId,
          seed: String(seed),
        },
        initialState,
      ),
    );
    setSession({
      history: [],
      state: initialState,
    });
  }, [setup]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payload = params.get("deck");
    const deckKey = previewDeckKey(params.get("deckKey"));
    const opponentDeckKey = previewDeckKey(params.get("opponentDeckKey"));
    const mode = params.get("mode") === "self" ? "self" : "ai";
    const strategy = params.get("strategy") === "passive" ? "passive" : "greedy";
    const seed = parseHandoffSeed(params.get("seed"));
    const problems: string[] = [];
    let customText: string | null = null;
    if (payload) {
      const parsed = parseNarutoPracticeDeckPayload(payload);
      problems.push(
        ...parsed.errors.map((line) => `Could not load deck: ${line}`),
        ...parsed.practiceIssues.map(deckIssueText),
      );
      if (problems.length === 0) customText = deckToImportText(parsed.deck);
    }
    if (params.has("deckKey") && !deckKey) problems.push("Unknown preview deck");
    if (params.has("opponentDeckKey") && !opponentDeckKey) problems.push("Unknown opponent deck");
    if (params.has("seed") && seed === null) problems.push("Match seed must be a whole number");
    if (problems.length > 0) {
      setStartProblems(problems);
      return;
    }
    setSetup((current) => ({
      ...current,
      ...(deckKey ? { deckKey } : {}),
      ...(opponentDeckKey ? { opponentDeckKey } : {}),
      ...(customText !== null ? { useCustom: true, customText } : {}),
      ...(seed !== null ? { seedText: String(seed) } : {}),
      mode,
      strategy,
    }));
    if (params.get("start") === "1") setPendingHandoffStart(true);
  }, []);

  useEffect(() => {
    if (!pendingHandoffStart) return;
    setPendingHandoffStart(false);
    startGame();
  }, [pendingHandoffStart, startGame]);

  const backToSetup = useCallback(() => {
    setDebugHistory(null);
    setSession({ state: null, history: [] });
  }, []);

  // Greedy AI loop: whenever the AI seat must decide, pick and apply.
  useEffect(() => {
    if (!state || setup.mode !== "ai" || state.winner) return;
    if (deciderOf(state) !== AI_SEAT) return;
    const timer = window.setTimeout(() => {
      setSession((current) => {
        if (!current.state || current.state.winner || deciderOf(current.state) !== AI_SEAT) {
          return current;
        }
        const action = choosePracticeAiAction(current.state, AI_SEAT, setup.strategy);
        if (!action) return current;
        const next = applyAction(current.state, action);
        if (next === current.state) return current;
        debugHistory?.record({
          stateAfter: next,
          turnNumber: next.turn,
          actorId: action.player,
          moveId: action.type,
          commandId: localCommandId("ai"),
          input: action,
          processedCommand: action,
          timestamp: Date.now(),
          domainEvents: next.log.slice(current.state.log.length),
        });
        // AI decisions are one side of the response to the player's move, not
        // separate undo checkpoints. Keeping them out of history means Undo
        // returns to a human decision boundary instead of restoring AI
        // priority and immediately replaying the same automated action.
        return { state: next, history: current.history };
      });
    }, AI_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [debugHistory, state, setup.mode, setup.strategy]);

  const viewer: PlayerId = useMemo(() => {
    if (!state || setup.mode === "ai") return "p1";
    return deciderOf(state) ?? state.activePlayer;
  }, [state, setup.mode]);

  const customPreview = useMemo(
    () => (setup.useCustom ? parseDeckListText(setup.customText) : null),
    [setup.customText, setup.useCustom],
  );
  const selectedDeck = PREVIEW_DECKS.find((deck) => deck.key === setup.deckKey) ?? PREVIEW_DECKS[0];

  if (!state) {
    return (
      <main className={classes.page} data-game="naruto" data-testid="naruto-practice-setup">
        <header className={classes.header}>
          <h1>Naruto Card Game Preview</h1>
          <p className={classes.previewNotice}>
            Offline practice using provisional rules. This is not an official game client or a
            live-match service.
          </p>
          <p className={classes.assetNotice}>
            Community-preview card art is included for this prototype. Rules and card text remain
            provisional.
          </p>
        </header>
        <section className={classes.setupLayout}>
          <div className={classes.setupGrid}>
            <label className={classes.field}>
              <span>Your deck</span>
              <select
                data-testid="naruto-deck-picker"
                value={setup.useCustom ? "custom" : setup.deckKey}
                onChange={(event) => {
                  const value = event.target.value;
                  setSetup((s) => ({
                    ...s,
                    useCustom: value === "custom",
                    deckKey: value === "custom" ? s.deckKey : value,
                  }));
                }}
              >
                {PREVIEW_DECKS.map((deck) => (
                  <option key={deck.key} value={deck.key}>
                    {deck.key} ({cardName(deck.leaderId)})
                  </option>
                ))}
                <option value="custom">Import deck list…</option>
              </select>
            </label>
            {setup.useCustom ? (
              <label className={classes.field}>
                <span>Deck list (leader, main deck, Chakra, and Summon setup)</span>
                <textarea
                  data-testid="naruto-deck-import"
                  rows={8}
                  value={setup.customText}
                  onChange={(event) => setSetup((s) => ({ ...s, customText: event.target.value }))}
                  placeholder={"leader: N-001\n4xN-004\n4xN-007\nchakra: 5xC-001\nsummon: S-001"}
                />
              </label>
            ) : null}
            {customPreview ? (
              <div className={classes.deckStatus} data-testid="naruto-deck-status">
                <p>
                  {customPreview.deck.cardIds.length} main cards,{" "}
                  {customPreview.deck.chakraCardIds.length} Chakra, and{" "}
                  {customPreview.deck.summonCardId ? "1" : "0"} Summon parsed
                </p>
                {customPreview.errors.map((line) => (
                  <p key={line} className={classes.problem}>
                    Could not parse: {line}
                  </p>
                ))}
                {customPreview.issues.map((issue) => (
                  <p key={issue} className={classes.problem}>
                    {deckIssueText(issue)}
                  </p>
                ))}
              </div>
            ) : null}
            <label className={classes.field}>
              <span>Opponent deck</span>
              <select
                data-testid="naruto-opponent-deck-picker"
                value={setup.opponentDeckKey}
                onChange={(event) =>
                  setSetup((s) => ({ ...s, opponentDeckKey: event.target.value }))
                }
              >
                {PREVIEW_DECKS.map((deck) => (
                  <option key={deck.key} value={deck.key}>
                    {deck.key} ({cardName(deck.leaderId)})
                  </option>
                ))}
              </select>
            </label>
            <label className={classes.field}>
              <span>Bot strategy</span>
              <select
                data-testid="naruto-strategy-picker"
                value={setup.strategy}
                onChange={(event) =>
                  setSetup((s) => ({ ...s, strategy: event.target.value as BotStrategy }))
                }
              >
                <option value="greedy">Greedy AI</option>
                <option value="passive">Passive practice bot</option>
              </select>
            </label>
            <label className={classes.field}>
              <span>Opponent mode</span>
              <select
                data-testid="naruto-mode-picker"
                value={setup.mode}
                onChange={(event) =>
                  setSetup((s) => ({ ...s, mode: event.target.value as OpponentMode }))
                }
              >
                <option value="ai">Bot opponent</option>
                <option value="self">Solo vs self (hot seat)</option>
              </select>
            </label>
            <label className={classes.field}>
              <span>Seed</span>
              <input
                data-testid="naruto-seed"
                value={setup.seedText}
                onChange={(event) => setSetup((s) => ({ ...s, seedText: event.target.value }))}
                inputMode="numeric"
              />
            </label>
            {startProblems.map((problem) => (
              <p key={problem} className={classes.problem} data-testid="naruto-start-problem">
                {problem}
              </p>
            ))}
            <button
              type="button"
              className={classes.startButton}
              data-testid="naruto-start"
              onClick={startGame}
            >
              Start game
            </button>
          </div>
          {selectedDeck ? (
            <aside className={classes.setupPreview} aria-label="Selected deck preview">
              <div className={classes.previewCardFrame}>
                <NarutoCardImage
                  className={classes.previewCardArt}
                  src={cardImageUrl(selectedDeck.leaderId)}
                  alt={cardName(selectedDeck.leaderId)}
                  draggable={false}
                  fallbackLabel={cardName(selectedDeck.leaderId)}
                />
              </div>
              <div className={classes.previewCopy}>
                <h2>{cardName(selectedDeck.leaderId)}</h2>
                <p>
                  {selectedDeck.key} is loaded as your practice deck. Choose an opponent, then begin
                  a local match.
                </p>
              </div>
            </aside>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <div className={classes.practiceGame} data-testid="naruto-practice-game">
      <nav className={classes.gameBar} aria-label="Practice match controls">
        <button
          type="button"
          data-testid="naruto-undo"
          disabled={history.length === 0}
          onClick={undo}
        >
          Undo ({history.length})
        </button>
        <button type="button" data-testid="naruto-quit" onClick={backToSetup}>
          Setup
        </button>
      </nav>
      <NarutoBoard
        state={state}
        viewer={viewer}
        onAction={dispatch}
        onNewGame={backToSetup}
        onUndo={undo}
        canUndo={history.length > 0}
        bugReportContext={{
          gameSlug: "naruto",
          playerCount: 2,
          turn: state.turn,
          stateVersion: state.log.length,
          platform: window.innerWidth < 900 ? "mobile" : "desktop",
        }}
      />
    </div>
  );
}

let localCommandSequence = 0;

function localCommandId(source: "ai" | "player" | "undo"): string {
  localCommandSequence += 1;
  return `naruto:${source}:${localCommandSequence}`;
}

function deckToImportText(deck: DeckList): string {
  const rows = [`leader: ${deck.leaderId}`];
  for (const [id, quantity] of deckCounts(deck.cardIds)) rows.push(`${quantity}x${id}`);
  for (const [id, quantity] of deckCounts(deck.chakraCardIds))
    rows.push(`chakra: ${quantity}x${id}`);
  rows.push(`summon: ${deck.summonCardId}`);
  return rows.join("\n");
}

function deckCounts(cardIds: readonly string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const id of cardIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  return counts;
}

export default NarutoPracticePage;
