/**
 * Resource Rules — Compliance Tests
 *
 * Tests rule compliance for resource area mechanics:
 *   Rule 4-4-3:      Resource area is public (both players see card identities)
 *   Rule 4-4-2:      Maximum 15 total resource cards in resource area
 *   Rule 4-4-2-1:    Maximum 5 EX resource tokens in resource area
 *   Rule 5-17-3-2-3: EX resource tokens are removed from the game when used to pay costs
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect, ResourceCard } from "@tcg/gundam-types";
import type { FrameworkReadAPI } from "../../../types/move-types.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockCommand,
  createMockUnit,
  createMockResource,
} from "../../../index.ts";
import type { TestCardEntry } from "../../../index.ts";
import type { PlayerId } from "../../../types/branded.ts";
import { canPlaceResource } from "./play-card-shared.ts";

function active(card: ResourceCard): TestCardEntry {
  return { card, exhausted: false };
}

function exhausted(card: ResourceCard): TestCardEntry {
  return { card, exhausted: true };
}

const placeExResource: CardEffect = {
  type: "command",
  activation: { timing: ["main"] },
  directives: [{ action: { action: "placeExResource", state: "active" } }],
  sourceText: "【Main】Place 1 active EX Resource.",
};

function exResourceCommand() {
  return createMockCommand({ level: 0, cost: 0, effects: [placeExResource] });
}

/**
 * Build a minimal FrameworkReadAPI stub sufficient for canPlaceResource tests.
 * Reads zone card lists directly from a test engine state snapshot.
 */
function makeFrameworkStub(engine: GundamTestEngine, tokenIds: Set<string>): FrameworkReadAPI {
  return {
    zones: {
      getCards: (ref: { zone: string; playerId: string }) => {
        const state = engine.getState();
        const key = `${ref.zone}:${ref.playerId}`;
        return state.ctx.zones.private.zoneCards[key] ?? [];
      },
    },
    cards: {
      getDefinition: (id: string) => {
        return tokenIds.has(id) ? { type: "resource" } : undefined;
      },
      getMeta: (id: string) => {
        return tokenIds.has(id) ? { isToken: true } : undefined;
      },
    },
  } as unknown as FrameworkReadAPI;
}

// ── Rule 4-4-3: Resource area is public ────────────────────────────────────────

describe("Rule 4-4-3 — resource area is public", () => {
  it("resource area cards are visible to the non-owner via filtered view", () => {
    const res = createMockResource();
    const engine = GundamTestEngine.create({ resourceArea: [active(res)] }, {});

    const resourceZoneKey = `resourceArea:${PLAYER_ONE}`;

    // Verify through the actual visibility filter that P2 (the non-owner) can see
    // P1's resource area cards with their definitions exposed (not null/hidden).
    const p2View = engine.getView(PLAYER_TWO as unknown as PlayerId);
    const p2ResourceZone = p2View.zones.zones[resourceZoneKey];

    expect(p2ResourceZone?.cards).toHaveLength(1);
    expect(p2ResourceZone?.cards[0]?.definition).not.toBeNull();
    expect(p2ResourceZone?.cards[0]?.faceDown).toBe(false);
  });

  it("resource area cards are also visible to the owner", () => {
    const res = createMockResource();
    const engine = GundamTestEngine.create({ resourceArea: [active(res)] }, {});

    const resourceZoneKey = `resourceArea:${PLAYER_ONE}`;
    const p1View = engine.getView(PLAYER_ONE as unknown as PlayerId);
    const p1ResourceZone = p1View.zones.zones[resourceZoneKey];

    expect(p1ResourceZone?.cards).toHaveLength(1);
    expect(p1ResourceZone?.cards[0]?.definition).not.toBeNull();
    expect(p1ResourceZone?.cards[0]?.faceDown).toBe(false);
  });

  it("resource count reflects total cards including exhausted", () => {
    const res1 = createMockResource();
    const res2 = createMockResource();
    const res3 = createMockResource();

    const engine = GundamTestEngine.create(
      { resourceArea: [active(res1), exhausted(res2), active(res3)] },
      {},
    );

    const state = engine.getState();
    const resourceZoneKey = `resourceArea:${PLAYER_ONE}`;
    const resourceIds = state.ctx.zones.private.zoneCards[resourceZoneKey] ?? [];

    expect(resourceIds).toHaveLength(3);

    // Exhaustion state tracked per card in G.exhausted
    const exhaustedCount = resourceIds.filter((id) => state.G.exhausted[id]).length;
    expect(exhaustedCount).toBe(1);

    // All 3 cards visible to non-owner
    const p2View = engine.getView(PLAYER_TWO as unknown as PlayerId);
    const p2Zone = p2View.zones.zones[resourceZoneKey];
    expect(p2Zone?.cards).toHaveLength(3);
    expect(p2Zone?.cards.every((c) => c.definition !== null)).toBe(true);
  });
});

// ── Rule 5-17-3-2-3: EX tokens removed from game when used ────────────────────

