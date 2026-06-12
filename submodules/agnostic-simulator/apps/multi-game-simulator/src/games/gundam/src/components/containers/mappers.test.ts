import { describe, expect, it } from "vite-plus/test";

import type { Card } from "@tcg/gundam-types";

import type { BoardProjection } from "../../game/index.ts";
import { asCardColor, toGameCardData, zoneCount, mapZone, resolveOpponentId } from "./mappers.ts";

function makeView(overrides: Partial<BoardProjection> = {}): BoardProjection {
  return {
    G: {},
    stateID: 0,
    status: { phase: "play", activePlayer: "p1", turn: 1, pendingDecision: [] } as never,
    zones: { zones: {} },
    players: [
      { playerId: "p1", publicData: {} },
      { playerId: "p2", publicData: {} },
    ],
    availableMoves: [],
    myPlayerId: "p1",
    ...overrides,
  } as BoardProjection;
}

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    name: "Test Gundam",
    cost: 3,
    level: 2,
    type: "unit",
    cardNumber: "ST01-001",
    rarity: "R",
    traits: ["Earth Federation"],
    keywordEffects: [],
    effect: "Test effect.",
    ...overrides,
  } as Card;
}

function makeFilteredCard(overrides: Record<string, unknown> = {}) {
  return {
    instanceId: "inst-001",
    definition: makeCard(),
    definitionId: "st01-001",
    meta: null,
    ownerId: "p1",
    controllerId: "p1",
    faceDown: false,
    zoneId: "battleArea:p1",
    ...overrides,
  };
}

describe("asCardColor", () => {
  it("returns a valid CardColor for known values", () => {
    expect(asCardColor("blue")).toBe("blue");
    expect(asCardColor("green")).toBe("green");
    expect(asCardColor("red")).toBe("red");
    expect(asCardColor("white")).toBe("white");
    expect(asCardColor("purple")).toBe("purple");
  });

  it("returns undefined for unknown values", () => {
    expect(asCardColor("orange")).toBeUndefined();
    expect(asCardColor(null)).toBeUndefined();
    expect(asCardColor(undefined)).toBeUndefined();
  });
});

