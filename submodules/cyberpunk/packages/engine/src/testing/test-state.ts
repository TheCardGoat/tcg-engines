import { create } from "mutative";
import type { StructuredCardDefinition, CardZone } from "@tcg/cyberpunk-types";
import { cardBundle, structuredCards } from "@tcg/cyberpunk-cards";
import type { MatchState, DeckList, CardCatalog } from "../types/match-state.ts";
import type { CardInstance, CardMeta } from "../types/card-instance.ts";
import type { CardInstanceId, GigDieId, PlayerId } from "../types/branded.ts";
import { createPlayerId } from "../types/branded.ts";
import { DIE_MAX_VALUES } from "../types/gig-die.ts";
import { createMatchState } from "../state/initial-state.ts";
import {
  extractCard,
  isFixtureCardState,
  type PlayerFixture,
  type FixtureCardEntry,
  type FixtureCardState,
  type TestEngineOptions,
} from "./test-fixtures.ts";

export const P1 = createPlayerId("p1");
export const P2 = createPlayerId("p2");

const DEFAULT_DECK_SIZE = 40;

// ── Catalog & deck-list assembly ────────────────────────────────────────

function buildTestCatalog(extra?: StructuredCardDefinition[]): CardCatalog {
  const map = new Map<string, StructuredCardDefinition>(
    Object.entries(cardBundle) as [string, StructuredCardDefinition][],
  );
  for (const c of extra ?? []) map.set(c.id, c);
  return {
    get(id: string) {
      return map.get(id);
    },
    *entries() {
      for (const [k, v] of map) yield [k, v] as [string, StructuredCardDefinition];
    },
    get size() {
      return map.size;
    },
  };
}

function collectFixtureCards(fixture: PlayerFixture): StructuredCardDefinition[] {
  const cards: StructuredCardDefinition[] = [];
  const keys: (keyof PlayerFixture)[] = ["hand", "deck", "field", "trash", "legendArea"];
  for (const key of keys) {
    const entry = fixture[key];
    if (!entry || typeof entry === "number") continue;
    for (const item of entry as FixtureCardEntry[]) {
      cards.push(extractCard(item));
      if (isFixtureCardState(item)) {
        cards.push(...(item.attachedGears ?? []));
      }
    }
  }
  return cards;
}

function getExplicitLegendIds(fixture: PlayerFixture): Set<string> {
  return new Set(
    collectFixtureCards(fixture)
      .filter((c) => c.type === "legend")
      .map((c) => c.id),
  );
}

function buildDeckList(
  playerId: string,
  fixture: PlayerFixture,
  crossPlayerExcludedIds: Set<string> = new Set(),
): DeckList {
  const legends = structuredCards.filter((c) => c.type === "legend");
  const nonLegends = structuredCards.filter((c) => c.type !== "legend");

  const fixtureLegendAreaCards: StructuredCardDefinition[] =
    fixture.legendArea && typeof fixture.legendArea !== "number"
      ? (fixture.legendArea as FixtureCardEntry[]).map(extractCard)
      : [];

  const fixtureDeckCards: StructuredCardDefinition[] =
    fixture.deck && typeof fixture.deck !== "number"
      ? (fixture.deck as FixtureCardEntry[]).map(extractCard)
      : [];

  const fixtureHandCards: StructuredCardDefinition[] =
    fixture.hand && typeof fixture.hand !== "number"
      ? (fixture.hand as FixtureCardEntry[]).map(extractCard)
      : [];

  const fixtureFieldCards: StructuredCardDefinition[] =
    fixture.field && typeof fixture.field !== "number"
      ? (fixture.field as FixtureCardEntry[]).map(extractCard)
      : [];

  const fixtureTrashCards: StructuredCardDefinition[] =
    fixture.trash && typeof fixture.trash !== "number"
      ? (fixture.trash as FixtureCardEntry[]).map(extractCard)
      : [];
  const fixtureAttachedGearCards = collectAttachedGearCards(fixture);

  // Legend-typed cards placed directly in non-legendArea zones (field, hand,
  // deck, trash) must still appear in `legendIds` so their instances are
  // created — `applyFixture` will then move them into the requested zone.
  const fixtureOtherZoneLegends: StructuredCardDefinition[] = [];
  const legendAreaIds = new Set(fixtureLegendAreaCards.map((c) => c.id));
  for (const card of [
    ...fixtureDeckCards,
    ...fixtureHandCards,
    ...fixtureFieldCards,
    ...fixtureTrashCards,
  ]) {
    if (card.type === "legend" && !legendAreaIds.has(card.id)) {
      fixtureOtherZoneLegends.push(card);
      legendAreaIds.add(card.id);
    }
  }

  const fixtureLegendCards = [...fixtureLegendAreaCards, ...fixtureOtherZoneLegends];

  const allFixtureCards = [
    ...fixtureLegendCards,
    ...fixtureDeckCards,
    ...fixtureHandCards,
    ...fixtureFieldCards,
    ...fixtureTrashCards,
    ...fixtureAttachedGearCards,
  ];

  const usedIds = new Set(allFixtureCards.map((c) => c.id));

  const legendIds =
    fixtureLegendCards.length >= 3
      ? fixtureLegendCards.slice(0, 3).map((c) => c.id)
      : [
          ...fixtureLegendCards.map((c) => c.id),
          ...legends
            .filter((c) => !usedIds.has(c.id) && !crossPlayerExcludedIds.has(c.id))
            .slice(0, 3 - fixtureLegendCards.length)
            .map((c) => c.id),
        ];

  if (legendIds.length < 3) {
    throw new Error(
      `Not enough legend cards for player ${playerId}. Need 3, have ${legendIds.length}.`,
    );
  }

  const mainDeckIds = allFixtureCards.filter((c) => c.type !== "legend").map((c) => c.id);

  const deckCount = typeof fixture.deck === "number" ? fixture.deck : DEFAULT_DECK_SIZE;
  const needed = deckCount - mainDeckIds.length;

  if (needed > 0) {
    const filler = nonLegends.filter((c) => !usedIds.has(c.id)).slice(0, needed);
    for (const c of filler) mainDeckIds.push(c.id);
  }

  return {
    playerId,
    playerName: `Player ${playerId}`,
    legends: legendIds,
    mainDeck: mainDeckIds,
  };
}

