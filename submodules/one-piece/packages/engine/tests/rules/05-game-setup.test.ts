import { describe, expect, test } from "vite-plus/test";
import {
  applyCommand,
  createMatch,
  createSt01MirrorPracticeConfig,
  getLegalCommands,
  projectStateForSeat,
  ST01_MAIN_DECK,
  type EngineCommand,
  type MatchConfig,
  type MatchState,
} from "../../src/index.ts";
// Deck-construction validation (5-1-2 family, "standard" format) is owned by
// the game workspace: validateDeckForFormat from @tcg/op-cards.
import { getAllCards, getCard, validateDeckForFormat } from "@tcg/op-cards";

// 5-1-1 and 5-2-1-1 are physical preparation/presentation procedures with no
// engine command; validateDeckForFormat is their executable analog and is
// exercised below. 5-2-1-4-1 ("no intervention" in the first/second decision)
// is a meta-rule with no executable surface. 5-2-1-5-1 and 5-2-1-5-2 are
// vacuous: no card in the current catalog has an "At the start of the game"
// effect (grep over packages/cards/src finds no such text or trigger).
//
// Fluency note: this chapter intentionally uses createMatch / applyCommand /
// projectStateForSeat rather than asSouth()/asNorth() play-battle helpers —
// the surface under test is setup legality and projection before Main Phase,
// not seat-bound card actions.

interface DeckEntry {
  cardId: string;
  quantity: number;
}

function toDeckEntries(cardIds: readonly string[]): DeckEntry[] {
  const quantities = new Map<string, number>();
  for (const cardId of cardIds) {
    quantities.set(cardId, (quantities.get(cardId) ?? 0) + 1);
  }
  return [...quantities].map(([cardId, quantity]) => ({ cardId, quantity }));
}

function validateDeck(deck: readonly DeckEntry[]) {
  return validateDeckForFormat("standard", deck);
}

function rule(result: ReturnType<typeof validateDeck>, kind: string) {
  const found = result.rules.find((candidate) => candidate.kind === kind);
  if (!found) {
    throw new Error(`Expected a ${kind} rule in the validation result.`);
  }
  return found;
}

const MAIN_DECK_CARD_TYPES = new Set(["character", "event", "stage"]);

// Fills a rule-legal 50-card main deck for leaderId from the catalog: up to 4
// copies per card, only cards sharing a color with the leader. The required
// entries are included verbatim so a test can exercise a specific card; the
// deck is only legal overall if they are.
function buildMainDeck(leaderId: string, required: readonly DeckEntry[] = []): DeckEntry[] {
  const leader = getCard(leaderId);
  const entries = required.map((entry) => ({ ...entry }));
  const usedCanonicalIds = new Set(entries.map((entry) => getCard(entry.cardId).canonicalId));
  let total = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  for (const card of getAllCards()) {
    if (total >= 50) break;
    if (!MAIN_DECK_CARD_TYPES.has(card.cardType)) continue;
    if (usedCanonicalIds.has(card.canonicalId)) continue;
    if (!card.color.some((color) => leader.color.includes(color))) continue;
    const quantity = Math.min(4, 50 - total);
    entries.push({ cardId: card.id, quantity });
    usedCanonicalIds.add(card.canonicalId);
    total += quantity;
  }
  if (total !== 50) {
    throw new Error(`Could not build a 50-card main deck for ${leaderId}.`);
  }
  return entries;
}

function buildDeck(leaderId: string, required: readonly DeckEntry[] = []): DeckEntry[] {
  return [{ cardId: leaderId, quantity: 1 }, ...buildMainDeck(leaderId, required)];
}

const RED_LEADER = "OP01-001"; // Roronoa Zoro, red, Life 5.
const RED_CHARACTER = "OP01-004"; // Usopp, red Character.
const GREEN_LEADER = "OP01-002"; // Trafalgar Law Leader.
const BLUE_LEADER = "OP01-060"; // Donquixote Doflamingo, blue.
const BLUE_UNLIMITED = "OP01-075"; // Pacifista, blue, unlimited-copies deck rule.
const DON_CARD = "DON-001";
const EVENT_CARD = "OP13-021"; // Gum-Gum Gatling, Event.
const STAGE_CARD = "OP13-022"; // Windmill Village, Stage.