describe("toGameCardData", () => {
  it("returns a face-down placeholder when definition is null", () => {
    const view = makeView({ G: { damage: { "inst-001": 2 } } });
    const card = makeFilteredCard({ definition: null });
    const result = toGameCardData(view, card);
    expect(result).toEqual({ id: "inst-001", name: "?", faceDown: true, damage: 2 });
  });

  it("returns a face-down placeholder when faceDown is true", () => {
    const view = makeView();
    const card = makeFilteredCard({ faceDown: true });
    const result = toGameCardData(view, card);
    expect(result.faceDown).toBe(true);
    expect(result.name).toBe("?");
  });

  it("maps unit card definition fields to GameCardData", () => {
    const view = makeView();
    const card = makeFilteredCard({
      definition: makeCard({
        name: "RX-78-2 Gundam",
        cost: 4,
        level: 3,
        type: "unit",
        cardNumber: "ST01-001",
        rarity: "rare",
        traits: ["Earth Federation", "Gundam"],
        keywordEffects: [{ keyword: "Blocker", value: undefined }],
        effect: "When played: draw 1.",
      }),
    });
    const result = toGameCardData(view, card);
    expect(result.id).toBe("inst-001");
    expect(result.name).toBe("RX-78-2 Gundam");
    expect(result.cardType).toBe("unit");
    expect(result.cost).toBe(4);
    expect(result.level).toBe(3);
    expect(result.ap).toBeNull();
    expect(result.hp).toBeNull();
    expect(result.rarity).toBe("rare");
    expect(result.traits).toEqual(["Earth Federation", "Gundam"]);
    expect(result.keywords).toEqual([{ keyword: "Blocker" }]);
    expect(result.effect).toBe("When played: draw 1.");
    expect(result.set).toBe("st01");
    expect(result.cardNumber).toBe("ST01-001");
  });

  it("reads AP/HP from unit definition", () => {
    const view = makeView();
    const def = makeCard({ type: "unit", ap: 5, hp: 6 });
    const card = makeFilteredCard({ definition: def });
    const result = toGameCardData(view, card);
    expect(result.ap).toBe(5);
    expect(result.hp).toBe(6);
    expect(result.baseAp).toBe(5);
    expect(result.baseHp).toBe(6);
  });

  it("reads HP from base definition", () => {
    const view = makeView();
    const def = makeCard({ type: "base", hp: 20 });
    const card = makeFilteredCard({ definition: def });
    const result = toGameCardData(view, card);
    expect(result.ap).toBeNull();
    expect(result.hp).toBe(20);
    expect(result.baseHp).toBe(20);
  });

  it("returns null AP for non-unit types", () => {
    const view = makeView();
    const def = makeCard({ type: "command" });
    const card = makeFilteredCard({ definition: def });
    const result = toGameCardData(view, card);
    expect(result.ap).toBeNull();
    expect(result.hp).toBeNull();
  });

  it("computes effective AP/HP from meta modifiers", () => {
    const view = makeView();
    const def = makeCard({ type: "unit", ap: 3, hp: 5 });
    const card = makeFilteredCard({
      definition: def,
      meta: { exhausted: false, apModifier: 2, hpModifier: -1 },
    });
    const result = toGameCardData(view, card);
    expect(result.ap).toBe(5);
    expect(result.hp).toBe(4);
    expect(result.baseAp).toBe(3);
    expect(result.baseHp).toBe(5);
  });

  it("computes effective AP/HP from paired pilot bonuses", () => {
    const unit = makeFilteredCard({
      definition: makeCard({ type: "unit", ap: 3, hp: 2 }),
    });
    const pilot = makeFilteredCard({
      instanceId: "pilot-001",
      definitionId: "st01-010",
      definition: makeCard({
        name: "Mu La Flaga",
        type: "pilot",
        apBonus: 1,
        hpBonus: 0,
      } as unknown as Card),
    });
    const view = makeView({
      zones: {
        zones: {
          "battleArea:p1": {
            count: 2,
            cards: [unit, pilot],
          },
        },
      },
      G: {
        pilotAssignments: {
          "inst-001": "pilot-001",
        },
      },
    });
    const result = toGameCardData(view, unit);
    expect(result.ap).toBe(4);
    expect(result.hp).toBe(2);
    expect(result.baseAp).toBe(3);
    expect(result.baseHp).toBe(2);
  });

  it("computes effective AP/HP from command-as-pilot modifiers", () => {
    const unit = makeFilteredCard({
      definition: makeCard({ type: "unit", ap: 3, hp: 1 }),
    });
    const commandPilot = makeFilteredCard({
      instanceId: "pilot-command-001",
      definitionId: "st04-014",
      definition: makeCard({
        name: "The Magic Bullet of Dusk",
        type: "command",
        pilotName: "Mu La Flaga",
        apBonus: 2,
        hpBonus: 1,
      } as unknown as Card),
    });
    const view = makeView({
      zones: {
        zones: {
          "battleArea:p1": {
            count: 2,
            cards: [unit, commandPilot],
          },
        },
      },
      G: {
        pilotAssignments: {
          "inst-001": "pilot-command-001",
        },
      },
    });
    const result = toGameCardData(view, unit);
    expect(result.ap).toBe(5);
    expect(result.hp).toBe(2);
  });

  it("computes effective AP/HP from continuous stat modifiers", () => {
    const view = makeView({
      G: {
        continuousEffects: [
          {
            id: "ap-buff",
            sourceId: "source",
            targetId: "inst-001",
            payload: { kind: "stat-modifier", stat: "ap", modifier: 2 },
          },
          {
            id: "hp-debuff",
            sourceId: "source",
            targetId: "inst-001",
            payload: { kind: "stat-modifier", stat: "hp", modifier: -1 },
          },
        ],
      },
    });
    const card = makeFilteredCard({ definition: makeCard({ type: "unit", ap: 3, hp: 2 }) });
    const result = toGameCardData(view, card);
    expect(result.ap).toBe(5);
    expect(result.hp).toBe(1);
  });

  it("reads damage from G.damage map", () => {
    const view = makeView({ G: { damage: { "inst-001": 3 } } });
    const card = makeFilteredCard();
    const result = toGameCardData(view, card);
    expect(result.damage).toBe(3);
  });

  it("defaults damage to 0 when not in G.damage", () => {
    const view = makeView({ G: { damage: {} } });
    const card = makeFilteredCard();
    const result = toGameCardData(view, card);
    expect(result.damage).toBe(0);
  });

  it("reads exerted from meta.exhausted", () => {
    const view = makeView();
    const card = makeFilteredCard({ meta: { exhausted: true } });
    const result = toGameCardData(view, card);
    expect(result.exerted).toBe(true);
  });

  it("reads grantedKeywords from meta", () => {
    const view = makeView();
    const card = makeFilteredCard({ meta: { grantedKeywords: ["Blocker", "FirstStrike"] } });
    const result = toGameCardData(view, card);
    expect(result.grantedKeywords).toEqual(["Blocker", "FirstStrike"]);
  });

  it("reads deployedThisTurn from meta", () => {
    const view = makeView();
    const card = makeFilteredCard({ meta: { deployedThisTurn: true } });
    const result = toGameCardData(view, card);
    expect(result.deployedThisTurn).toBe(true);
  });

  it("derives cantAttack from the deploy-sickness rule for non-Link units", () => {
    const view = makeView();
    // Non-Link unit (no linkCondition) deployed this turn → cantAttack.
    const card = makeFilteredCard({
      definition: makeCard(),
      meta: { deployedThisTurn: true },
    });
    const result = toGameCardData(view, card);
    expect(result.cantAttack).toBe(true);
    expect(result.isLinkUnit).toBe(false);
    expect(result.canAttackThisTurn).toBe(false);
  });

  it("exempts Link units from deploy-sickness (rule 3-2-6-3)", () => {
    const view = makeView();
    const linkUnit = makeCard({ linkCondition: "Pilot" } as unknown as Card);
    const card = makeFilteredCard({
      definition: linkUnit,
      meta: { deployedThisTurn: true },
    });
    const result = toGameCardData(view, card);
    expect(result.isLinkUnit).toBe(true);
    expect(result.cantAttack).toBe(false);
    expect(result.canAttackThisTurn).toBe(true);
  });

  it("derives cantAttack / cantBlock from continuousEffects restrictions", () => {
    const view = makeView({
      G: {
        continuousEffects: [
          {
            id: "r-atk",
            sourceId: "inst-002",
            targetId: "inst-001",
            payload: { kind: "restriction", restriction: "cannot-attack" },
          },
          {
            id: "r-blk",
            sourceId: "inst-003",
            targetId: "inst-001",
            payload: { kind: "restriction", restriction: "cannot-block" },
          },
        ],
      },
    });
    const card = makeFilteredCard();
    const result = toGameCardData(view, card);
    expect(result.cantAttack).toBe(true);
    expect(result.cantBlock).toBe(true);
  });

  it("extracts active effects from G.continuousEffects", () => {
    const view = makeView({
      G: {
        continuousEffects: [
          {
            id: "ce-1",
            sourceId: "inst-002",
            targetId: "inst-001",
            payload: { kind: "stat-modifier", stat: "ap", modifier: 2 },
            duration: "this-turn",
            createdAtTurn: 1,
          },
          {
            id: "ce-2",
            sourceId: "inst-003",
            targetId: "inst-999",
            payload: { kind: "keyword-grant", keyword: "Blocker" },
            duration: "permanent",
            createdAtTurn: 1,
          },
        ],
      },
    });
    const card = makeFilteredCard();
    const result = toGameCardData(view, card);
    expect(result.activeEffects).toHaveLength(1);
    expect(result.activeEffects![0]).toEqual({
      sourceId: "inst-002",
      kind: "stat-modifier",
      description: "AP +2",
      duration: "this-turn",
    });
  });

  it("extracts keyword-grant effects with correct description", () => {
    const view = makeView({
      G: {
        continuousEffects: [
          {
            id: "ce-3",
            sourceId: "inst-010",
            targetId: "inst-001",
            payload: { kind: "keyword-grant", keyword: "Blocker" },
            duration: "permanent",
          },
        ],
      },
    });
    const card = makeFilteredCard();
    const result = toGameCardData(view, card);
    expect(result.activeEffects).toHaveLength(1);
    expect(result.activeEffects![0].description).toBe("Grant: Blocker");
    expect(result.activeEffects![0].keyword).toBe("Blocker");
  });

  it("falls back to payload.kind as description for unknown effect types", () => {
    const view = makeView({
      G: {
        continuousEffects: [
          {
            id: "ce-4",
            sourceId: "inst-010",
            targetId: "inst-001",
            payload: { kind: "custom-effect", foo: "bar" },
            duration: "this-battle",
          },
        ],
      },
    });
    const card = makeFilteredCard();
    const result = toGameCardData(view, card);
    expect(result.activeEffects![0].description).toBe("custom-effect");
  });

  it("resolves effect source attribution when the source card is in the view", () => {
    const sourceDef = makeCard({
      name: "Amuro Ray",
      cardNumber: "ST01-010",
    });
    const view = makeView({
      zones: {
        zones: {
          "battleArea:p1": {
            count: 1,
            cards: [
              {
                instanceId: "inst-002",
                definition: sourceDef,
                definitionId: "st01-010",
                meta: null,
                ownerId: "p1",
                controllerId: "p1",
                faceDown: false,
                zoneId: "battleArea:p1",
              },
            ],
          },
        },
      },
      G: {
        continuousEffects: [
          {
            id: "ce-src",
            sourceId: "inst-002",
            targetId: "inst-001",
            payload: { kind: "stat-modifier", stat: "ap", modifier: 2 },
            duration: "this-turn",
          },
        ],
      },
    });
    const card = makeFilteredCard();
    const result = toGameCardData(view, card);
    expect(result.activeEffects).toHaveLength(1);
    expect(result.activeEffects![0].sourceLabel).toBe("Amuro Ray");
    expect(result.activeEffects![0].sourceCardNumber).toBe("ST01-010");
    expect(result.activeEffects![0].sourceSet).toBe("st01");
  });

  it("leaves source attribution undefined when the source card is not in the view", () => {
    const view = makeView({
      G: {
        continuousEffects: [
          {
            id: "ce-unknown",
            sourceId: "inst-missing",
            targetId: "inst-001",
            payload: { kind: "stat-modifier", stat: "ap", modifier: 1 },
          },
        ],
      },
    });
    const card = makeFilteredCard();
    const result = toGameCardData(view, card);
    expect(result.activeEffects).toHaveLength(1);
    expect(result.activeEffects![0].sourceLabel).toBeUndefined();
  });

  it("returns empty activeEffects when G has no continuousEffects", () => {
    const view = makeView({ G: {} });
    const card = makeFilteredCard();
    const result = toGameCardData(view, card);
    expect(result.activeEffects).toEqual([]);
  });

  it("derives set from cardNumber prefix", () => {
    const view = makeView();
    const def = makeCard({ cardNumber: "GD02-045" });
    const card = makeFilteredCard({ definition: def });
    const result = toGameCardData(view, card);
    expect(result.set).toBe("gd02");
  });

  it("reads linkCondition as linkRequirement", () => {
    const view = makeView();
    const def = makeCard({ linkCondition: "Pilot" });
    const card = makeFilteredCard({ definition: def });
    const result = toGameCardData(view, card);
    expect(result.linkRequirement).toBe("Pilot");
  });
});

