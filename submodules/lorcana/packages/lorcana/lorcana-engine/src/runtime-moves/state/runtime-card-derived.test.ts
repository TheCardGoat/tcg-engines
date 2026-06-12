import { describe, expect, it } from "bun:test";
import {
  createCardId,
  createInitialTCGCtx,
  createPlayerId,
  createRecordCardCatalog,
  createRecordCardInstanceRegistry,
  type MatchState,
  type RuntimeCardWithDefinition,
} from "#core";
import type { LorcanaCard, LocationCard } from "@tcg/lorcana-types";
import { createCardI18n } from "../../card-i18n";
import { createMockCharacter } from "../../testing";
import { createInitialLorcanaG, type LorcanaCardMeta, type LorcanaG } from "../../types";
import type { StatModifierContinuousEffectInstance } from "../../types";
import type { LorcanaCardDerived } from "../../types/projected-board";
import { createLorcanaRuntimeCardDeriver } from "./runtime-card-derived";
import type { StaticEffectRegistry } from "../../rules/static-effect-registry";

const EMPTY_REGISTRY: StaticEffectRegistry = {
  byTarget: new Map(),
  byPlayer: new Map(),
  global: [],
  bySource: new Map(),
};

const PLAYER_ONE = createPlayerId("p1");
const PLAYER_TWO = createPlayerId("p2");
const CARD_ONE = createCardId("c1");

function buildState(): MatchState {
  const ctx = createInitialTCGCtx({
    matchID: "derived-runtime-card-test",
    gameID: "lorcana",
    rulesetHash: "ruleset-derived-test",
  });
  ctx.priority.holder = PLAYER_ONE;
  const handZone = `hand:${PLAYER_ONE}`;
  if (!ctx.zones.private.zoneCards[handZone]) {
    ctx.zones.private.zoneCards[handZone] = [];
  }
  ctx.zones.private.zoneCards[handZone] = [CARD_ONE];
  ctx.zones.private.cardIndex[CARD_ONE] = {
    zoneKey: handZone,
    index: 0,
    ownerID: PLAYER_ONE,
    controllerID: PLAYER_ONE,
  };
  return {
    G: createInitialLorcanaG(PLAYER_ONE, PLAYER_TWO),
    ctx,
  };
}

function buildRuntimeCard(card: LorcanaCard, overrides?: Partial<RuntimeCardWithDefinition>) {
  return {
    instanceId: CARD_ONE,
    definitionId: card.id,
    definition: card,
    ownerID: PLAYER_ONE,
    controllerID: PLAYER_ONE,
    zoneID: `hand:${PLAYER_ONE}`,
    zoneIndex: 0,
    meta: {},
    ...overrides,
  } satisfies RuntimeCardWithDefinition;
}

function buildStaticResources(card: LorcanaCard) {
  return {
    cards: createRecordCardCatalog("lorcana-cards:test", {
      [card.id]: card,
    }),
    instances: createRecordCardInstanceRegistry("lorcana-instances:test", {
      [CARD_ONE]: {
        instanceId: CARD_ONE,
        definitionId: card.id,
        ownerID: PLAYER_ONE,
      },
    }),
    zoneDefinitions: {},
  };
}

function deriveLorcana(
  deriver: ReturnType<typeof createLorcanaRuntimeCardDeriver>,
  args: Parameters<ReturnType<typeof createLorcanaRuntimeCardDeriver>>[0],
): LorcanaCardDerived {
  return deriver(args) as unknown as LorcanaCardDerived;
}