function runSetup(initial: MatchState, commands: EngineCommand[]): MatchState {
  let state = initial;
  for (const command of commands) {
    const result = applyCommand(state, command);
    expect(result.accepted, `${command.type} rejected: ${result.reason ?? ""}`).toBe(true);
    state = result.state;
  }
  return state;
}

function decideFirstPlayer(initial: MatchState, firstPlayer: "south" | "north"): MatchState {
  return runSetup(initial, [
    { type: "chooseJoKenPo", seat: "south", choice: "paper" },
    { type: "chooseJoKenPo", seat: "north", choice: "rock" },
    { type: "chooseFirstPlayer", seat: "south", firstPlayer },
  ]);
}

const SETUP_DECK = [
  "OP13-013",
  "OP13-021",
  "OP13-022",
  "OP13-030",
  "OP13-037",
  "OP13-043",
  "OP13-013",
  "OP13-021",
  "OP13-022",
  "OP13-030",
  "OP13-037",
];

function setupConfig(leaderSouth: string, leaderNorth: string): MatchConfig {
  return {
    firstPlayer: "south",
    shuffleDecks: false,
    players: {
      south: { leaderCardId: leaderSouth, mainDeck: [...SETUP_DECK] },
      north: { leaderCardId: leaderNorth, mainDeck: [...SETUP_DECK] },
    },
  };
}

describe("5-1 Preparing Leader Cards, Decks, and DON!! Decks", () => {
  test("5-1-1 and 5-1-2: each player prepares 1 Leader, a 50-card deck, and a 10-card DON!! deck — exactly 1 Leader is accepted", () => {
    const result = validateDeck(buildDeck(RED_LEADER));

    expect(rule(result, "leader-count").passed).toBe(true);
    expect(result.valid).toBe(true);
  });

  test("5-1-2: a deck without a Leader card is rejected", () => {
    const result = validateDeck(buildMainDeck(RED_LEADER));

    expect(rule(result, "leader-count").passed).toBe(false);
    expect(result.valid).toBe(false);
  });

  test("5-1-2: a deck with two Leader cards is rejected", () => {
    const result = validateDeck([
      { cardId: RED_LEADER, quantity: 1 },
      { cardId: GREEN_LEADER, quantity: 1 },
      ...buildMainDeck(RED_LEADER),
    ]);

    expect(rule(result, "leader-count").passed).toBe(false);
    expect(result.valid).toBe(false);
  });

  test("5-1-2: a 50-card main deck alongside the Leader is accepted", () => {
    expect(ST01_MAIN_DECK).toHaveLength(50);
    const result = validateDeck([
      { cardId: "ST01-001", quantity: 1 },
      ...toDeckEntries(ST01_MAIN_DECK),
    ]);

    expect(result.valid).toBe(true);
  });

  test("5-1-2: a 49-card main deck is rejected", () => {
    const result = validateDeck([
      { cardId: "ST01-001", quantity: 1 },
      ...toDeckEntries(ST01_MAIN_DECK.slice(0, 49)),
    ]);

    expect(rule(result, "deck-size").passed).toBe(false);
    expect(result.valid).toBe(false);
  });

  test("5-1-2: an undersized main deck is rejected", () => {
    const result = validateDeck([
      { cardId: RED_LEADER, quantity: 1 },
      { cardId: RED_CHARACTER, quantity: 4 },
    ]);

    expect(rule(result, "deck-size").passed).toBe(false);
    expect(result.valid).toBe(false);
  });

  test("5-1-2: a DON!! deck of other than 10 cards is rejected", () => {
    const result = validateDeck([...buildDeck(RED_LEADER), { cardId: DON_CARD, quantity: 9 }]);

    expect(result.rules.some((candidate) => candidate.kind === "don-deck")).toBe(true);
    expect(result.valid).toBe(false);
  });

  test("5-1-2-1: a deck of Character, Event, and Stage cards is accepted", () => {
    const result = validateDeck(
      buildDeck(RED_LEADER, [
        { cardId: RED_CHARACTER, quantity: 4 },
        { cardId: EVENT_CARD, quantity: 4 },
        { cardId: STAGE_CARD, quantity: 4 },
      ]),
    );

    expect(result.valid).toBe(true);
  });

  test("5-1-2-1: a main deck containing a DON!! card is rejected", () => {
    const result = validateDeck([...buildDeck(RED_LEADER), { cardId: DON_CARD, quantity: 1 }]);

    expect(result.valid).toBe(false);
  });

  test("5-1-2-2: a card whose color is not included on the Leader is rejected", () => {
    expect(getCard(RED_LEADER).color).toEqual(["red"]);
    expect(getCard(BLUE_UNLIMITED).color).toEqual(["blue"]);
    const result = validateDeck(buildDeck(RED_LEADER, [{ cardId: BLUE_UNLIMITED, quantity: 1 }]));

    expect(rule(result, "color-legality").passed).toBe(false);
    expect(result.valid).toBe(false);
  });

  test("5-1-2-3: a deck may contain exactly 4 cards with the same card number", () => {
    const result = validateDeck(buildDeck(RED_LEADER, [{ cardId: RED_CHARACTER, quantity: 4 }]));

    expect(rule(result, "copy-limit").passed).toBe(true);
    expect(result.valid).toBe(true);
  });

  test("5-1-2-3: a deck with 5 cards with the same card number is rejected", () => {
    const result = validateDeck(buildDeck(RED_LEADER, [{ cardId: RED_CHARACTER, quantity: 5 }]));

    const copyLimit = rule(result, "copy-limit");
    expect(copyLimit.passed).toBe(false);
    expect(copyLimit.message).toContain("OP01-004 x5");
    expect(result.valid).toBe(false);
  });

  test("5-1-2-4: an unlimited-copies deck-construction effect replaces only the 4-copy limit", () => {
    // 5-1-2-4-1/5-1-2-4-2: the unlimited-copies rule is a deck-construction
    // effect applied during deck construction, replacing 5-1-2-3 for that
    // card — and only 5-1-2-3. Pacifista is blue.
    expect(getCard(BLUE_UNLIMITED).color).toEqual(["blue"]);
    expect(getCard(BLUE_LEADER).color).toEqual(["blue"]);
    const accepted = validateDeck([
      { cardId: BLUE_LEADER, quantity: 1 },
      { cardId: BLUE_UNLIMITED, quantity: 50 },
    ]);

    expect(rule(accepted, "copy-limit").passed).toBe(true);
    expect(accepted.valid).toBe(true);

    // 5-1-2-2 still applies: the same card under a mono-red Leader is
    // rejected on color legality even though the copy limit is replaced.
    const rejected = validateDeck([
      { cardId: RED_LEADER, quantity: 1 },
      { cardId: BLUE_UNLIMITED, quantity: 50 },
    ]);

    expect(rule(rejected, "copy-limit").passed).toBe(true);
    expect(rule(rejected, "color-legality").passed).toBe(false);
    expect(rejected.valid).toBe(false);
  });
});

