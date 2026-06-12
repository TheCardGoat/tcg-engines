import { describe, expect, it } from "bun:test";
import {
  type CardInstanceId,
  type LegacyFlatMoveLog,
  type LorcanaLogMessageKey,
  type PlayerId,
} from "@tcg/lorcana-engine";
import type { ChatMessage, ChatPresetKey } from "@tcg/shared";

import type {
  MoveLogEntrySnapshot,
  SimulatorSerializedObject,
} from "@/features/simulator/model/contracts.js";
import {
  createLogCardReference,
  createLogEntry,
} from "@/features/simulator-devtools/test-data/factories.js";
import {
  buildActivityFeed,
  buildEventLogRows,
  filterEntriesToLastTurns,
  groupEventLogRows,
  type CardReferenceResolver,
} from "./event-log-presentation.js";
import { formatEventLogBody } from "@/features/simulator/model/event-log-formatting.js";

type FormatCase = {
  moveId: MoveLogEntrySnapshot["moveId"];
  values: SimulatorSerializedObject;
  expected: string;
};

function createPrivateField<T>(value: T, visibleTo: string[]) {
  return {
    __private: true as const,
    value,
    visibleTo,
  };
}

const FORMAT_CASES = {
  "lorcana.setup.firstPlayerChosen": {
    moveId: "chooseWhoGoesFirst",
    values: { chooser: "player_one", chosen: "player_two" },
    expected: "Chose Opponent to start.",
  },
  "lorcana.setup.mulligan.count": {
    moveId: "alterHand",
    values: { playerId: "player_one", count: 2 },
    expected: "Altered 2 cards.",
  },
  "lorcana.setup.mulligan.detail": {
    moveId: "alterHand",
    values: {
      playerId: "player_one",
      count: 2,
      mulliganed: ["card-primary", "card-secondary"],
      drawn: ["card-secondary", "card-primary"],
    },
    expected:
      "Altered 2 cards: Ariel - On Human Legs, Mickey Mouse - Detective. Drew Mickey Mouse - Detective, Ariel - On Human Legs.",
  },
  "lorcana.setup.done": {
    moveId: "alterHand",
    values: {},
    expected: "Setup complete.",
  },
  "lorcana.ability.activated": {
    moveId: "activateAbility",
    values: { playerId: "player_one", cardId: "card-primary" },
    expected: "Activated an ability from Ariel - On Human Legs.",
  },
  "lorcana.ability.activated.named": {
    moveId: "activateAbility",
    values: { playerId: "player_one", cardId: "card-primary", abilityName: "Singer 5" },
    expected: "Activated Singer 5 from Ariel - On Human Legs.",
  },
  "lorcana.ability.activated.named.discardCost": {
    moveId: "activateAbility",
    values: {
      playerId: "player_one",
      cardId: "card-primary",
      abilityName: "GOOD AIM",
      discardCardIds: ["card-secondary"],
    },
    expected: "Activated GOOD AIM from Ariel - On Human Legs, discarding Mickey Mouse - Detective.",
  },
  "lorcana.ability.activated.discardCost": {
    moveId: "activateAbility",
    values: {
      playerId: "player_one",
      cardId: "card-primary",
      discardCardIds: ["card-secondary"],
    },
    expected:
      "Activated an ability from Ariel - On Human Legs, discarding Mickey Mouse - Detective.",
  },
  "lorcana.card.inked": {
    moveId: "putCardIntoInkwell",
    values: { playerId: "player_one", cardId: "card-primary" },
    expected: "Put [Inkable] Ariel - On Human Legs into the inkwell.",
  },
  "lorcana.scry.count": {
    moveId: "playCard",
    values: { playerId: "player_one", count: 3 },
    expected: "Looked at the top 3 cards.",
  },
  "lorcana.scry.detail": {
    moveId: "playCard",
    values: { playerId: "player_one", count: 2, lookedAt: ["card-primary", "card-secondary"] },
    expected: "Looked at the top 2 cards: Ariel - On Human Legs, Mickey Mouse - Detective.",
  },
  "lorcana.effect.lookAtInkwell": {
    moveId: "resolveEffect",
    values: { playerId: "player_one", count: 3 },
    expected: "Looked at their inkwell (3 cards).",
  },
  "lorcana.effect.lookAtInkwell.detail": {
    moveId: "resolveEffect",
    values: { playerId: "player_one", count: 2, cardIds: ["card-primary", "card-secondary"] },
    expected: "Looked at their inkwell (2 cards): Ariel - On Human Legs, Mickey Mouse - Detective.",
  },
  "lorcana.move.playCard": {
    moveId: "playCard",
    values: { playerId: "player_one", cardId: "card-primary" },
    expected: "Played Ariel - On Human Legs.",
  },
  "lorcana.move.quest": {
    moveId: "quest",
    values: { playerId: "player_one", cardId: "card-primary", loreGained: 2 },
    expected: "Quested with Ariel - On Human Legs for 2 lore.",
  },
  "lorcana.move.questWithAll": {
    moveId: "questWithAll",
    values: {
      playerId: "player_one",
      cardIds: ["card-primary", "card-secondary"],
      loreGained: 3,
      count: 2,
    },
    expected:
      "Quested with 2 characters: Ariel - On Human Legs, Mickey Mouse - Detective for 3 lore.",
  },
  "lorcana.move.challenge": {
    moveId: "challenge",
    values: {
      playerId: "player_one",
      attackerId: "card-primary",
      defenderId: "card-secondary",
    },
    expected: "Challenged Mickey Mouse - Detective with Ariel - On Human Legs.",
  },
  "lorcana.move.moveCharacterToLocation": {
    moveId: "moveCharacterToLocation",
    values: {
      playerId: "player_one",
      characterId: "card-primary",
      locationId: "card-location",
    },
    expected: "Moved Ariel - On Human Legs to Motunui - Island Paradise.",
  },
  "lorcana.move.passTurn": {
    moveId: "passTurn",
    values: { playerId: "player_one" },
    expected: "Passed the turn.",
  },
  "lorcana.move.concede": {
    moveId: "concede",
    values: { playerId: "player_one" },
    expected: "Conceded the game.",
  },
  "lorcana.bag.resolve.completed": {
    moveId: "resolveBag",
    values: { playerId: "player_one", sourceId: "card-primary" },
    expected: "Resolved an effect from Ariel - On Human Legs.",
  },
  "lorcana.bag.resolve.completed.named": {
    moveId: "resolveBag",
    values: { playerId: "player_one", sourceId: "card-primary", abilityName: "Singer 5" },
    expected: "Resolved Singer 5 from Ariel - On Human Legs.",
  },
  "lorcana.bag.resolve.completed.targets": {
    moveId: "resolveBag",
    values: {
      playerId: "player_one",
      sourceId: "card-primary",
      targets: ["card-secondary", "card-location"],
    },
    expected:
      "Resolved an effect from Ariel - On Human Legs, targeting Mickey Mouse - Detective, Motunui - Island Paradise.",
  },
  "lorcana.bag.resolve.completed.targets.named": {
    moveId: "resolveBag",
    values: {
      playerId: "player_one",
      sourceId: "card-primary",
      abilityName: "Singer 5",
      targets: ["card-secondary", "card-location"],
    },
    expected:
      "Resolved Singer 5 from Ariel - On Human Legs, targeting Mickey Mouse - Detective, Motunui - Island Paradise.",
  },
  "lorcana.bag.resolve.skipped": {
    moveId: "resolveBag",
    values: { playerId: "player_one", sourceId: "card-primary" },
    expected: "Skipped an effect from Ariel - On Human Legs.",
  },
  "lorcana.bag.resolve.skipped.named": {
    moveId: "resolveBag",
    values: { playerId: "player_one", sourceId: "card-primary", abilityName: "Singer 5" },
    expected: "Skipped Singer 5 from Ariel - On Human Legs.",
  },
  "lorcana.bag.resolve.pending": {
    moveId: "resolveBag",
    values: { playerId: "player_one", sourceId: "card-primary" },
    expected: "Started resolving an effect from Ariel - On Human Legs. More input is required.",
  },
  "lorcana.bag.resolve.pending.named": {
    moveId: "resolveBag",
    values: { playerId: "player_one", sourceId: "card-primary", abilityName: "Singer 5" },
    expected: "Started resolving Singer 5 from Ariel - On Human Legs. More input is required.",
  },
  "lorcana.bag.resolve.pending.named.targets": {
    moveId: "resolveBag",
    values: {
      playerId: "player_one",
      sourceId: "card-primary",
      abilityName: "Singer 5",
      targets: ["card-secondary"],
    },
    expected:
      "Started resolving Singer 5 from Ariel - On Human Legs, targeting Mickey Mouse - Detective. More input is required.",
  },
  "lorcana.effect.resolve.discardChoice": {
    moveId: "resolveEffect",
    values: {
      playerId: "player_one",
      sourceCardId: "card-primary",
      targets: ["card-secondary"],
    },
    expected: "Resolved Ariel - On Human Legs by discarding Mickey Mouse - Detective.",
  },
  "lorcana.effect.resolve.targetSelection": {
    moveId: "resolveEffect",
    values: {
      playerId: "player_one",
      sourceCardId: "card-primary",
      targets: ["card-secondary", "card-location"],
    },
    expected:
      "Resolved Ariel - On Human Legs, targeting Mickey Mouse - Detective, Motunui - Island Paradise.",
  },
  "lorcana.effect.resolve.choiceSelection": {
    moveId: "resolveEffect",
    values: {
      playerId: "player_one",
      sourceCardId: "card-primary",
      choiceIndex: 2,
    },
    expected: "Resolved Ariel - On Human Legs with option 2.",
  },
  "lorcana.effect.resolve.optionalSelection.accepted": {
    moveId: "resolveEffect",
    values: { playerId: "player_one", sourceCardId: "card-primary" },
    expected: "Resolved Ariel - On Human Legs by choosing yes.",
  },
  "lorcana.effect.resolve.optionalSelection.accepted.targets": {
    moveId: "resolveEffect",
    values: {
      playerId: "player_one",
      sourceCardId: "card-primary",
      targets: ["card-secondary", "card-location"],
    },
    expected:
      "Resolved Ariel - On Human Legs by choosing yes, targeting Mickey Mouse - Detective, Motunui - Island Paradise.",
  },
  "lorcana.effect.resolve.optionalSelection.accepted.targets.named": {
    moveId: "resolveEffect",
    values: {
      playerId: "player_one",
      sourceCardId: "card-primary",
      abilityName: "Singer 5",
      targets: ["card-secondary", "card-location"],
    },
    expected:
      "Resolved Singer 5 from Ariel - On Human Legs by choosing yes, targeting Mickey Mouse - Detective, Motunui - Island Paradise.",
  },
  "lorcana.effect.resolve.optionalSelection.rejected": {
    moveId: "resolveEffect",
    values: { playerId: "player_one", sourceCardId: "card-primary" },
    expected: "Resolved Ariel - On Human Legs by choosing no.",
  },
  "lorcana.effect.resolve.nameCardSelection": {
    moveId: "resolveEffect",
    values: {
      playerId: "player_one",
      sourceCardId: "card-primary",
      namedCard: "Be Prepared",
    },
    expected: "Resolved Ariel - On Human Legs by naming Be Prepared.",
  },
  "lorcana.effect.resolve.scrySelection": {
    moveId: "resolveEffect",
    values: { playerId: "player_one", sourceCardId: "card-primary" },
    expected: "Finished ordering cards for Ariel - On Human Legs.",
  },
  "lorcana.effect.resolve.scrySelection.detail": {
    moveId: "resolveEffect",
    values: {
      playerId: "player_one",
      sourceCardId: "card-primary",
      selection: ["Hand: Ariel - On Human Legs", "Bottom of deck: Mickey Mouse - Detective"],
      handCards: ["card-primary"],
      deckBottomCards: ["card-secondary"],
    },
    expected:
      "Finished ordering cards for Ariel - On Human Legs: Hand: Ariel - On Human Legs, Bottom of deck: Mickey Mouse - Detective.",
  },
  "lorcana.private.effect.resolve.scrySelection.detail": {
    moveId: "resolveEffect",
    values: {
      playerId: "player_one",
      sourceCardId: "card-primary",
      selection: [],
      destinations: [
        { zone: "hand", cardIds: ["card-primary"] },
        { zone: "deck-bottom", cardIds: ["card-secondary"] },
      ],
    },
    expected:
      "Finished ordering cards for Ariel - On Human Legs: Hand: Ariel - On Human Legs, Bottom of deck: Mickey Mouse - Detective.",
  },
  "lorcana.effect.resolve.revealTopCard": {
    moveId: "resolveEffect",
    values: {
      playerId: "player_one",
      targetPlayerId: "player_two",
      revealedCardId: "card-primary",
    },
    expected: "You revealed Ariel - On Human Legs from Opponent's deck.",
  },
  "lorcana.effect.resolve.revealTopCard.autoBottom": {
    moveId: "resolveEffect",
    values: {
      playerId: "player_one",
      targetPlayerId: "player_two",
      revealedCardId: "card-primary",
    },
    expected: "Revealed Ariel - On Human Legs — put on the bottom of Opponent's deck.",
  },
  "lorcana.effect.resolve.choiceSelection.withReveal": {
    moveId: "resolveEffect",
    values: {
      playerId: "player_one",
      sourceCardId: "card-primary",
      revealedCardId: "card-secondary",
      choiceIndex: 2,
    },
    expected: "You chose option 2 for Mickey Mouse - Detective.",
  },
  "lorcana.bag.resolve.cancelled": {
    moveId: "resolveBag",
    values: { playerId: "player_one", sourceId: "card-primary", cause: "no-valid-targets" },
    expected: "Effect from Ariel - On Human Legs cancelled (no-valid-targets).",
  },
  "lorcana.bag.resolve.cancelled.named": {
    moveId: "resolveBag",
    values: {
      playerId: "player_one",
      sourceId: "card-primary",
      abilityName: "Rush",
      cause: "no-valid-targets",
    },
    expected: "Rush from Ariel - On Human Legs cancelled (no-valid-targets).",
  },
  "lorcana.effect.cancelled": {
    moveId: "resolveEffect",
    values: { playerId: "player_one", sourceCardId: "card-primary", cause: "no-valid-targets" },
    expected: "Effect from Ariel - On Human Legs cancelled (no-valid-targets).",
  },
  "lorcana.outcome.combatDamage": {
    moveId: "challenge",
    values: {
      playerId: "player_one",
      attackerId: "card-primary",
      defenderId: "card-secondary",
      attackerDamage: 3,
      defenderDamage: 2,
    },
    expected:
      "Ariel - On Human Legs dealt 3 damage to Mickey Mouse - Detective. Mickey Mouse - Detective dealt 2 damage to Ariel - On Human Legs.",
  },
  "lorcana.outcome.effectDamage": {
    moveId: "resolveEffect",
    values: {
      playerId: "player_one",
      sourceId: "card-primary",
      targetId: "card-secondary",
      amount: 4,
    },
    expected: "Ariel - On Human Legs dealt 4 damage to Mickey Mouse - Detective.",
  },
  "lorcana.outcome.damageMoved": {
    moveId: "resolveBag",
    values: {
      playerId: "player_one",
      sourceId: "card-primary",
      targetId: "card-secondary",
      amount: 3,
    },
    expected: "Moved 3 damage from Ariel - On Human Legs to Mickey Mouse - Detective.",
  },
  "lorcana.outcome.damagePrevented": {
    moveId: "resolveEffect",
    values: {
      playerId: "player_one",
      targetId: "card-primary",
      amount: 2,
    },
    expected: "Ariel - On Human Legs took no damage — 2 damage was prevented.",
  },
  "lorcana.outcome.cardBanished": {
    moveId: "challenge",
    values: { playerId: "player_one", cardId: "card-primary" },
    expected: "Ariel - On Human Legs was banished.",
  },
  "lorcana.outcome.cardsDrawn": {
    moveId: "resolveEffect",
    values: { playerId: "player_one", amount: 3 },
    expected: "Drew 3 card(s).",
  },
  "lorcana.outcome.cardsDrawn.detail": {
    moveId: "resolveEffect",
    values: { playerId: "player_one", amount: 2, cardIds: ["card-primary", "card-secondary"] },
    expected: "Drew 2 card(s): Ariel - On Human Legs, Mickey Mouse - Detective.",
  },
  "lorcana.outcome.cardsDiscarded.detail": {
    moveId: "resolveEffect",
    values: { playerId: "player_one", amount: 2, cardIds: ["card-primary", "card-secondary"] },
    expected: "You discarded 2 card(s): Ariel - On Human Legs, Mickey Mouse - Detective.",
  },
  "lorcana.outcome.cardReturnedToHand": {
    moveId: "resolveEffect",
    values: { playerId: "player_one", cardId: "card-primary" },
    expected: "Ariel - On Human Legs returned to hand.",
  },
  "lorcana.outcome.loreGained": {
    moveId: "resolveEffect",
    values: { playerId: "player_one", amount: 2 },
    expected: "You gained 2 lore.",
  },
  "lorcana.outcome.locationLoreGained": {
    moveId: "passTurn",
    values: { playerId: "player_one", amount: 3, locationCount: 2 },
    expected: "You gained 3 lore from 2 location(s).",
  },
  "lorcana.outcome.loreLost": {
    moveId: "resolveEffect",
    values: { playerId: "player_one", amount: 1 },
    expected: "You lost 1 lore.",
  },
  "lorcana.outcome.cardExerted": {
    moveId: "resolveEffect",
    values: { playerId: "player_one", cardId: "card-primary" },
    expected: "Ariel - On Human Legs was exerted.",
  },
  "lorcana.outcome.cardReadied": {
    moveId: "resolveEffect",
    values: { playerId: "player_one", cardId: "card-primary" },
    expected: "Ariel - On Human Legs was readied.",
  },
  "lorcana.outcome.cardsMilled": {
    moveId: "resolveEffect",
    values: { playerId: "player_one", amount: 3 },
    expected: "Milled 3 card(s).",
  },
  "lorcana.outcome.cardsPutOnBottom": {
    moveId: "resolveEffect",
    values: { playerId: "player_one", cardIds: ["card-secondary", "card-tertiary"] },
    expected:
      "Put Mickey Mouse - Detective, Grumpy - Soreheaded Miner on the bottom of their deck(s).",
  },
  "lorcana.move.playCard.shift": {
    moveId: "playCard",
    values: { playerId: "player_one", cardId: "card-primary", shiftTargetId: "card-secondary" },
    expected: "Played Ariel - On Human Legs by shifting onto Mickey Mouse - Detective.",
  },
  "lorcana.move.playCard.sing": {
    moveId: "playCard",
    values: { playerId: "player_one", cardId: "card-primary", singerIds: ["card-secondary"] },
    expected: "Played Ariel - On Human Legs by singing with Mickey Mouse - Detective.",
  },
  "lorcana.outcome.cardInked": {
    moveId: "playCard",
    values: { playerId: "player_one", cardId: "card-primary" },
    expected: "Ariel - On Human Legs was put in the inkwell.",
  },
  "lorcana.outcome.cardInkedExerted": {
    moveId: "playCard",
    values: { playerId: "player_one", cardId: "card-primary" },
    expected: "Ariel - On Human Legs was put in the inkwell, exerted.",
  },
  "lorcana.move.forfeitGame": {
    moveId: "forfeitGame",
    values: { winnerId: "player_two" },
    expected: "Opponent won the game.",
  },
  "lorcana.system.turnSkipped": {
    moveId: "passTurn",
    values: { skipperPlayerId: "player_one", stallerPlayerId: "player_two" },
    expected: "You skipped Opponent's turn.",
  },
  "lorcana.system.playerDropped": {
    moveId: "passTurn",
    values: {
      dropperPlayerId: "player_one",
      droppedPlayerId: "player_two",
      reason: "Opponent disconnected",
    },
    expected: "You dropped Opponent (Opponent disconnected).",
  },
} satisfies Partial<Record<LorcanaLogMessageKey, FormatCase>>;

