/**
 * Engine-built fixture states for Storybook stories, fixture routes, and
 * jsdom tests. States are produced by real `applyAction` scripts wherever
 * possible (hands are planted to keep scripts deck-shuffle independent).
 */

import { applyAction, buildDeck, createInitialState } from "@tcg-engines/naruto-engine";
import type { Action, GameState, PlayerId } from "@tcg-engines/naruto-engine";

export interface NarutoFixture {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly group: "core" | "interaction" | "layout";
  readonly state: GameState;
  readonly viewer: PlayerId;
  /** Force the mobile tree in stories. */
  readonly mobile?: boolean;
}

let plantCounter = 0;

/** Unshift known cards into a hand so scripts don't depend on the shuffle. */
function plantHand(state: GameState, player: PlayerId, cardIds: readonly string[]): string[] {
  const hand = state.players[player].hand;
  const uids: string[] = [];
  for (const cardId of cardIds) {
    const uid = `${player}-planted-${plantCounter++}-${cardId}`;
    hand.unshift({ uid, cardId });
    uids.push(uid);
  }
  return uids;
}

function run(state: GameState, actions: readonly Action[]): GameState {
  let current = state;
  for (const action of actions) {
    const next = applyAction(current, action);
    if (next === current) {
      throw new Error(`Fixture action was rejected by the engine: ${JSON.stringify(action)}`);
    }
    current = next;
  }
  return current;
}

/** Turn-3 mid-game: both players summoned a character, p1 set a support. */
function buildMidGame(): GameState {
  let state = createInitialState({
    seed: 7,
    firstPlayer: "p1",
    decks: { p1: buildDeck("N-001"), p2: buildDeck("N-012") },
    names: { p1: "You", p2: "Opponent" },
  });
  const [p1Char, p1Support] = plantHand(state, "p1", ["N-004", "N-010"]);
  const [p2Char] = plantHand(state, "p2", ["N-019"]);
  state = run(state, [
    { type: "MULLIGAN", player: "p2", keep: true },
    { type: "SUMMON", player: "p1", handUid: p1Char ?? "" },
    { type: "SET_SUPPORT", player: "p1", handUid: p1Support ?? "" },
    { type: "END_TURN", player: "p1" },
    { type: "SUMMON", player: "p2", handUid: p2Char ?? "" },
    { type: "END_TURN", player: "p2" },
  ]);
  return state;
}

/** Counter window: p1's character attacks the p2 leader; p2 has priority. */
function buildCounterWindow(): GameState {
  let state = buildMidGame();
  const attacker = state.players.p1.characters.find((c) => c !== null);
  state = run(state, [
    {
      type: "DECLARE_ATTACK",
      player: "p1",
      attackerUid: attacker?.uid ?? "",
      attackerKind: "character",
      targetKind: "leader",
      targetUid: null,
    },
  ]);
  return state;
}

/** Board-target choice: N-001 leader effect (leaderBoost) is pending. */
function buildBoardTargetChoice(): GameState {
  let state = buildMidGame();
  state = run(state, [{ type: "LEADER_EFFECT", player: "p1" }]);
  return state;
}

/** Modal choice: N-012 leader effect (leaderPutBack) offers hand cards. */
function buildModalChoice(): GameState {
  let state = createInitialState({
    seed: 11,
    firstPlayer: "p1",
    decks: { p1: buildDeck("N-012"), p2: buildDeck("N-001") },
    names: { p1: "You", p2: "Opponent" },
  });
  plantHand(state, "p1", ["N-010", "N-013"]);
  state = run(state, [
    { type: "MULLIGAN", player: "p2", keep: true },
    { type: "LEADER_EFFECT", player: "p1" },
  ]);
  return state;
}

/**
 * EX requirement choice (board targets): hand-crafted pendingChoice over a
 * real mid-game state - with exactly-assignable boards the engine auto-
 * resolves these steps, so we freeze one mid-flow for the visual fixture.
 */