describe("runtime-card-derived", () => {
  it("computes canBePutInInkwell for legal and illegal v1 cases", () => {
    const card = createMockCharacter({
      id: "inkable-character",
      name: "Inkable Character",
      cost: 1,
      strength: 3,
      willpower: 5,
    });
    const state = buildState();
    const staticResources = buildStaticResources(card);
    const deriver = createLorcanaRuntimeCardDeriver(EMPTY_REGISTRY);

    const legalCard = buildRuntimeCard(card);
    const legal = deriveLorcana(deriver, {
      cardId: legalCard.instanceId,
      card: legalCard,
      actorPlayerId: PLAYER_ONE,
      state,
      staticResources,
    });
    expect(legal.canBePutInInkwell).toBe(true);

    const wrongOwnerCard = buildRuntimeCard(card, { ownerID: PLAYER_TWO });
    const wrongOwner = deriveLorcana(deriver, {
      cardId: wrongOwnerCard.instanceId,
      card: wrongOwnerCard,
      actorPlayerId: PLAYER_ONE,
      state,
      staticResources,
    });
    expect(wrongOwner.canBePutInInkwell).toBe(false);

    const wrongZoneCard = buildRuntimeCard(card, { zoneID: "play:p1" });
    const wrongZone = deriveLorcana(deriver, {
      cardId: wrongZoneCard.instanceId,
      card: wrongZoneCard,
      actorPlayerId: PLAYER_ONE,
      state,
      staticResources,
    });
    expect(wrongZone.canBePutInInkwell).toBe(false);

    const nonInkableCard: LorcanaCard = {
      ...createMockCharacter({
        id: "non-inkable-character",
        name: "Non Inkable Character",
        cost: 1,
        strength: 3,
        willpower: 5,
      }),
      inkable: false,
    };
    const nonInkableRuntime = buildRuntimeCard(nonInkableCard);
    const nonInkable = deriveLorcana(deriver, {
      cardId: nonInkableRuntime.instanceId,
      card: nonInkableRuntime,
      actorPlayerId: PLAYER_ONE,
      state,
      staticResources: buildStaticResources(nonInkableCard),
    });
    expect(nonInkable.canBePutInInkwell).toBe(false);

    const stateAfterInk = buildState();
    stateAfterInk.G.turnMetadata.inkedThisTurn.push(createCardId("already-inked-card"));
    const overLimit = deriveLorcana(deriver, {
      cardId: legalCard.instanceId,
      card: legalCard,
      actorPlayerId: PLAYER_ONE,
      state: stateAfterInk,
      staticResources,
    });
    expect(overLimit.canBePutInInkwell).toBe(false);
  });

  it("returns baseline strength and willpower for characters", () => {
    const card = createMockCharacter({
      id: "stat-character",
      name: "Stat Character",
      cost: 1,
      strength: 4,
      willpower: 6,
    });
    const state = buildState();
    const runtimeCard = buildRuntimeCard(card);
    const derived = deriveLorcana(createLorcanaRuntimeCardDeriver(EMPTY_REGISTRY), {
      cardId: runtimeCard.instanceId,
      card: runtimeCard,
      actorPlayerId: PLAYER_ONE,
      state,
      staticResources: buildStaticResources(card),
    });

    expect(derived.strength).toBe(4);
    expect(derived.willpower).toBe(6);
    expect(derived.fullName).toBe("Stat Character");
    expect(derived.keywords).toEqual([]);
  });

  it("derives full name and keyword list from card definition", () => {
    const card: LorcanaCard = {
      ...createMockCharacter({
        id: "keyword-character",
        name: "Keyword Character",
        cost: 2,
      }),
      version: "Bold Striker",
      abilities: [
        {
          id: "keyword-character-rush",
          type: "keyword",
          keyword: "Rush",
          text: "Rush",
        },
      ],
    };
    const state = buildState();
    const runtimeCard = buildRuntimeCard(card);
    const derived = deriveLorcana(createLorcanaRuntimeCardDeriver(EMPTY_REGISTRY), {
      cardId: runtimeCard.instanceId,
      card: runtimeCard,
      actorPlayerId: PLAYER_ONE,
      state,
      staticResources: buildStaticResources(card),
    });

    expect(derived.fullName).toBe("Keyword Character - Bold Striker");
    expect(derived.keywords).toEqual(["Rush"]);
  });

  it("derives printed and payable Shift costs from current state", () => {
    const card: LorcanaCard = {
      ...createMockCharacter({
        id: "shift-derived-character",
        name: "Shifted Hero",
        cost: 6,
        strength: 4,
        willpower: 5,
        lore: 2,
      }),
      abilities: [
        {
          id: "shift-derived-character-shift",
          type: "keyword",
          keyword: "Shift",
          text: "Shift 4",
          cost: { ink: 4 },
        },
      ],
    };
    const state = buildState();
    state.G.turnMetadata.pendingCostReductionsByPlayer[PLAYER_ONE] = [
      {
        amount: 1,
        cardType: "character",
        expiresAtTurn: state.ctx.status.turn ?? 1,
        consumeOnUse: true,
      },
    ];
    const runtimeCard = buildRuntimeCard(card);
    const derived = deriveLorcana(createLorcanaRuntimeCardDeriver(EMPTY_REGISTRY), {
      cardId: runtimeCard.instanceId,
      card: runtimeCard,
      actorPlayerId: PLAYER_ONE,
      state,
      staticResources: buildStaticResources(card),
    });

    expect(derived.shiftInkCost).toBe(4);
    expect(derived.shiftPlayCost).toBe(3);
    expect(derived.playCost).toBe(5);
  });

  it("applies active continuous modifiers to character strength and willpower", () => {
    const card = createMockCharacter({
      id: "stat-character-with-modifiers",
      name: "Stat Character With Modifiers",
      cost: 1,
      strength: 4,
      willpower: 6,
    });
    const state = buildState();
    const handZone = `hand:${PLAYER_ONE}`;
    const playZone = `play:${PLAYER_ONE}`;
    state.ctx.zones.private.zoneCards[handZone] = [];
    state.ctx.zones.private.zoneCards[playZone] = [CARD_ONE];
    state.ctx.zones.private.cardIndex[CARD_ONE] = {
      zoneKey: playZone,
      index: 0,
      ownerID: PLAYER_ONE,
      controllerID: PLAYER_ONE,
    };
    const ce1: StatModifierContinuousEffectInstance = {
      id: "ce_1",
      kind: "stat-modifier",
      sourceId: createCardId("effect-source-1"),
      targetId: CARD_ONE,
      stat: "strength",
      modifier: 2,
      duration: "this-turn",
      createdAtTurn: 1,
      expiresAtTurn: 1,
    };
    const ce2: StatModifierContinuousEffectInstance = {
      id: "ce_2",
      kind: "stat-modifier",
      sourceId: createCardId("effect-source-2"),
      targetId: CARD_ONE,
      stat: "willpower",
      modifier: -3,
      duration: "this-turn",
      createdAtTurn: 1,
      expiresAtTurn: 1,
    };
    state.G.continuousEffects.instances.push(ce1, ce2);
    state.G.continuousEffects.byTarget[CARD_ONE] = [ce1, ce2];

    const runtimeCard = buildRuntimeCard(card, { zoneID: playZone });
    const derived = deriveLorcana(createLorcanaRuntimeCardDeriver(EMPTY_REGISTRY), {
      cardId: runtimeCard.instanceId,
      card: runtimeCard,
      actorPlayerId: PLAYER_ONE,
      state,
      staticResources: buildStaticResources(card),
    });

    expect(derived.strength).toBe(6);
    expect(derived.willpower).toBe(3);
  });

  it("returns willpower for locations with valid willpower", () => {
    const locationCard: LocationCard = {
      id: "location-with-willpower",
      canonicalId: "ci_location-with-willpower",
      cardType: "location",
      name: "Test Location",
      cost: 3,
      moveCost: 1,
      lore: 2,
      willpower: 8,
      inkType: ["amber"],
      inkable: true,
      set: "TST",
      rarity: "common",
      abilities: [],
    } as unknown as LocationCard;

    const state = buildState();
    const runtimeCard = buildRuntimeCard(locationCard);
    const derived = deriveLorcana(createLorcanaRuntimeCardDeriver(EMPTY_REGISTRY), {
      cardId: runtimeCard.instanceId,
      card: runtimeCard,
      actorPlayerId: PLAYER_ONE,
      state,
      staticResources: buildStaticResources(locationCard),
    });

    expect(derived.strength).toBe(0); // Locations have no strength
    expect(derived.willpower).toBe(8);
  });

  it("applies location willpower modifiers and clamps at zero", () => {
    const locationCard: LocationCard = {
      id: "location-with-modifier",
      canonicalId: "ci_location-with-modifier",
      cardType: "location",
      name: "Modifier Location",
      cost: 3,
      moveCost: 1,
      lore: 2,
      willpower: 8,
      inkType: ["amber"],
      inkable: true,
      set: "TST",
      rarity: "common",
      abilities: [],
    } as unknown as LocationCard;

    const state = buildState();
    const handZone = `hand:${PLAYER_ONE}`;
    const playZone = `play:${PLAYER_ONE}`;
    state.ctx.zones.private.zoneCards[handZone] = [];
    state.ctx.zones.private.zoneCards[playZone] = [CARD_ONE];
    state.ctx.zones.private.cardIndex[CARD_ONE] = {
      zoneKey: playZone,
      index: 0,
      ownerID: PLAYER_ONE,
      controllerID: PLAYER_ONE,
    };
    const ce3: StatModifierContinuousEffectInstance = {
      id: "ce_3",
      kind: "stat-modifier",
      sourceId: createCardId("effect-source-3"),
      targetId: CARD_ONE,
      stat: "willpower",
      modifier: -10,
      duration: "this-turn",
      createdAtTurn: 1,
      expiresAtTurn: 1,
    };
    state.G.continuousEffects.instances.push(ce3);
    state.G.continuousEffects.byTarget[CARD_ONE] = [ce3];

    const runtimeCard = buildRuntimeCard(locationCard, { zoneID: playZone });
    const derived = deriveLorcana(createLorcanaRuntimeCardDeriver(EMPTY_REGISTRY), {
      cardId: runtimeCard.instanceId,
      card: runtimeCard,
      actorPlayerId: PLAYER_ONE,
      state,
      staticResources: buildStaticResources(locationCard),
    });

    expect(derived.strength).toBe(0);
    expect(derived.willpower).toBe(0);
  });

  it("returns 0 willpower for locations with missing or invalid willpower", () => {
    // Create a location-like card with missing willpower (simulating edge case)
    const locationNoWillpower = {
      id: "location-no-willpower",
      canonicalId: "ci_location-no-willpower",
      cardType: "location",
      name: "Broken Location",
      cost: 2,
      moveCost: 1,
      lore: 1,
      // willpower is intentionally missing
      inkType: ["amber"],
      inkable: true,
      set: "TST",
      rarity: "common",
      abilities: [],
      i18n: createCardI18n("Broken Location"),
    } as unknown as LocationCard;

    const state = buildState();
    const runtimeCard = buildRuntimeCard(locationNoWillpower);
    const derived = deriveLorcana(createLorcanaRuntimeCardDeriver(EMPTY_REGISTRY), {
      cardId: runtimeCard.instanceId,
      card: runtimeCard,
      actorPlayerId: PLAYER_ONE,
      state,
      staticResources: buildStaticResources(locationNoWillpower),
    });

    expect(derived.willpower).toBe(0);
  });

  it("returns 0 strength and willpower for non-character, non-location cards", () => {
    const actionCard: LorcanaCard = {
      id: "action-card",
      canonicalId: "ci_action-card",
      cardType: "action",
      name: "Test Action",
      cost: 2,
      inkType: ["ruby"],
      inkable: true,
      set: "TST",
      rarity: "common",
      abilities: [],
      i18n: createCardI18n("Test Action"),
      cardNumber: 666,
    } as LorcanaCard;

    const state = buildState();
    const runtimeCard = buildRuntimeCard(actionCard);
    const derived = deriveLorcana(createLorcanaRuntimeCardDeriver(EMPTY_REGISTRY), {
      cardId: runtimeCard.instanceId,
      card: runtimeCard,
      actorPlayerId: PLAYER_ONE,
      state,
      staticResources: buildStaticResources(actionCard),
    });

    expect(derived.strength).toBe(0);
    expect(derived.willpower).toBe(0);
  });
});