const FALLBACK_CASES = {
  activateAbility: "Performed a fallback ability action.",
  alterHand: "Performed a fallback alter hand action.",
  chooseWhoGoesFirst: "Performed a fallback first-player action.",
  challenge: "Performed a fallback challenge action.",
  concede: "Performed a fallback concede action.",
  moveCharacterToLocation: "Performed a fallback move action.",
  passTurn: "Performed a fallback pass action.",
  playCard: "Performed a fallback play action.",
  putCardIntoInkwell: "Performed a fallback ink action.",
  quest: "Performed a fallback quest action.",
  questWithAll: "Performed a fallback group quest action.",
  undo: "Performed a fallback undo action.",
  sing: "Performed a fallback sing action.",
  singTogether: "Performed a fallback sing together action.",
  resolveBag: "Performed a fallback bag resolution.",
  resolveEffect: "Performed a fallback effect resolution.",
  manualMoveCard: "Performed a fallback manual move action.",
  manualExertCard: "Performed a fallback manual exert action.",
  manualReadyCard: "Performed a fallback manual ready action.",
  manualDryCard: "Performed a fallback manual dry action.",
  manualSetDamage: "Performed a fallback damage action.",
  manualSetLore: "Performed a fallback lore action.",
  manualShuffleDeck: "Performed a fallback shuffle action.",
  manualPassTurn: "Performed a fallback manual pass action.",
  turnSkipped: "Performed a fallback turn-skipped action.",
  playerDropped: "Performed a fallback player-dropped action.",
  forfeitGame: "Performed a fallback forfeit action.",
} satisfies Record<MoveLogEntrySnapshot["moveId"], string>;