function collectAttachedGearCards(fixture: PlayerFixture): StructuredCardDefinition[] {
  const cards: StructuredCardDefinition[] = [];
  const keys: (keyof PlayerFixture)[] = ["hand", "deck", "field", "trash", "legendArea"];
  for (const key of keys) {
    const entry = fixture[key];
    if (!entry || typeof entry === "number") continue;
    for (const item of entry as FixtureCardEntry[]) {
      if (isFixtureCardState(item)) {
        cards.push(...(item.attachedGears ?? []));
      }
    }
  }
  return cards;
}

// ── Fixture application ─────────────────────────────────────────────────

interface InstanceMapping {
  instanceId: CardInstanceId;
  definitionId: string;
  playerId: string;
}

function buildMappings(state: MatchState): InstanceMapping[] {
  const mappings: InstanceMapping[] = [];
  for (const [pid, player] of Object.entries(state.G.players)) {
    if (!player) continue;
    for (const cardIds of Object.values(player.zones)) {
      for (const id of cardIds) {
        const inst = state.G.cardIndex[id as string];
        if (inst) {
          mappings.push({
            instanceId: inst.instanceId,
            definitionId: inst.definitionId,
            playerId: pid,
          });
        }
      }
    }
  }
  return mappings;
}

function applyFixture(
  state: MatchState,
  p1Fixture: PlayerFixture,
  p2Fixture: PlayerFixture,
  mappings: InstanceMapping[],
  skipSetup: boolean,
  activePlayerId: PlayerId,
  gamePhase: MatchState["G"]["gamePhase"],
  overtime: boolean,
): MatchState {
  const usedMappings = new Set<number>();

  return create(state, (draft) => {
    if (skipSetup) {
      resetOpeningHand(draft);
    }

    applyPlayerFixture(draft, "p1", p1Fixture, mappings, usedMappings);
    applyPlayerFixture(draft, "p2", p2Fixture, mappings, usedMappings);

    if (p1Fixture.eddies !== undefined) {
      draft.G.players["p1"]!.eddies = p1Fixture.eddies;
    }
    if (p2Fixture.eddies !== undefined) {
      draft.G.players["p2"]!.eddies = p2Fixture.eddies;
    }

    applyGigFixtures(draft, p1Fixture, p2Fixture);
    applyFixerDiceFixtures(draft, p1Fixture, p2Fixture);
    if (overtime) {
      applyOvertimeFixture(draft);
    }

    if (skipSetup) {
      draft.G.gamePhase = gamePhase;
      for (const pid of Object.keys(draft.G.players)) {
        const p = draft.G.players[pid];
        if (p) {
          p.soldThisTurn = false;
          p.calledLegendThisTurn = false;
          p.calledLegendThisRivalTurn = false;
          for (const legId of p.zones["legendArea"] ?? []) {
            const card = draft.G.cardIndex[legId as string];
            if (card && card.zone === "legendArea") card.meta.spent = false;
          }
        }
      }
      configureFixtureTurnState(draft, activePlayerId);
    }
  });
}

