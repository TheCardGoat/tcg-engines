import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01GundamDeathscythe025 } from "./025-gundam-deathscythe.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Gundam Deathscythe (GD01-025)", () => {
  it("places a rested Resource and uses First Strike after pairing an Operation Meteor Pilot", () => {
    const duo = createMockPilot({ name: "Duo Maxwell", traits: ["operation meteor"], cost: 1 });
    const defender = createMockUnit({ ap: 6, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [duo],
        play: [gd01GundamDeathscythe025],
        resourceArea: activeResources(6),
        resourceDeck: 2,
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [defender], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const deathscytheId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    const existingResources = new Set(p1.getCardsInZone("resourceArea"));
    expectSuccess(p1.assignPilot(duo, deathscytheId));
    const placedResourceId = p1
      .getCardsInZone("resourceArea")
      .find((resourceId) => !existingResources.has(resourceId));
    expect(p1.getResourceCount()).toBe(existingResources.size + 1);
    expect(placedResourceId).toBeDefined();
    expect(p1.isExhausted(placedResourceId!)).toBe(true);
    expectSuccess(p1.enterBattle(deathscytheId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getCardZone(deathscytheId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getDamage(deathscytheId)).toBe(0);
  });

  it("does not place a Resource or grant First Strike for a non-Operation Meteor Pilot", () => {
    const pilot = createMockPilot({ traits: ["zeon"], cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [gd01GundamDeathscythe025],
      resourceArea: activeResources(6),
      resourceDeck: 1,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const resourcesBefore = p1.getResourceCount();

    expectSuccess(p1.assignPilot(pilot, unitId));

    expect(p1.getResourceCount()).toBe(resourcesBefore);
    expect(p1.getVisibleCard(unitId)?.keywords).not.toContain("FirstStrike");
  });

  it("still grants First Strike when the Resource Area is already at its maximum", () => {
    const duo = createMockPilot({ traits: ["operation meteor"], cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [duo],
      play: [gd01GundamDeathscythe025],
      resourceArea: activeResources(15),
      resourceDeck: 1,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(duo, unitId));

    expect(p1.getResourceCount()).toBe(15);
    expect(p1.getVisibleCard(unitId)?.keywords).toContain("FirstStrike");
  });
});