function createTypedEntry(key: LorcanaLogMessageKey, formatCase: FormatCase): MoveLogEntrySnapshot {
  const primaryCard = createLogCardReference("playerOne", {
    id: "card-primary",
    name: "Ariel - On Human Legs",
    inkType: ["sapphire"],
  });
  const secondaryCard = createLogCardReference("playerTwo", {
    id: "card-secondary",
    name: "Mickey Mouse - Detective",
    inkType: ["amber"],
  });
  const locationCard = createLogCardReference("playerOne", {
    id: "card-location",
    name: "Motunui - Island Paradise",
  });

  return createLogEntry(`typed ${key}`, {
    actorSide: "playerOne",
    id: key,
    moveId: formatCase.moveId,
    typedLogEntry: {
      type: key,
      values: formatCase.values,
      visibility: { mode: "PUBLIC" },
      category: "action",
    } as import("@tcg/lorcana-engine").LorcanaGameLogEntry,
    playerId: "player_one",
    params: { cardId: primaryCard.cardId },
    turnNumber: 7,
  });
}

function createFlatEntry(
  moveLog: LegacyFlatMoveLog,
  options: Partial<MoveLogEntrySnapshot> = {},
): MoveLogEntrySnapshot {
  return createLogEntry(`flat ${moveLog.type}`, {
    actorSide: "playerOne",
    id: `flat-${moveLog.type}`,
    moveId: (options.moveId ?? "playCard") as MoveLogEntrySnapshot["moveId"],
    typedLogEntry: moveLog as unknown as MoveLogEntrySnapshot["typedLogEntry"],
    playerId: String(moveLog.playerId),
    turnNumber: 7,
    ...options,
  });
}