function applyOvertimeFixture(draft: MatchState): void {
  draft.G.overtime = true;
  draft.G.turnMetadata.overtimeActive = true;
  draft.G.turnMetadata.previousTurnNoGigTaken = true;
  draft.G.turnMetadata.gigTakenThisTurn = false;
  draft.G.turnMetadata.pendingChoice = undefined;

  for (const pid of draft.ctx.playerIds) {
    const player = draft.G.players[pid as string];
    if (player) {
      player.fixerArea = [];
    }
  }
}

function applyFixerDiceFixtures(
  draft: MatchState,
  p1Fixture: PlayerFixture,
  p2Fixture: PlayerFixture,
): void {
  for (const [pid, fixture] of [
    ["p1", p1Fixture],
    ["p2", p2Fixture],
  ] as const) {
    if (fixture.fixerDice === undefined) continue;

    const player = draft.G.players[pid];
    if (!player) continue;

    const kept: GigDieId[] = [];
    const available = [...player.fixerArea];
    for (const dieType of fixture.fixerDice) {
      const index = available.findIndex(
        (dieId) => draft.G.gigDice[dieId as string]?.dieType === dieType,
      );
      if (index === -1) continue;
      const [dieId] = available.splice(index, 1);
      if (dieId) {
        kept.push(dieId);
      }
    }
    if (fixture.gigArea === undefined) {
      for (const dieId of available) {
        const die = draft.G.gigDice[dieId as string];
        if (die) {
          die.faceValue = 1;
          die.location = "gigArea";
          die.ownerId = createPlayerId(pid);
        }
        player.gigArea.push(dieId);
      }
    }
    player.fixerArea = kept;
  }
}

function resetOpeningHand(draft: MatchState): void {
  for (const pid of draft.ctx.playerIds) {
    const player = draft.G.players[pid as string];
    if (!player) continue;

    for (const cardId of player.zones.hand) {
      const card = draft.G.cardIndex[cardId as string];
      if (card) {
        card.zone = "deck";
      }
      player.zones.deck.unshift(cardId);
    }
    player.zones.hand = [];

    for (const legendId of player.zones.legendArea) {
      const legend = draft.G.cardIndex[legendId as string];
      if (legend) {
        legend.meta.spent = false;
      }
    }
  }
}

function applyGigFixtures(
  draft: MatchState,
  p1Fixture: PlayerFixture,
  p2Fixture: PlayerFixture,
): void {
  for (const [pid, fixture] of [
    ["p1", p1Fixture],
    ["p2", p2Fixture],
  ] as const) {
    if (!fixture.gigArea?.length) continue;
    for (const entry of fixture.gigArea) {
      const maxFace = DIE_MAX_VALUES[entry.dieType];
      if (!Number.isInteger(entry.faceValue) || entry.faceValue < 1 || entry.faceValue > maxFace) {
        warnFixture(
          `${pid} fixture sets ${entry.dieType} to invalid face value ${entry.faceValue}; expected 1-${maxFace}.`,
        );
      }

      const sourcePid = resolveGigFixtureSourcePlayerId(draft, pid, entry.source);
      const sourcePlayer = draft.G.players[sourcePid]!;
      const dieIdx = sourcePlayer.fixerArea.findIndex((dieId) => {
        const die = draft.G.gigDice[dieId as string];
        return die?.dieType === entry.dieType;
      });
      if (dieIdx === -1) {
        const sourceLabel = entry.source === "rival" ? "rival " : "";
        warnFixture(
          `${pid} fixture requested ${sourceLabel}${entry.dieType}, but no matching fixer die exists.`,
        );
        continue;
      }
      moveFixerDieToGigArea(draft, sourcePid, dieIdx, entry.faceValue, pid);
    }
  }
}

function configureFixtureTurnState(draft: MatchState, activePlayerId: PlayerId): void {
  for (const pid of ["p1", "p2"] as const) {
    warnIfD20ClaimedBeforeLast(draft, pid);
  }

  draft.G.turnMetadata.pendingChoice = undefined;
  draft.G.turnMetadata.activePlayerId = activePlayerId;
  const activePlayer = draft.G.players[activePlayerId as string];
  draft.G.turnMetadata.gigTakenThisTurn = Boolean(activePlayer?.fixerArea.length);
  for (const pid of draft.ctx.playerIds) {
    const player = draft.G.players[pid as string];
    if (player) {
      player.firstPlayer = pid === activePlayerId;
    }
  }
}

