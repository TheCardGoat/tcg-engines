import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05VeteranSPride116 } from "./116-veteran-s-pride.ts";

describe("Veteran's Pride (GD05-116)", () => {
  /** @behavioral-proof complete: Main and Action timing, enemy ownership, Lv.2 boundary, target selection, and destruction result are public. */
  it("destroys the chosen enemy Unit at Lv.2 or lower", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd05VeteranSPride116], resourceArea: activeResources(2) },
      { play: [createMockUnit({ level: 2 }), createMockUnit({ level: 3 })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [eligible, ineligible] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(gd05VeteranSPride116));
    expectSuccess(p1.resolveEffect({ targets: [eligible!] }));

    expect(p2.getCardZone(eligible!)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(ineligible!)).toBe(`battleArea:${PLAYER_TWO}`);
  });

  it("plays in the Action step to destroy a Lv.2 attacking enemy", () => {
    const attacker = createMockUnit({ level: 2, ap: 2, hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd05VeteranSPride116], resourceArea: activeResources(2) },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.playCommand(gd05VeteranSPride116));
    expectSuccess(p1.resolveEffect({ targets: [attackerId] }));

    expect(p2.getCardZone(attackerId)).toBe(`trash:${PLAYER_TWO}`);
  });
});