function createTestResolver() {
  const primaryCard = createLogCardReference("playerOne", {
    id: "card-primary",
    name: "Ariel - On Human Legs",
    inkType: ["sapphire"],
  });
  const secondaryCard = createLogCardReference("playerTwo", {
    id: "card-secondary",
    name: "Mickey Mouse - Detective",
    inkType: ["amber"],
  });
  const locationCard = createLogCardReference("playerOne", {
    id: "card-location",
    name: "Motunui - Island Paradise",
  });
  const tertiaryCard = createLogCardReference("playerTwo", {
    id: "card-tertiary",
    name: "Grumpy - Soreheaded Miner",
    inkType: ["amethyst"],
  });
  const shiftTargetCard = createLogCardReference("playerOne", {
    id: "t000014",
    name: "Merlin - Shapeshifter",
  });

  const cardMap = new Map([
    [primaryCard.cardId, primaryCard],
    [secondaryCard.cardId, secondaryCard],
    [locationCard.cardId, locationCard],
    [tertiaryCard.cardId, tertiaryCard],
    [shiftTargetCard.cardId, shiftTargetCard],
  ]);

  return (cardId: string) => cardMap.get(cardId) ?? null;
}

function flattenRowText(entry: MoveLogEntrySnapshot): string {
  const resolveCard = createTestResolver();
  return formatEventLogBody(entry, "playerOne", undefined, resolveCard).text;
}