function moveFixerDieToGigArea(
  draft: MatchState,
  playerId: string,
  fixerIndex: number,
  faceValue: number,
  toPlayerId = playerId,
): void {
  const player = draft.G.players[playerId]!;
  const dieId = player.fixerArea[fixerIndex]!;
  player.fixerArea.splice(fixerIndex, 1);
  const die = draft.G.gigDice[dieId as string]!;
  die.faceValue = faceValue;
  die.location = "gigArea";
  die.ownerId = createPlayerId(toPlayerId);
  draft.G.players[toPlayerId]!.gigArea.push(dieId);
}

function resolveGigFixtureSourcePlayerId(
  draft: MatchState,
  playerId: "p1" | "p2",
  source: "self" | "rival" | undefined,
): "p1" | "p2" {
  if (!source || source === "self") return playerId;
  return (draft.ctx.playerIds.find((id) => id !== playerId) ?? P2) as "p1" | "p2";
}

function warnIfD20ClaimedBeforeLast(draft: MatchState, playerId: "p1" | "p2"): void {
  const player = draft.G.players[playerId];
  if (!player) return;
  const hasClaimedD20 = player.gigArea.some((dieId) => {
    const die = draft.G.gigDice[dieId as string];
    return die?.dieType === "d20";
  });
  if (!hasClaimedD20) return;

  const remainingNonD20 = player.fixerArea.some((dieId) => {
    const die = draft.G.gigDice[dieId as string];
    return die && die.dieType !== "d20";
  });
  if (remainingNonD20) {
    warnFixture(`${playerId} fixture claims d20 before all non-d20 fixer dice are gone.`);
  }
}

function warnFixture(message: string): void {
  console.warn(`[fixture] ${message}`);
}

function applyPlayerFixture(
  draft: MatchState,
  playerId: string,
  fixture: PlayerFixture,
  mappings: InstanceMapping[],
  usedMappings: Set<number>,
): void {
  const player = draft.G.players[playerId];
  if (!player) return;

  const zones: { key: keyof PlayerFixture; zone: CardZone }[] = [
    { key: "hand", zone: "hand" },
    { key: "field", zone: "field" },
    { key: "trash", zone: "trash" },
    { key: "legendArea", zone: "legendArea" },
  ];

  for (const { key, zone } of zones) {
    const entry = fixture[key];
    if (!entry || typeof entry === "number") continue;

    const items = entry as FixtureCardEntry[];
    const zoneCards: CardInstanceId[] = [];
    const attachedZoneCards: CardInstanceId[] = [];

    for (const item of items) {
      const def = extractCard(item);

      let mappingIdx = mappings.findIndex(
        (m, i) => m.definitionId === def.id && m.playerId === playerId && !usedMappings.has(i),
      );

      if (mappingIdx === -1) {
        mappingIdx = mappings.findIndex(
          (m, i) => m.definitionId === def.id && !usedMappings.has(i),
        );
      }

      if (mappingIdx !== -1) {
        usedMappings.add(mappingIdx);
        const mapping = mappings[mappingIdx]!;
        zoneCards.push(mapping.instanceId);
        for (const z of Object.keys(player.zones)) {
          const arr = player.zones[z as CardZone];
          if (arr) {
            const idx = arr.indexOf(mapping.instanceId);
            if (idx !== -1) arr.splice(idx, 1);
          }
        }
        const cardInst = draft.G.cardIndex[mapping.instanceId as string];
        if (cardInst) {
          cardInst.zone = zone;
          if (isFixtureCardState(item)) {
            const state = item as FixtureCardState;
            applyFixtureCardMeta(cardInst.meta, state);
            for (const gear of state.attachedGears ?? []) {
              const gearMappingIdx = mappings.findIndex(
                (m, i) =>
                  m.definitionId === gear.id && m.playerId === playerId && !usedMappings.has(i),
              );
              if (gearMappingIdx === -1) continue;

              usedMappings.add(gearMappingIdx);
              const gearMapping = mappings[gearMappingIdx]!;
              attachedZoneCards.push(gearMapping.instanceId);
              for (const z of Object.keys(player.zones)) {
                const arr = player.zones[z as CardZone];
                if (arr) {
                  const idx = arr.indexOf(gearMapping.instanceId);
                  if (idx !== -1) arr.splice(idx, 1);
                }
              }

              const gearInst = draft.G.cardIndex[gearMapping.instanceId as string];
              if (gearInst) {
                gearInst.zone = zone;
                gearInst.meta.attachedToId = mapping.instanceId;
                if (!cardInst.meta.attachedGearIds.includes(gearMapping.instanceId)) {
                  cardInst.meta.attachedGearIds.push(gearMapping.instanceId);
                }
              }
            }
          }
        }
      }
    }

    const orderedZoneCards = [...zoneCards, ...attachedZoneCards];
    const prev = player.zones[zone];
    const kept = new Set(orderedZoneCards.map((id) => id as string));
    for (const id of prev) {
      if (!kept.has(id as string)) {
        const card = draft.G.cardIndex[id as string];
        if (card) {
          card.zone = "deck";
          player.zones.deck.push(id);
        }
      }
    }

    player.zones[zone] = orderedZoneCards;
  }
}

