/**
 * Spec → tests: ../specs/04-game-locations.md (fluent API)
 */

import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockResource,
  createMockUnit,
  expectCard,
  expectPlayer,
  expectWinnerIs,
  resolveBattle,
  passMainIntoEndAction,
  endTurn,
} from "../../index.ts";
import { st01Gundam001 } from "../../../../../cards/src/cards/st01/unit/001-gundam.ts";
import { st01Gm005 } from "../../../../../cards/src/cards/st01/unit/005-gm.ts";
import { st10MobileWorkerTekkadan010 } from "../../../../../cards/src/cards/st10/unit/010-mobile-worker-tekkadan.ts";

describe("Section 4 — Game Locations (specs/04-game-locations.md)", () => {
  it("4-1-3: zone card counts are queryable for both players", () => {
    const engine = GundamTestEngine.create(
      {
        play: [st01Gundam001, st01Gm005],
        trash: [st10MobileWorkerTekkadan010],
        deck: 4,
      },
      {
        shieldArea: [st10MobileWorkerTekkadan010, st10MobileWorkerTekkadan010],
        deck: 3,
      },
    );
    expectPlayer(engine.asPlayer(PLAYER_ONE))
      .toHaveZoneCount("battleArea", 2)
      .toHaveZoneCount("trash", 1);
    expectPlayer(engine.asPlayer(PLAYER_TWO)).toHaveShieldCount(2);
  });

  it("4-5-4 / 11-4-1 / 11-4-2: battle area max 6 — seventh Unit requires trashing an existing one", () => {
    const six = Array.from({ length: 6 }, (_, i) =>
      createMockUnit({ name: `Unit ${i}`, cardNumber: `BA-U-${i}`, level: 1, cost: 0 }),
    );
    const seventh = createMockUnit({
      name: "Seventh",
      cardNumber: "BA-U-7",
      level: 1,
      cost: 1,
    });
    const engine = GundamTestEngine.create({
      play: six,
      hand: [seventh],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const existingIds = p1.getCardsInZone("battleArea");
    expect(existingIds).toHaveLength(6);

    p1.must.deployUnit(seventh);
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected battle-area excess choice (11-4-2)");
    }
    const toTrash = existingIds[0]!;
    p1.must.resolveTargets(toTrash);
    expect(p1.getCardZone(toTrash)).toMatch(/^trash:/);
    expectPlayer(p1).toHaveZoneCount("battleArea", 6);
  });

  it("4-6-4-2 / 8-5-2-3 / 5-5-6: Shields have 1 HP — excess damage does not spill", () => {
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      {
        shieldArea: [
          st10MobileWorkerTekkadan010,
          st10MobileWorkerTekkadan010,
          st10MobileWorkerTekkadan010,
        ],
      },
    );

    resolveBattle(engine, st01Gundam001, "direct");
    expectPlayer(engine.asPlayer(PLAYER_TWO)).toHaveShieldCount(2).toHaveZoneCount("trash", 1);
    expectWinnerIs(engine, undefined);
  });

  it("4-8-4 / 7-6-5-1: hand over 10 requires discard during end-phase hand step", () => {
    const hand = Array.from({ length: 11 }, (_, i) =>
      createMockUnit({ name: `Hand ${i}`, cardNumber: `MOCK-HAND-${i}` }),
    );
    const discardCard = hand[0]!;
    const engine = GundamTestEngine.create({ hand, deck: 5 }, { deck: 5 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    passMainIntoEndAction(engine);

    // Still P1's turn — hand-step is forced before the turn can pass.
    expectPlayer(p1).toBeTurnPlayer().toBeInPhase("end-phase", "hand-step");
    expectPlayer(p1).toHaveHandCount(11);

    p1.must.discardToHandLimit(discardCard);

    // After the discard, cleanup finishes and the turn passes to P2.
    expectPlayer(p1).toHaveHandCount(10).toHaveZoneCount("trash", 1);
    expectCard(p1, discardCard).toBeIn("trash");
    expectPlayer(p2).toBeTurnPlayer().toBeInPhase("main-phase");
  });

  it("4-9-1 / 5-10-2: destroyed Unit is placed in the trash", () => {
    const defender = createMockUnit({ ap: 0, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      { play: [{ card: defender, exhausted: true }] },
    );

    resolveBattle(engine, st01Gundam001, defender);
    expectCard(engine.asPlayer(PLAYER_TWO), defender).toBeIn("trash");
  });

  // 4-4-2: You may have up to 15 Resources in your resource area.
  // 4-4-2-1 (EX Resource cap of 5) is intentionally not covered here.
  it("4-4-2: resource area stays at most 15 after resource-phase placement", () => {
    const resources = Array.from({ length: 15 }, () => ({
      card: createMockResource(),
      exhausted: false,
    }));
    const engine = GundamTestEngine.create(
      {
        play: [st01Gundam001],
        resourceArea: resources,
        resourceDeck: 3,
        deck: 8,
      },
      { deck: 8, resourceDeck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectPlayer(p1).toHaveResourceCount(15);

    // Full turn cycle so P1's Resource Phase runs again with deck remaining.
    endTurn(engine);
    endTurn(engine);

    // Cap holds: no 16th resource is placed.
    expectPlayer(p1).toHaveResourceCount(15);
  });
});