describe("event log presentation", () => {
  const typedCases = Object.entries(FORMAT_CASES) as Array<[LorcanaLogMessageKey, FormatCase]>;

  for (const [key, formatCase] of typedCases) {
    it(`formats ${key} through the typed formatter`, () => {
      const entry = createTypedEntry(key, formatCase);
      expect((entry.typedLogEntry as import("@tcg/lorcana-engine").LorcanaGameLogEntry).type).toBe(
        key,
      );
      expect(flattenRowText(entry)).toBe(formatCase.expected);
    });
  }

  it("filters rows to the last two exact turn groups", () => {
    const entries = [
      createLogEntry("Turn 1", { id: "t1", turnNumber: 1 }),
      createLogEntry("Turn 2", { id: "t2", turnNumber: 2 }),
      createLogEntry("Turn 3", { id: "t3", turnNumber: 3 }),
    ];

    expect(filterEntriesToLastTurns(entries, 2).map((entry) => entry.id)).toEqual(["t2", "t3"]);
  });

  const fallbackCases = Object.entries(FALLBACK_CASES).filter(
    ([moveId]) => moveId !== "undo",
  ) as Array<[MoveLogEntrySnapshot["moveId"], string]>;

  for (const [moveId, title] of fallbackCases) {
    it(`falls back for ${moveId}`, () => {
      const entry = createLogEntry(title, {
        actorSide: "playerTwo",
        id: `fallback-${moveId}`,
        moveId,
        turnNumber: 2,
      });

      const fallbackRow = buildEventLogRows([entry]).find(
        (
          row,
        ): row is Extract<ReturnType<typeof buildEventLogRows>[number], { kind: "event-row" }> =>
          row.kind === "event-row",
      );

      expect(fallbackRow?.source).toBe("fallback");
      expect(flattenRowText(entry).length).toBeGreaterThan(0);
    });
  }

  it("formats flat persisted play-card logs with card detail", () => {
    const playerOneId = "player_one" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "playCard",
        playerId: playerOneId,
        timestamp: 123,
        cardId: primaryCardId,
      },
      { moveId: "playCard" },
    );

    expect(flattenRowText(entry)).toBe("Played Ariel - On Human Legs.");
  });

  it("formats typed play-card target selections by naming the play effect", () => {
    const entry = createTypedEntry("lorcana.effect.resolve.targetSelection", {
      moveId: "resolveEffect",
      values: {
        playerId: "player_one",
        sourceCardId: "card-primary",
        targets: ["card-secondary"],
        effectType: "play-card",
      },
      expected: "Resolved Ariel - On Human Legs by playing Mickey Mouse - Detective.",
    });

    expect(flattenRowText(entry)).toBe(
      "Resolved Ariel - On Human Legs by playing Mickey Mouse - Detective.",
    );
  });

  it("formats flat persisted choice logs with the selected option label", () => {
    const playerOneId = "player_one" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "resolveEffect",
        playerId: playerOneId,
        timestamp: 123,
        sourceCardId: primaryCardId,
        resolution: {
          kind: "choiceSelection",
          choiceIndex: 1,
          choiceLabel: "Banish chosen damaged character.",
        },
      },
      { moveId: "resolveEffect" },
    );

    expect(flattenRowText(entry)).toBe(
      "Resolved Ariel - On Human Legs choosing Banish chosen damaged character.",
    );
  });

  it("hides no-op replay undo entries from the visible event rows", () => {
    const rows = buildEventLogRows([
      createLogEntry("Played Ariel", {
        id: "played",
        moveId: "playCard",
        turnNumber: 7,
      }),
      createLogEntry("", {
        id: "undo",
        moveId: "undo",
        turnNumber: 7,
      }),
    ]);

    const eventRows = rows.filter((row) => row.kind === "event-row");
    expect(eventRows.map((row) => row.id)).toEqual(["played"]);
  });

  it("formats flat persisted sing-card logs with cards put on bottom", () => {
    const playerOneId = "player_one" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const secondaryCardId = "card-secondary" as CardInstanceId;
    const tertiaryCardId = "card-tertiary" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "singCard",
        playerId: playerOneId,
        timestamp: 123,
        cardId: primaryCardId,
        singerIds: [secondaryCardId],
        outcomes: {
          cardsMovedToZone: [
            { cardId: secondaryCardId, zone: "deck-bottom" },
            { cardId: tertiaryCardId, zone: "deck-bottom" },
          ],
        },
      },
      { moveId: "playCard" },
    );

    expect(flattenRowText(entry)).toBe(
      "Played Ariel - On Human Legs by singing with Mickey Mouse - Detective. Put Mickey Mouse - Detective, Grumpy - Soreheaded Miner on the bottom of their deck(s).",
    );
  });

  it("formats flat persisted play-card logs with discarded cards before drawn cards", () => {
    const playerOneId = "player_one" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const secondaryCardId = "card-secondary" as CardInstanceId;
    const tertiaryCardId = "card-tertiary" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "playCard",
        playerId: playerOneId,
        timestamp: 123,
        cardId: primaryCardId,
        outcomes: {
          cardsDiscarded: [
            {
              playerId: playerOneId,
              amount: 2,
              detail: [secondaryCardId, tertiaryCardId],
            },
          ],
          cardsDrawn: [{ playerId: playerOneId, amount: 2 }],
        },
      },
      { moveId: "playCard" },
    );

    expect(flattenRowText(entry)).toBe(
      "Played Ariel - On Human Legs. You discarded 2 card(s): Mickey Mouse - Detective, Grumpy - Soreheaded Miner. Drew 2 card(s).",
    );
  });

  it("formats discarded outcomes with the discarding player instead of the move actor", () => {
    const playerOneId = "player_one" as PlayerId;
    const playerTwoId = "player_two" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const secondaryCardId = "card-secondary" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "playCard",
        playerId: playerOneId,
        timestamp: 123,
        cardId: primaryCardId,
        outcomes: {
          cardsDiscarded: [
            {
              playerId: playerTwoId,
              amount: 1,
              detail: [secondaryCardId],
            },
          ],
        },
      },
      { moveId: "playCard" },
    );

    expect(flattenRowText(entry)).toBe(
      "Played Ariel - On Human Legs. Opponent discarded 1 card(s): Mickey Mouse - Detective.",
    );
  });

  it("formats flat persisted play-card logs with grouped multi-target effect damage", () => {
    const playerOneId = "player_one" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const secondaryCardId = "card-secondary" as CardInstanceId;
    const tertiaryCardId = "card-tertiary" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "playCard",
        playerId: playerOneId,
        timestamp: 123,
        cardId: primaryCardId,
        outcomes: {
          damageDealt: [
            {
              sourceId: primaryCardId,
              targetId: secondaryCardId,
              amount: 2,
              kind: "effect",
            },
            {
              sourceId: primaryCardId,
              targetId: tertiaryCardId,
              amount: 2,
              kind: "effect",
            },
          ],
        },
      },
      { moveId: "playCard" },
    );

    expect(flattenRowText(entry)).toBe(
      "Played Ariel - On Human Legs, dealing 2 damage to Mickey Mouse - Detective and Grumpy - Soreheaded Miner.",
    );
  });

  it("formats flat persisted challenge logs with combat outcomes", () => {
    const playerOneId = "player_one" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const secondaryCardId = "card-secondary" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "challenge",
        playerId: playerOneId,
        timestamp: 123,
        attackerId: primaryCardId,
        defenderId: secondaryCardId,
        damage: { attacker: 3, defender: 2 },
        banished: [secondaryCardId],
      },
      { moveId: "challenge" },
    );

    expect(flattenRowText(entry)).toBe(
      "Challenged Mickey Mouse - Detective with Ariel - On Human Legs. Ariel - On Human Legs dealt 3 damage to Mickey Mouse - Detective. Mickey Mouse - Detective dealt 2 damage to Ariel - On Human Legs. Mickey Mouse - Detective was banished.",
    );
  });

  it("formats flat persisted effect-resolution logs with inline effect damage outcomes", () => {
    const playerOneId = "player_one" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const secondaryCardId = "card-secondary" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "resolveEffect",
        playerId: playerOneId,
        timestamp: 123,
        sourceCardId: primaryCardId,
        resolution: { kind: "optionalSelection", accepted: true },
        outcomes: {
          damageDealt: [
            {
              sourceId: primaryCardId,
              targetId: secondaryCardId,
              amount: 4,
              kind: "effect",
            },
          ],
        },
      },
      { moveId: "resolveEffect" },
    );

    expect(flattenRowText(entry)).toBe(
      "Resolved Ariel - On Human Legs by choosing yes, dealing 4 damage to Mickey Mouse - Detective.",
    );
  });

  it("formats play-card target selections by naming the play effect", () => {
    const playerOneId = "player_one" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const secondaryCardId = "card-secondary" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "resolveEffect",
        playerId: playerOneId,
        timestamp: 123,
        sourceCardId: primaryCardId,
        resolution: { kind: "targetSelection", targets: [secondaryCardId] },
        outcomes: {
          cardsMovedToZone: [{ cardId: secondaryCardId, zone: "play" }],
        },
      },
      { moveId: "resolveEffect" },
    );

    expect(flattenRowText(entry)).toBe(
      "Resolved Ariel - On Human Legs by playing Mickey Mouse - Detective.",
    );
  });

  it("formats flat persisted bag-resolution logs with inline effect damage outcomes", () => {
    const playerOneId = "player_one" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const secondaryCardId = "card-secondary" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "resolveBag",
        playerId: playerOneId,
        timestamp: 123,
        sourceCardId: primaryCardId,
        abilityName: "STEADY AIM",
        status: "completed",
        resolution: { kind: "noInput" },
        outcomes: {
          damageDealt: [
            {
              sourceId: primaryCardId,
              targetId: secondaryCardId,
              amount: 2,
              kind: "effect",
            },
          ],
        },
      },
      { moveId: "resolveBag" },
    );

    expect(flattenRowText(entry)).toBe(
      "Resolved STEADY AIM from Ariel - On Human Legs, dealing 2 damage to Mickey Mouse - Detective.",
    );
  });

  it("formats inline effect damage that banishes the damaged target", () => {
    const playerOneId = "player_one" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const secondaryCardId = "card-secondary" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "resolveBag",
        playerId: playerOneId,
        timestamp: 123,
        sourceCardId: primaryCardId,
        abilityName: "STEADY AIM",
        status: "completed",
        resolution: { kind: "noInput" },
        outcomes: {
          damageDealt: [
            {
              sourceId: primaryCardId,
              targetId: secondaryCardId,
              amount: 2,
              kind: "effect",
            },
          ],
          cardsBanished: [secondaryCardId],
        },
      },
      { moveId: "resolveBag" },
    );

    expect(flattenRowText(entry)).toBe(
      "Resolved STEADY AIM from Ariel - On Human Legs, dealing 2 damage to Mickey Mouse - Detective, banishing Mickey Mouse - Detective.",
    );
  });

  it("keeps unrelated banish outcomes separate from inline effect damage", () => {
    const playerOneId = "player_one" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const secondaryCardId = "card-secondary" as CardInstanceId;
    const tertiaryCardId = "card-tertiary" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "resolveBag",
        playerId: playerOneId,
        timestamp: 123,
        sourceCardId: primaryCardId,
        abilityName: "STEADY AIM",
        status: "completed",
        resolution: { kind: "noInput" },
        outcomes: {
          damageDealt: [
            {
              sourceId: primaryCardId,
              targetId: secondaryCardId,
              amount: 2,
              kind: "effect",
            },
          ],
          cardsBanished: [tertiaryCardId],
        },
      },
      { moveId: "resolveBag" },
    );

    expect(flattenRowText(entry)).toBe(
      "Resolved STEADY AIM from Ariel - On Human Legs. Grumpy - Soreheaded Miner was banished. Ariel - On Human Legs dealt 2 damage to Mickey Mouse - Detective.",
    );
  });

  it("formats flat persisted effect-resolution logs with grouped multi-target effect damage", () => {
    const playerOneId = "player_one" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const secondaryCardId = "card-secondary" as CardInstanceId;
    const tertiaryCardId = "card-tertiary" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "resolveEffect",
        playerId: playerOneId,
        timestamp: 123,
        sourceCardId: primaryCardId,
        resolution: { kind: "optionalSelection", accepted: true },
        outcomes: {
          damageDealt: [
            {
              sourceId: primaryCardId,
              targetId: secondaryCardId,
              amount: 2,
              kind: "effect",
            },
            {
              sourceId: primaryCardId,
              targetId: tertiaryCardId,
              amount: 2,
              kind: "effect",
            },
          ],
        },
      },
      { moveId: "resolveEffect" },
    );

    expect(flattenRowText(entry)).toBe(
      "Resolved Ariel - On Human Legs by choosing yes, dealing 2 damage to Mickey Mouse - Detective and Grumpy - Soreheaded Miner.",
    );
  });

  it("keeps mixed effect damage amounts as separate outcome sentences", () => {
    const playerOneId = "player_one" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const secondaryCardId = "card-secondary" as CardInstanceId;
    const tertiaryCardId = "card-tertiary" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "playCard",
        playerId: playerOneId,
        timestamp: 123,
        cardId: primaryCardId,
        outcomes: {
          damageDealt: [
            {
              sourceId: primaryCardId,
              targetId: secondaryCardId,
              amount: 2,
              kind: "effect",
            },
            {
              sourceId: primaryCardId,
              targetId: tertiaryCardId,
              amount: 1,
              kind: "effect",
            },
          ],
        },
      },
      { moveId: "playCard" },
    );

    expect(flattenRowText(entry)).toBe(
      "Played Ariel - On Human Legs. Ariel - On Human Legs dealt 2 damage to Mickey Mouse - Detective. Ariel - On Human Legs dealt 1 damage to Grumpy - Soreheaded Miner.",
    );
  });

  it("formats flat persisted alter-hand logs with scoped mulligan detail", () => {
    const playerOneId = "player_one" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const secondaryCardId = "card-secondary" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "alterHand",
        playerId: playerOneId,
        timestamp: 123,
        count: 2,
        mulliganed: createPrivateField([primaryCardId, secondaryCardId], [playerOneId]),
        drawn: createPrivateField([secondaryCardId, primaryCardId], [playerOneId]),
      },
      { moveId: "alterHand" },
    );

    expect(flattenRowText(entry)).toBe(
      "Altered 2 cards: Ariel - On Human Legs, Mickey Mouse - Detective. Drew Mickey Mouse - Detective, Ariel - On Human Legs.",
    );
  });

  it("does not render unsafe mulligan params when scoped detail is unavailable", () => {
    const playerOneId = "player_one" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const secondaryCardId = "card-secondary" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "alterHand",
        playerId: playerOneId,
        timestamp: 123,
        count: 2,
      },
      {
        moveId: "alterHand",
        params: { cardsToMulligan: [primaryCardId, secondaryCardId] },
      },
    );

    expect(flattenRowText(entry)).toBe("Altered 2 cards.");
  });

  it("flat shiftCard: resolves the shift target name from the static resolver", () => {
    const playerOneId = "player_one" as PlayerId;
    const primaryCardId = "card-primary" as CardInstanceId;
    const shiftTargetId = "t000014" as CardInstanceId;
    const entry = createFlatEntry(
      {
        type: "shiftCard",
        playerId: playerOneId,
        timestamp: 123,
        cardId: primaryCardId,
        shiftTargetId,
      },
      { moveId: "playCard" },
    );

    expect(formatEventLogBody(entry, "playerOne", undefined, createTestResolver()).text).toBe(
      "Played Ariel - On Human Legs by shifting onto Merlin - Shapeshifter.",
    );
  });

  it("renders manualMoveCard to a non-deck zone", () => {
    const entry = createLogEntry("Manual move to hand", {
      moveId: "manualMoveCard",
      playerId: "player_one",
      params: { cardId: "card-primary", targetZoneId: "hand:player_one" },
    });

    expect(flattenRowText(entry)).toBe("You — manually moved Ariel - On Human Legs to hand.");
  });

  it("renders manualMoveCard to deck top", () => {
    const entry = createLogEntry("Manual move to deck top", {
      moveId: "manualMoveCard",
      playerId: "player_one",
      params: {
        cardId: "card-primary",
        targetZoneId: "deck:player_one",
        position: "top",
      },
    });

    expect(flattenRowText(entry)).toBe(
      "You — manually moved Ariel - On Human Legs to top of deck.",
    );
  });

  it("renders manualMoveCard to deck bottom", () => {
    const entry = createLogEntry("Manual move to deck bottom", {
      moveId: "manualMoveCard",
      playerId: "player_one",
      params: {
        cardId: "card-primary",
        targetZoneId: "deck:player_one",
        position: "bottom",
      },
    });

    expect(flattenRowText(entry)).toBe(
      "You — manually moved Ariel - On Human Legs to bottom of deck.",
    );
  });

  it("renders manualMoveCard to deck without position as plain deck", () => {
    const entry = createLogEntry("Manual move to deck", {
      moveId: "manualMoveCard",
      playerId: "player_one",
      params: { cardId: "card-primary", targetZoneId: "deck:player_one" },
    });

    expect(flattenRowText(entry)).toBe("You — manually moved Ariel - On Human Legs to deck.");
  });
});