describe("Rule 5-17-3-2-3 — EX resource tokens removed from game when spent", () => {
  it("regular resource cards are exhausted (not removed) when paying costs", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const res = createMockResource();

    const engine = GundamTestEngine.create({ hand: [unit], resourceArea: [active(res)] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(unit));

    // Regular resource stays in zone, just exhausted
    const resourceIds = engine.getCardsInZone({ zone: "resourceArea", playerId: PLAYER_ONE });
    expect(resourceIds).toHaveLength(1);
    const state = engine.getState();
    expect(state.G.exhausted[resourceIds[0]!]).toBe(true);

    // Nothing in removal area
    const removalIds = engine.getCardsInZone({ zone: "removalArea" });
    expect(removalIds).toHaveLength(0);
  });

  it("a spent EX Resource ceases to exist instead of becoming a Removal Area ghost", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const setup = exResourceCommand();
    const engine = GundamTestEngine.create({ hand: [setup, unit] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    const tokenId = p1.getCardsInZone("resourceArea")[0]!;

    expectSuccess(p1.deployUnit(unit));

    expect(p1.getCardsInZone("resourceArea")).not.toContain(tokenId);
    expect(p1.getCardsInZone("removalArea")).not.toContain(tokenId);
    expect(p1.getCardZone(tokenId)).toBeUndefined();
  });

  it("prefers exhausting regular resources over consuming EX tokens", () => {
    const unit = createMockUnit({ level: 2, cost: 1 });
    const regularRes = createMockResource();
    const setup = exResourceCommand();

    const engine = GundamTestEngine.create(
      { hand: [setup, unit], resourceArea: [active(regularRes)] },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const regularId = p1.getCardsInZone("resourceArea")[0]!;
    expectSuccess(p1.playCommand(setup));
    const exId = p1.getCardsInZone("resourceArea").find((id) => id !== regularId)!;

    expectSuccess(p1.deployUnit(unit));

    expect(p1.isExhausted(regularId)).toBe(true);
    expect(p1.getCardsInZone("resourceArea")).toContain(exId);
    expect(p1.isExhausted(exId)).toBe(false);
    expect(p1.getCardsInZone("removalArea")).toHaveLength(0);
  });

  it("uses EX tokens only after all regular resources are exhausted (cost 3: 2 regular + 1 EX)", () => {
    const unit = createMockUnit({ level: 3, cost: 3 });
    const reg1 = createMockResource();
    const reg2 = createMockResource();
    const setup = exResourceCommand();

    const engine = GundamTestEngine.create(
      { hand: [setup, unit], resourceArea: [active(reg1), active(reg2)] },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [reg1Id, reg2Id] = p1.getCardsInZone("resourceArea");
    expectSuccess(p1.playCommand(setup));
    const exId = p1.getCardsInZone("resourceArea").find((id) => id !== reg1Id && id !== reg2Id)!;

    expectSuccess(p1.deployUnit(unit));

    expect(p1.isExhausted(reg1Id!)).toBe(true);
    expect(p1.isExhausted(reg2Id!)).toBe(true);
    expect(p1.getCardsInZone("resourceArea")).not.toContain(exId);
    expect(p1.getCardsInZone("removalArea")).not.toContain(exId);
    expect(p1.getCardZone(exId)).toBeUndefined();
  });
});

// ── Rule 4-4-2: Max 15 resources cap ──────────────────────────────────────────

describe("Rule 4-4-2 — canPlaceResource enforces 15-card total cap", () => {
  it("returns false when 15 resources are already present", () => {
    const resources = Array.from({ length: 15 }, () => active(createMockResource()));
    const engine = GundamTestEngine.create({ resourceArea: resources }, {});

    const resourceIds = engine.getCardsInZone({ zone: "resourceArea", playerId: PLAYER_ONE });
    expect(resourceIds).toHaveLength(15);

    const framework = makeFrameworkStub(engine, new Set());
    expect(canPlaceResource(PLAYER_ONE, false, framework)).toBe(false);
    expect(canPlaceResource(PLAYER_ONE, true, framework)).toBe(false);
  });

  it("returns true when fewer than 15 resources are present", () => {
    const resources = Array.from({ length: 14 }, () => active(createMockResource()));
    const engine = GundamTestEngine.create({ resourceArea: resources }, {});

    const framework = makeFrameworkStub(engine, new Set());
    expect(canPlaceResource(PLAYER_ONE, false, framework)).toBe(true);
  });
});

// ── Rule 4-4-2-1: Max 5 EX tokens cap ────────────────────────────────────────

describe("Rule 4-4-2-1 — canPlaceResource enforces 5 EX token cap", () => {
  it("returns false for EX token when 5 EX tokens already present, true for regular", () => {
    // 5 regular + 5 EX = 10 total (well under global 15 cap)
    const regularResources = Array.from({ length: 5 }, () => active(createMockResource()));
    const exResources = Array.from({ length: 5 }, () => active(createMockResource()));

    const engine = GundamTestEngine.create(
      { resourceArea: [...regularResources, ...exResources] },
      {},
    );

    // Mark the last 5 cards in the zone as EX tokens
    const state = engine.getState();
    const resourceIds = engine.getCardsInZone({ zone: "resourceArea", playerId: PLAYER_ONE });
    const exTokenIds = new Set(resourceIds.slice(5));
    for (const id of exTokenIds) {
      state.ctx.zones.private.cardMeta[id] = { isToken: true };
    }

    const framework = makeFrameworkStub(engine, exTokenIds);

    // Regular resource can still be placed (total < 15)
    expect(canPlaceResource(PLAYER_ONE, false, framework)).toBe(true);
    // EX token cannot be placed (5 EX tokens already present)
    expect(canPlaceResource(PLAYER_ONE, true, framework)).toBe(false);
  });

  it("returns true for EX token when fewer than 5 EX tokens are present", () => {
    const exResources = Array.from({ length: 4 }, () => active(createMockResource()));
    const engine = GundamTestEngine.create({ resourceArea: exResources }, {});

    const state = engine.getState();
    const resourceIds = engine.getCardsInZone({ zone: "resourceArea", playerId: PLAYER_ONE });
    const exTokenIds = new Set(resourceIds);
    for (const id of exTokenIds) {
      state.ctx.zones.private.cardMeta[id] = { isToken: true };
    }

    const framework = makeFrameworkStub(engine, exTokenIds);
    expect(canPlaceResource(PLAYER_ONE, true, framework)).toBe(true);
  });
});
