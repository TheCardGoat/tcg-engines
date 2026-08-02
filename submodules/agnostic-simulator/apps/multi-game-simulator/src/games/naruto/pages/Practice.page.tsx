/**
 * NarutoPracticePage: solo practice against the engine's greedy AI
 * (chooseAiAction) or solo-vs-self (hot seat, viewer follows the decider).
 *
 * Setup screen: prebuilt deck pickers (engine PREBUILT_DECKS), deck-list
 * textarea import validated via deckIssues, seed field. In game: Undo via a
 * state history stack (engine states are immutable), New game via EndOverlay.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  DEFAULT_SEED,
  PREBUILT_DECKS,
  applyAction,
  cardOf,
  chooseAiAction,
  createInitialState,
  deciderOf,
  prebuiltDeckList,
} from "@tcg-engines/naruto-engine";
import type { Action, DeckList, GameState, PlayerId } from "@tcg-engines/naruto-engine";

import { NarutoBoard } from "../board/NarutoBoard.tsx";
import { cardName, deckIssueText } from "../projection/labels.ts";
import { parseDeckListText } from "./deckImport.ts";
import classes from "./pages.module.css";

const AI_SEAT: PlayerId = "p2";
const AI_DELAY_MS = 450;

type OpponentMode = "ai" | "self";

interface PracticeSetup {
  readonly deckKey: string;
  readonly opponentDeckKey: string;
  readonly customText: string;
  readonly useCustom: boolean;
  readonly seedText: string;
  readonly mode: OpponentMode;
}

const DEFAULT_SETUP: PracticeSetup = {
  deckKey: PREBUILT_DECKS[0]?.key ?? "",
  opponentDeckKey: PREBUILT_DECKS[2]?.key ?? PREBUILT_DECKS[0]?.key ?? "",
  customText: "",
  useCustom: false,
  seedText: String(DEFAULT_SEED),
  mode: "ai",
};

function resolveDeck(
  setup: PracticeSetup,
  key: string,
): { deck: DeckList | null; problems: string[] } {
  if (key === "custom") {
    const parsed = parseDeckListText(setup.customText);
    const problems = [
      ...parsed.errors.map((line) => `Could not parse: ${line}`),
      ...parsed.issues.map(deckIssueText),
    ];
    return { deck: problems.length === 0 ? parsed.deck : null, problems };
  }
  const prebuilt = PREBUILT_DECKS.find((d) => d.key === key);
  if (!prebuilt) return { deck: null, problems: ["Unknown prebuilt deck"] };
  return { deck: prebuiltDeckList(prebuilt), problems: [] };
}

function parseSeed(seedText: string): number {
  const parsed = Number(seedText.trim());
  return Number.isFinite(parsed) ? Math.abs(Math.trunc(parsed)) : DEFAULT_SEED;
}

export function NarutoPracticePage() {
  const [setup, setSetup] = useState<PracticeSetup>(DEFAULT_SETUP);
  const [state, setState] = useState<GameState | null>(null);
  const [history, setHistory] = useState<readonly GameState[]>([]);
  const [startProblems, setStartProblems] = useState<readonly string[]>([]);

  const dispatch = useCallback((action: Action) => {
    setState((current) => {
      if (!current) return current;
      const next = applyAction(current, action);
      if (next === current) return current; // illegal: engine no-op by identity
      setHistory((h) => [...h, current]);
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((h) => {
      const previous = h[h.length - 1];
      if (!previous) return h;
      setState(previous);
      return h.slice(0, -1);
    });
  }, []);

  const startGame = useCallback(() => {
    const p1 = resolveDeck(setup, setup.deckKey);
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
    setHistory([]);
    setState(
      createInitialState({
        decks: { p1: p1.deck, p2: p2.deck },
        seed,
        names: { p1: "You", p2: setup.mode === "ai" ? "AI Opponent" : "Player 2" },
      }),
    );
  }, [setup]);

  const backToSetup = useCallback(() => {
    setState(null);
    setHistory([]);
  }, []);

  // Greedy AI loop: whenever the AI seat must decide, pick and apply.
  useEffect(() => {
    if (!state || setup.mode !== "ai" || state.winner) return;
    if (deciderOf(state) !== AI_SEAT) return;
    const timer = window.setTimeout(() => {
      setState((current) => {
        if (!current || current.winner || deciderOf(current) !== AI_SEAT) return current;
        const action = chooseAiAction(current, AI_SEAT);
        if (!action) return current;
        const next = applyAction(current, action);
        if (next === current) return current;
        setHistory((h) => [...h, current]);
        return next;
      });
    }, AI_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [state, setup.mode]);

  const viewer: PlayerId = useMemo(() => {
    if (!state || setup.mode === "ai") return "p1";
    return deciderOf(state) ?? state.activePlayer;
  }, [state, setup.mode]);

  const customPreview = useMemo(
    () => (setup.useCustom ? parseDeckListText(setup.customText) : null),
    [setup.customText, setup.useCustom],
  );

  if (!state) {
    return (
      <main className={classes.page} data-game="naruto" data-testid="naruto-practice-setup">
        <header className={classes.header}>
          <p>Naruto Card Game simulator</p>
          <h1>Practice</h1>
        </header>
        <section className={classes.setupGrid}>
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
              {PREBUILT_DECKS.map((deck) => (
                <option key={deck.key} value={deck.key}>
                  {deck.key} ({cardName(deck.leaderId)})
                </option>
              ))}
              <option value="custom">Import deck list…</option>
            </select>
          </label>
          {setup.useCustom ? (
            <label className={classes.field}>
              <span>Deck list (leader: N-001, then 3xN-007 lines)</span>
              <textarea
                data-testid="naruto-deck-import"
                rows={8}
                value={setup.customText}
                onChange={(event) => setSetup((s) => ({ ...s, customText: event.target.value }))}
                placeholder={"leader: N-001\n4xN-004\n4xN-007"}
              />
            </label>
          ) : null}
          {customPreview ? (
            <div className={classes.deckStatus} data-testid="naruto-deck-status">
              <p>{customPreview.deck.cardIds.length} cards parsed</p>
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
              onChange={(event) => setSetup((s) => ({ ...s, opponentDeckKey: event.target.value }))}
            >
              {PREBUILT_DECKS.map((deck) => (
                <option key={deck.key} value={deck.key}>
                  {deck.key} ({cardName(deck.leaderId)})
                </option>
              ))}
            </select>
          </label>
          <label className={classes.field}>
            <span>Opponent</span>
            <select
              data-testid="naruto-mode-picker"
              value={setup.mode}
              onChange={(event) =>
                setSetup((s) => ({ ...s, mode: event.target.value as OpponentMode }))
              }
            >
              <option value="ai">Greedy AI</option>
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
        </section>
      </main>
    );
  }

  const leaderOf = (seat: PlayerId) =>
    cardOf({ uid: "", cardId: state.players[seat].leaderId })?.nameEn;

  return (
    <div data-testid="naruto-practice-game">
      <div className={classes.gameBar} data-game="naruto">
        <span className={classes.gameBarInfo}>
          {state.players.p1.name} ({leaderOf("p1")}) vs {state.players.p2.name} ({leaderOf("p2")}) -
          turn {state.turn}
        </span>
        <button
          type="button"
          className={classes.barButton}
          data-testid="naruto-undo"
          disabled={history.length === 0}
          onClick={undo}
        >
          Undo ({history.length})
        </button>
        <button
          type="button"
          className={classes.barButton}
          data-testid="naruto-quit"
          onClick={backToSetup}
        >
          Setup
        </button>
      </div>
      <NarutoBoard state={state} viewer={viewer} onAction={dispatch} onNewGame={backToSetup} />
    </div>
  );
}

export default NarutoPracticePage;