// ============================================================================
// buildActivityFeed
// ============================================================================

let chatIdCounter = 0;

function makePresetMsg(
  senderSeat: 1 | 2,
  createdAt: string,
  presetKey: ChatPresetKey = "good_luck",
): ChatMessage {
  return {
    id: `chat-${++chatIdCounter}`,
    matchId: "match-1",
    gameId: "game-1",
    senderPlayerId: `player_${senderSeat}`,
    senderSeat,
    kind: "preset",
    presetKey,
    createdAt,
    expiresAt: createdAt,
  };
}

function makeTextMsg(senderSeat: 1 | 2, createdAt: string, text: string): ChatMessage {
  return {
    id: `chat-${++chatIdCounter}`,
    matchId: "match-1",
    gameId: "game-1",
    senderPlayerId: `player_${senderSeat}`,
    senderSeat,
    kind: "text",
    text,
    createdAt,
    expiresAt: createdAt,
  };
}

describe("buildActivityFeed", () => {
  it("returns empty array for empty inputs", () => {
    expect(buildActivityFeed([], [])).toEqual([]);
  });

  it("returns same structure as groupEventLogRows for game entries only", () => {
    const entries = [
      createLogEntry("Play card", { turnNumber: 1, timestamp: 1000 }),
      createLogEntry("Pass turn", { turnNumber: 1, timestamp: 2000 }),
    ];
    const expected = groupEventLogRows(buildEventLogRows(entries, "playerOne"));
    const result = buildActivityFeed(entries, [], "playerOne");
    expect(result.map((g) => g.kind)).toEqual(expected.map((g) => g.kind));
  });

  it("converts chat messages to ChatFeedItems in chronological order when no game entries", () => {
    const msgs = [
      makePresetMsg(1, new Date(3000).toISOString()),
      makePresetMsg(2, new Date(1000).toISOString()),
      makePresetMsg(1, new Date(2000).toISOString()),
    ];

    const result = buildActivityFeed([], msgs);

    expect(result).toHaveLength(3);
    expect(result.every((g) => g.kind === "chat-message")).toBe(true);
    const epochs = result.map((g) => (g as { epochMs: number }).epochMs);
    expect(epochs).toEqual([1000, 2000, 3000]);
  });

  it("interleaves a chat message mid-turn at the correct position", () => {
    const t1000 = 1000;
    const t2000 = 2000;
    const t3000 = 3000;
    // Use different actor sides so they produce separate event-groups
    const entries = [
      createLogEntry("Event A", { actorSide: "playerOne", turnNumber: 1, timestamp: t1000 }),
      createLogEntry("Event B", { actorSide: "playerTwo", turnNumber: 1, timestamp: t3000 }),
    ];
    const msgs = [makePresetMsg(2, new Date(t2000).toISOString())];

    const result = buildActivityFeed(entries, msgs, "playerOne");
    const kinds = result.map((g) => g.kind);

    // Should be: turn-separator, event-group (t1000), chat-message (t2000), event-group (t3000)
    expect(kinds).toEqual(["turn-separator", "event-group", "chat-message", "event-group"]);
  });

  it("places a message with malformed createdAt at the tail instead of at epoch 0", () => {
    const entries = [
      createLogEntry("Event", { actorSide: "playerOne", turnNumber: 1, timestamp: 1000 }),
    ];
    const msgs = [makePresetMsg(1, "not-a-date")];

    const result = buildActivityFeed(entries, msgs, "playerOne");
    expect(result.at(-1)?.kind).toBe("chat-message");
  });

  it("preserves senderSeat on ChatFeedItems", () => {
    const msgs = [
      makePresetMsg(1, new Date(1000).toISOString()),
      makeTextMsg(2, new Date(2000).toISOString(), "hi"),
    ];
    const result = buildActivityFeed([], msgs);

    const chatItems = result.filter((g) => g.kind === "chat-message") as Array<{
      senderSeat: number;
    }>;
    expect(chatItems[0].senderSeat).toBe(1);
    expect(chatItems[1].senderSeat).toBe(2);
  });

  it("filters chat messages that pre-date the oldest visible game entry", () => {
    const entries = [
      createLogEntry("Event", { actorSide: "playerOne", turnNumber: 5, timestamp: 5000 }),
    ];
    // This message is from before the oldest visible turn — should be filtered out
    const oldMsg = makePresetMsg(2, new Date(1000).toISOString());
    const recentMsg = makePresetMsg(1, new Date(6000).toISOString());

    const result = buildActivityFeed(entries, [oldMsg, recentMsg], "playerOne");
    const chatItems = result.filter((g) => g.kind === "chat-message");
    expect(chatItems).toHaveLength(1);
    expect((chatItems[0] as { epochMs: number }).epochMs).toBe(6000);
  });
});
