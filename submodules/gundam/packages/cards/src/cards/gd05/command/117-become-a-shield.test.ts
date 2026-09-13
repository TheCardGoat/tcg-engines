import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05BecomeAShield117 } from "./117-become-a-shield.ts";

describe("Become a Shield (GD05-117)", () => {
  /** @behavioral-proof complete: Main and Action timing, one friendly plus one enemy target, and exact simultaneous one-damage results are public. */
  it("deals 1 damage to the chosen friendly Unit and chosen enemy Unit", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd05BecomeAShield117],
        play: [createMockUnit({ hp: 4 })],
        resourceArea: activeResources(3),
      },
      { play: [createMockUnit({ hp: 4 })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd05BecomeAShield117));
    expectSuccess(p1.resolveEffect({ targets: [friendlyId, enemyId] }));

    expect(p1.getDamage(friendlyId)).toBe(1);
    expect(p2.getDamage(enemyId)).toBe(1);
  });

  it("plays in the Action step and damages both the friendly defender and enemy attacker", () => {
    const defender = createMockUnit({ hp: 4 });
    const attacker = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05BecomeAShield117],
        play: [defender],
        resourceArea: activeResources(3),
      },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const defenderId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.playCommand(gd05BecomeAShield117));
    expectSuccess(p1.resolveEffect({ targets: [defenderId, attackerId] }));

    expect(p1.getDamage(defenderId)).toBe(1);
    expect(p2.getDamage(attackerId)).toBe(1);
  });
});
