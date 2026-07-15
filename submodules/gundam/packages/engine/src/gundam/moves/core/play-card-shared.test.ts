/**
 * play-card-shared — resource validation tests
 *
 * Covers the two shared checks in validatePlayFromHand:
 *   1. Resource level requirement: total cards in resource area >= card level
 *   2. Resource cost requirement: active (non-exhausted) resource cards >= card cost
 *
 * Also covers payCardCost exhausting individual cards and readyAllCards
 * restoring them at the start of the next turn.
 */

import { describe, it, expect } from "vite-plus/test";
import type { ResourceCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  createMockResource,
} from "../../../index.ts";
import type { TestCardEntry } from "../../../index.ts";

function exhausted(card: ResourceCard): TestCardEntry {
  return { card, exhausted: true };
}

function active(card: ResourceCard): TestCardEntry {
  return { card, exhausted: false };
}

// ── Resource level tests ───────────────────────────────────────────────────────

describe("validatePlayFromHand — level requirement", () => {
  it("rejects a card whose level exceeds the resource area count", () => {
    const unit = createMockUnit({ level: 2, cost: 1 });
    const res = createMockResource();

    const engine = GundamTestEngine.create(
      { hand: [unit], resourceArea: [active(res)] }, // 1 resource → level 1, need level 2
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(unit), "INSUFFICIENT_RESOURCE_LEVEL");
  });

  it("allows a card whose level equals the resource area count", () => {
    const unit = createMockUnit({ level: 2, cost: 2 });
    const res1 = createMockResource();
    const res2 = createMockResource();

    const engine = GundamTestEngine.create(
      { hand: [unit], resourceArea: [active(res1), active(res2)] }, // 2 resources → level 2
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(unit));
  });

  it("allows a level-0 card with no resources in the resource area", () => {
    const unit = createMockUnit({ level: 0, cost: 0 });

    const engine = GundamTestEngine.create({ hand: [unit], resourceArea: [] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(unit));
  });

  it("counts exhausted resources toward level (level = total, not active)", () => {
    // 3 resources, 2 exhausted — level is still 3
    const unit = createMockUnit({ level: 3, cost: 1 });
    const res1 = createMockResource();
    const res2 = createMockResource();
    const res3 = createMockResource();

    const engine = GundamTestEngine.create(
      {
        hand: [unit],
        resourceArea: [exhausted(res1), exhausted(res2), active(res3)],
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    // Level check passes (3 >= 3). Cost check also passes (1 active >= cost 1).
    expectSuccess(p1.deployUnit(unit));
  });
});

// ── Resource availability tests ────────────────────────────────────────────────

describe("validatePlayFromHand — resource availability", () => {
  it("rejects a card when all resource cards are exhausted", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const res = createMockResource();

    const engine = GundamTestEngine.create(
      { hand: [unit], resourceArea: [exhausted(res)] }, // 1 resource but exhausted
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(unit), "INSUFFICIENT_RESOURCES");
  });

  it("allows a card when exactly enough active resources are available", () => {
    const unit = createMockUnit({ level: 2, cost: 2 });
    const res1 = createMockResource();
    const res2 = createMockResource();

    const engine = GundamTestEngine.create(
      { hand: [unit], resourceArea: [active(res1), active(res2)] },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(unit));
  });

  it("rejects when total count >= cost but active count < cost (partial exhaustion)", () => {
    // 3 resources total, 2 exhausted, 1 active — cost is 2 → should fail
    const unit = createMockUnit({ level: 3, cost: 2 });
    const res1 = createMockResource();
    const res2 = createMockResource();
    const res3 = createMockResource();

    const engine = GundamTestEngine.create(
      {
        hand: [unit],
        resourceArea: [exhausted(res1), exhausted(res2), active(res3)],
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(unit), "INSUFFICIENT_RESOURCES");
  });

  it("rejects with no resources at all when cost > 0", () => {
    const unit = createMockUnit({ level: 0, cost: 1 });

    const engine = GundamTestEngine.create({ hand: [unit], resourceArea: [] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(unit), "INSUFFICIENT_RESOURCES");
  });
});

// ── payCardCost exhaustion tests ───────────────────────────────────────────────

describe("payCardCost — exhausts individual resource cards", () => {
  it("exhausts exactly N resource cards when paying cost N", () => {
    const unit = createMockUnit({ level: 3, cost: 2 });
    const res1 = createMockResource();
    const res2 = createMockResource();
    const res3 = createMockResource();

    const engine = GundamTestEngine.create(
      {
        hand: [unit],
        resourceArea: [active(res1), active(res2), active(res3)],
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(unit));

    // Exactly 2 resources should be exhausted; 1 remains active
    const state = engine.getState();
    const resourceIds = engine.getCardsInZone({ zone: "resourceArea", playerId: PLAYER_ONE });
    const exhaustedCount = resourceIds.filter((id) => state.G.exhausted[id]).length;
    const activeCount = resourceIds.filter((id) => !state.G.exhausted[id]).length;

    expect(exhaustedCount).toBe(2);
    expect(activeCount).toBe(1);
  });

  it("a cost-0 card exhausts no resource cards", () => {
    const unit = createMockUnit({ level: 0, cost: 0 });
    const res = createMockResource();

    const engine = GundamTestEngine.create({ hand: [unit], resourceArea: [active(res)] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(unit));

    const state = engine.getState();
    const resourceIds = engine.getCardsInZone({ zone: "resourceArea", playerId: PLAYER_ONE });
    const exhaustedCount = resourceIds.filter((id) => state.G.exhausted[id]).length;

    expect(exhaustedCount).toBe(0);
  });
});

// ── Turn-boundary restoration tests ───────────────────────────────────────────

describe("readyAllCards — resource cards become active at start of next turn", () => {
  it("exhausted resource cards are readied when the turn passes to the next player", () => {
    const unit = createMockUnit({ level: 2, cost: 2 });
    const res1 = createMockResource();
    const res2 = createMockResource();

    // P2 needs enough deck cards to draw one on their turn
    const engine = GundamTestEngine.create(
      {
        hand: [unit],
        resourceArea: [active(res1), active(res2)],
      },
      { deck: 4 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    // Deploy the unit — exhausts both resources
    expectSuccess(p1.deployUnit(unit));

    const resourceIds = engine.getCardsInZone({ zone: "resourceArea", playerId: PLAYER_ONE });
    const afterDeploy = engine.getState();
    expect(resourceIds.every((id) => afterDeploy.G.exhausted[id])).toBe(true);

    // Complete P1's turn: passTurn → end-phase/action-step (interactive)
    // Both players pass through action-step, then auto-advances cleanup → turn cycles
    p1.passPhase();
    p2.passActionStep();
    p1.passActionStep();

    // Complete P2's turn: same flow
    p2.passPhase();
    p1.passActionStep();
    p2.passActionStep();

    // P1's resource cards should now be active again
    const afterReady = engine.getState();
    const stillExhausted = resourceIds.filter((id) => afterReady.G.exhausted[id]);
    expect(stillExhausted).toHaveLength(0);
  });
});