function applyFixtureCardMeta(meta: CardMeta, state: FixtureCardState): void {
  if (state.spent !== undefined) meta.spent = state.spent;
  if (state.faceDown !== undefined) meta.faceDown = state.faceDown;
  if (state.damage !== undefined) meta.damage = state.damage;
  if (state.powerModifier !== undefined) meta.powerModifier = state.powerModifier;
  if (state.playedThisTurn !== undefined) meta.playedThisTurn = state.playedThisTurn;
  if (state.hasAttackedThisTurn !== undefined) meta.hasAttackedThisTurn = state.hasAttackedThisTurn;
  if (state.counters !== undefined) meta.counters = state.counters;
  if (state.attachedGearIds !== undefined)
    meta.attachedGearIds = state.attachedGearIds as CardInstanceId[];
}

// ── Public test helper ──────────────────────────────────────────────────

/**
 * Build a {@link MatchState} for tests / fixtures without instantiating
 * `CyberpunkTestEngine`. Wraps the production {@link createMatchState} and
 * stamps fixture data (zones, eddies, gig dice, card meta) on top.
 *
 * Differences from production setup:
 * - Decks + legends are auto-filled from the card catalog if a fixture under-
 *   specifies them. `deck: 40` produces a 40-card deck of filler cards.
 * - When `opts.skipSetup` is true (the default), the result lands in the
 *   requested fixture phase, defaulting to `play`. Setup-only preparation such
 *   as opening-hand draws and first-player spent legends is cleared, so the
 *   fixture's hand, deck, and Gig areas are literal.
 *
 * @param p1   Player 1 fixture. Empty `{}` for a vanilla setup.
 * @param p2   Player 2 fixture. Defaults to a 40-card vanilla deck.
 * @param opts `seed` (default `"test"`), `skipSetup` (default `true`), and
 *   `activePlayerId` (default `P1` for skipped-setup fixtures).
 */
export function createTestMatchState(
  p1: PlayerFixture,
  p2?: PlayerFixture,
  opts?: TestEngineOptions,
): MatchState {
  // Determinism: an unspecified seed maps to the stable `"test"` sentinel
  // so two calls to `createTestMatchState(p1, p2)` with no opts produce the
  // same shuffle, first-player choice, and gig rolls. Unit tests that need a
  // distinct deck order pass their own seed (see flow/*.test.ts).
  const seed = opts?.seed ?? "test";
  const skipSetup = opts?.skipSetup ?? true;
  const activePlayerId = opts?.activePlayerId ?? P1;
  const gamePhase = opts?.gamePhase ?? "main";
  const overtime = opts?.overtime ?? opts?.overTime ?? false;

  const p1Fixture = p1;
  const p2Fixture = p2 ?? { deck: DEFAULT_DECK_SIZE };

  const allFixtureCards = [...collectFixtureCards(p1Fixture), ...collectFixtureCards(p2Fixture)];
  const catalog = buildTestCatalog(allFixtureCards);

  // Pre-compute each player's explicit legend requests so fillers don't
  // duplicate a card the other player explicitly placed in a zone.
  const p2ExplicitLegends = getExplicitLegendIds(p2Fixture);
  const d1 = buildDeckList("p1", p1Fixture, p2ExplicitLegends);
  const d2 = buildDeckList("p2", p2Fixture, new Set(d1.legends));

  const state = createMatchState({
    players: [
      { id: P1, name: "Player 1" },
      { id: P2, name: "Player 2" },
    ],
    catalog,
    deckLists: [d1, d2],
    seed,
    timeControl: opts?.timeControl,
  });

  const mappings = buildMappings(state);
  return applyFixture(
    state,
    p1Fixture,
    p2Fixture,
    mappings,
    skipSetup,
    activePlayerId,
    gamePhase,
    overtime,
  );
}

// Re-exports for the test engine class to consume internals without
// duplicating logic.
export const _internals = {
  buildTestCatalog,
  collectFixtureCards,
  getExplicitLegendIds,
  buildDeckList,
  buildMappings,
  applyFixture,
};

export type { CardInstance };