describe("mapZone", () => {
  it("returns cards from the named zone", () => {
    const cards = [makeFilteredCard({ instanceId: "a" }), makeFilteredCard({ instanceId: "b" })];
    const view = makeView({
      zones: { zones: { "hand:p1": { count: 2, cards } } },
    });
    expect(mapZone(view, "hand", "p1")).toHaveLength(2);
  });

  it("returns empty array for missing zone", () => {
    const view = makeView();
    expect(mapZone(view, "hand", "p1")).toEqual([]);
  });
});

describe("zoneCount", () => {
  it("returns count from zone", () => {
    const view = makeView({
      zones: { zones: { "deck:p1": { count: 42, cards: [] } } },
    });
    expect(zoneCount(view, "deck", "p1")).toBe(42);
  });

  it("returns 0 for missing zone", () => {
    const view = makeView();
    expect(zoneCount(view, "deck", "p1")).toBe(0);
  });
});

describe("resolveOpponentId", () => {
  it("returns the other player id", () => {
    const view = makeView();
    expect(resolveOpponentId(view, "p1")).toBe("p2");
    expect(resolveOpponentId(view, "p2")).toBe("p1");
  });

  it("returns null when no other player found", () => {
    const view = makeView({
      players: [{ playerId: "p1", publicData: {} }],
    } as Partial<BoardProjection> as BoardProjection);
    expect(resolveOpponentId(view, "p1")).toBeNull();
  });
});