describe("5-2 Pre-Game Preparations", () => {
  test("5-2-1-2: each deck is shuffled and placed face-down in the deck area", () => {
    const state = createMatch(createSt01MirrorPracticeConfig({ firstPlayer: "south" }));
    const southDeckOrder = state.players.south.deck.map(
      (instanceId) => state.cards[instanceId]!.cardId,
    );
    const northDeckOrder = state.players.north.deck.map(
      (instanceId) => state.cards[instanceId]!.cardId,
    );

    // 50 - 5 opening hand = 45 cards remain face-down in each deck. Starting
    // Life (5-2-1-7) is placed from the deck only after the mulligan step.
    expect(state.players.south.deck).toHaveLength(45);
    expect(southDeckOrder).not.toEqual([...ST01_MAIN_DECK].slice(5));
    expect(northDeckOrder).not.toEqual(southDeckOrder);

    const southView = projectStateForSeat(state, "south");
    const northView = projectStateForSeat(state, "north");
    for (const view of [southView, northView]) {
      expect(view.players.south.deckCount).toBe(45);
      expect(view.players.south.deckTop?.hidden).toBe(true);
      expect(view.players.south.deckTop?.name).toBeNull();
      expect(view.players.north.deckTop?.hidden).toBe(true);
      expect(view.players.north.deckTop?.name).toBeNull();
    }
  });

  test("5-2-1-3: each Leader card is placed face-up in its Leader area", () => {
    const state = createMatch(createSt01MirrorPracticeConfig({ firstPlayer: "south" }));

    for (const viewer of ["south", "north", "spectator"] as const) {
      const view = projectStateForSeat(state, viewer);
      for (const seat of ["south", "north"] as const) {
        const leader = view.players[seat].leader;
        expect(leader.zone).toBe("leader");
        expect(leader.hidden).toBe(false);
        expect(leader.cardId).toBe("ST01-001");
        expect(leader.name).toBe(getCard("ST01-001").name);
      }
    }
  });

  test("5-2-1-4: the players decide by Jo Ken Po who chooses to go first or second", () => {
    const created = createMatch(createSt01MirrorPracticeConfig({ firstPlayer: "south" }));
    const state = runSetup(created, [
      { type: "chooseJoKenPo", seat: "south", choice: "paper" },
      { type: "chooseJoKenPo", seat: "north", choice: "rock" },
    ]);

    expect(state.setup.joKenPo.winner).toBe("south");
    const southLegal = getLegalCommands(state, "south").map((command) => command.type);
    const northLegal = getLegalCommands(state, "north").map((command) => command.type);
    expect(southLegal).toContain("chooseFirstPlayer");
    expect(northLegal).not.toContain("chooseFirstPlayer");

    const loserAttempt = applyCommand(state, {
      type: "chooseFirstPlayer",
      seat: "north",
      firstPlayer: "north",
    });
    expect(loserAttempt.accepted).toBe(false);
    expect(loserAttempt.reason).toBe(
      "Only the Jo Ken Po winner can choose who takes the first turn.",
    );
  });

  test("5-2-1-5: the deciding player declares whether they go first or second", () => {
    const created = createMatch(createSt01MirrorPracticeConfig({ firstPlayer: "south" }));
    const goesSecond = decideFirstPlayer(created, "north");

    expect(goesSecond.setup.joKenPo.firstPlayerDecided).toBe(true);
    expect(goesSecond.config.firstPlayer).toBe("north");
    expect(projectStateForSeat(goesSecond, "south").activeSeat).toBe("north");

    const firstPlayerLogs = projectStateForSeat(goesSecond, "spectator").logs;
    expect(
      firstPlayerLogs.some((entry) => entry.message.includes("will take the first turn")),
    ).toBe(true);
  });

  test("5-2-1-6: each player draws 5 cards from their deck as their opening hand", () => {
    const state = createMatch(createSt01MirrorPracticeConfig({ firstPlayer: "south" }));

    const southView = projectStateForSeat(state, "south");
    expect(southView.players.south.hand).toHaveLength(5);
    expect(southView.players.south.handCount).toBe(5);
    expect(southView.players.north.handCount).toBe(5);
    const northView = projectStateForSeat(state, "north");
    expect(northView.players.north.hand).toHaveLength(5);
  });

  test("5-2-1-6: each player may redraw their hand once, and only once", () => {
    const created = decideFirstPlayer(
      createMatch(createSt01MirrorPracticeConfig({ firstPlayer: "south" })),
      "south",
    );

    const mulliganed = applyCommand(created, { type: "mulligan", seat: "south" });
    expect(mulliganed.accepted).toBe(true);
    expect(mulliganed.state.players.south.hand).toHaveLength(5);

    const secondMulligan = applyCommand(mulliganed.state, { type: "mulligan", seat: "south" });
    expect(secondMulligan.accepted).toBe(false);
    expect(secondMulligan.reason).toBe("This player already made a mulligan choice.");

    const keepAfterMulligan = applyCommand(mulliganed.state, { type: "keepHand", seat: "south" });
    expect(keepAfterMulligan.accepted).toBe(false);

    const southLegal = getLegalCommands(mulliganed.state, "south").map((command) => command.type);
    expect(southLegal).not.toContain("mulligan");
    expect(southLegal).not.toContain("keepHand");
  });

  test("5-2-1-6-1: a redraw returns the whole hand to the deck, reshuffles, and draws 5 cards", () => {
    // The reshuffle draws from the full 50-card deck (Life is placed only
    // afterwards), so a returned card may legally be redrawn; this seed keeps
    // the redraw disjoint from the returned hand to prove the zone movement.
    const created = decideFirstPlayer(
      createMatch(
        createSt01MirrorPracticeConfig({ firstPlayer: "south", seed: "mulligan-seed-2" }),
      ),
      "south",
    );
    const returnedHand = [...created.players.south.hand];
    const mulliganed = applyCommand(created, { type: "mulligan", seat: "south" });
    expect(mulliganed.accepted).toBe(true);
    const state = mulliganed.state;

    // Every returned card is back in the deck (identity in a hidden zone).
    for (const instanceId of returnedHand) {
      expect(state.cards[instanceId]!.zone).toBe("deck");
      expect(state.players.south.deck).toContain(instanceId);
    }
    // Life is not placed until after the redraws (5-2-1-6 before 5-2-1-7), so
    // the redraw reshuffles the full deck: 45 remaining + 5 returned - 5
    // redrawn = 45 face-down cards.
    expect(state.players.south.deck).toHaveLength(45);
    expect(state.players.south.hand).toHaveLength(5);
    for (const instanceId of state.players.south.hand) {
      expect(state.cards[instanceId]!.zone).toBe("hand");
    }
  });

  test("5-2-1-7: each player places face-down Life equal to their Leader's Life value", () => {
    // 5-2-1-7 places Life after the opening-hand redraws (5-2-1-6), just
    // before the first player starts the game (5-2-1-8).
    const created = decideFirstPlayer(createMatch(setupConfig("OP01-001", "OP01-003")), "south");
    expect(created.players.south.life).toHaveLength(0);
    const state = runSetup(created, [
      { type: "keepHand", seat: "south" },
      { type: "keepHand", seat: "north" },
      { type: "startGame", seat: "south" },
    ]);

    const southLeader = getCard("OP01-001");
    const northLeader = getCard("OP01-003");
    if (southLeader.cardType !== "leader" || northLeader.cardType !== "leader") {
      throw new Error("Expected Leader cards for the Life-count assertion.");
    }
    expect(state.players.south.life).toHaveLength(southLeader.life);
    expect(state.players.north.life).toHaveLength(northLeader.life);
    expect(southLeader.life).toBe(5);
    expect(northLeader.life).toBe(4);

    for (const viewer of ["south", "north", "spectator"] as const) {
      const view = projectStateForSeat(state, viewer);
      for (const seat of ["south", "north"] as const) {
        expect(view.players[seat].life.length).toBeGreaterThan(0);
        expect(view.players[seat].life.every((card) => card.hidden)).toBe(true);
        expect(view.players[seat].life.every((card) => card.name === null)).toBe(true);
      }
    }
  });

  test("5-2-1-7: the deck-top card is placed at the bottom of the Life area", () => {
    const created = decideFirstPlayer(createMatch(setupConfig("OP01-001", "OP01-003")), "south");
    const state = runSetup(created, [
      { type: "keepHand", seat: "south" },
      { type: "keepHand", seat: "north" },
      { type: "startGame", seat: "south" },
    ]);

    // The opening hand took SETUP_DECK[0..4], so SETUP_DECK[5] is the top of
    // the deck when Life is placed; it sits at the bottom of the Life area
    // while life[0] (taken first by damage) is SETUP_DECK[9].
    const bottomOfLife = state.players.south.life.at(-1)!;
    expect(state.cards[bottomOfLife]!.cardId).toBe(SETUP_DECK[5]);
    expect(state.cards[state.players.south.life[0]!]!.cardId).toBe(SETUP_DECK[9]);
  });

  test("5-2-1-8: the first player begins the game and starts their turn", () => {
    const created = decideFirstPlayer(
      createMatch(createSt01MirrorPracticeConfig({ firstPlayer: "south" })),
      "south",
    );
    const ready = runSetup(created, [
      { type: "keepHand", seat: "south" },
      { type: "keepHand", seat: "north" },
    ]);

    const notFirstPlayer = applyCommand(ready, { type: "startGame", seat: "north" });
    expect(notFirstPlayer.accepted).toBe(false);

    const started = applyCommand(ready, { type: "startGame", seat: "south" });
    expect(started.accepted).toBe(true);
    const view = projectStateForSeat(started.state, "south");
    expect(view.status).toBe("active");
    expect(view.activeSeat).toBe("south");
    expect(view.turnNumber).toBe(1);
    expect(view.phase).toBe("main");
  });

  test("5-2-1-8: when the deciding player chooses second, the opponent starts the game", () => {
    const created = decideFirstPlayer(
      createMatch(createSt01MirrorPracticeConfig({ firstPlayer: "south" })),
      "north",
    );
    const ready = runSetup(created, [
      { type: "keepHand", seat: "south" },
      { type: "keepHand", seat: "north" },
    ]);
    const started = applyCommand(ready, { type: "startGame", seat: "north" });
    expect(started.accepted).toBe(true);

    const view = projectStateForSeat(started.state, "north");
    expect(view.status).toBe("active");
    expect(view.activeSeat).toBe("north");
    expect(view.turnNumber).toBe(1);
  });
});