function buildExRequirementChoice(): GameState {
  let state = buildMidGame();
  const [extra] = plantHand(state, "p1", ["N-006"]);
  state = run(state, [{ type: "SUMMON", player: "p1", handUid: extra ?? "" }]);
  const boosted = state.players.p1.characters.find((c) => c?.cardId === "N-006");
  if (boosted) boosted.powerBonus = 3;
  const [ex] = plantHand(state, "p1", ["N-naruto-ex"]);
  const options = state.players.p1.characters.flatMap((character, index) =>
    character
      ? [
          {
            zone: "character" as const,
            key: character.uid,
            owner: "p1" as const,
            cardId: character.cardId,
            index,
          },
        ]
      : [],
  );
  return {
    ...state,
    pendingChoice: {
      effect: "exRequirement",
      source: "N-naruto-ex",
      player: "p1",
      promptKey: "choice.exRequirement",
      options,
      cancellable: false,
      data: { handUid: ex ?? "", step: 0, paid: "" },
    },
  };
}

/** EX search modal: real EX summon flow lands on a deck-search choice. */
function buildExSearchModal(): GameState {
  let state = buildMidGame();
  const [extra] = plantHand(state, "p1", ["N-006"]);
  state = run(state, [{ type: "SUMMON", player: "p1", handUid: extra ?? "" }]);
  const boosted = state.players.p1.characters.find((c) => c?.cardId === "N-006");
  if (boosted) boosted.powerBonus = 3;
  const [ex] = plantHand(state, "p1", ["N-naruto-ex"]);
  state = run(state, [{ type: "SUMMON", player: "p1", handUid: ex ?? "" }]);
  return state;
}

/** Fresh game: p2 awaits the mulligan decision (viewed from p2). */
function buildOpening(): GameState {
  return createInitialState({
    seed: 3,
    firstPlayer: "p1",
    decks: { p1: buildDeck("N-001"), p2: buildDeck("N-012") },
    names: { p1: "You", p2: "Opponent" },
  });
}

function cache<T>(build: () => T): () => T {
  let value: T | null = null;
  return () => {
    if (value === null) value = build();
    return value;
  };
}

const midGame = cache(buildMidGame);
const counterWindow = cache(buildCounterWindow);
const boardTargetChoice = cache(buildBoardTargetChoice);
const modalChoice = cache(buildModalChoice);
const exRequirementChoice = cache(buildExRequirementChoice);
const exSearchModal = cache(buildExSearchModal);
const opening = cache(buildOpening);

export function getNarutoFixture(id: string): NarutoFixture | null {
  return NARUTO_FIXTURES.find((fixture) => fixture.id === id) ?? null;
}

export const NARUTO_FIXTURE_GROUPS = [
  { id: "core", label: "Core board states" },
  { id: "interaction", label: "Interaction states" },
  { id: "layout", label: "Layout variants" },
] as const;

export const NARUTO_FIXTURES: readonly NarutoFixture[] = [
  {
    id: "opening",
    label: "Opening (mulligan pending)",
    description: "Fresh game; the second player still has the keep/redraw decision.",
    group: "core",
    state: opening(),
    viewer: "p2",
  },
  {
    id: "mid-game",
    label: "Mid game (turn 3)",
    description: "Both players have a character out; p1 set a face-down support; p1 to act.",
    group: "core",
    state: midGame(),
    viewer: "p1",
  },
  {
    id: "counter-window",
    label: "Counter window",
    description: "p1's character attacks the p2 leader; the defender holds priority.",
    group: "interaction",
    state: counterWindow(),
    viewer: "p2",
  },
  {
    id: "board-target-choice",
    label: "Board-target choice",
    description: "N-001 leader effect pending: board characters are targetable, cancellable.",
    group: "interaction",
    state: boardTargetChoice(),
    viewer: "p1",
  },
  {
    id: "modal-choice",
    label: "Hand choice modal",
    description: "N-012 leader effect pending: choose a hand card to put back (modal).",
    group: "interaction",
    state: modalChoice(),
    viewer: "p1",
  },
  {
    id: "ex-requirement",
    label: "EX summon requirement",
    description: "EX Naruto summon frozen mid-requirement: pay with board characters.",
    group: "interaction",
    state: exRequirementChoice(),
    viewer: "p1",
  },
  {
    id: "ex-search-modal",
    label: "EX search modal",
    description: "EX Naruto on-summon: choose a Naruto Uzumaki from the deck (modal).",
    group: "interaction",
    state: exSearchModal(),
    viewer: "p1",
  },
  {
    id: "mobile-portrait",
    label: "Mobile portrait",
    description: "Mid-game state rendered in the mobile board tree.",
    group: "layout",
    state: midGame(),
    viewer: "p1",
    mobile: true,
  },
] as const;

export type NarutoFixtureId = (typeof NARUTO_FIXTURES)[number]["id"];
