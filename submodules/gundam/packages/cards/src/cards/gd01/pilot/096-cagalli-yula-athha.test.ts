import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01CagalliYulaAthha096 } from "./096-cagalli-yula-athha.ts";

describe("Cagalli Yula Athha (GD01-096)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd01CagalliYulaAthha096] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd01CagalliYulaAthha096)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("grants Blocker while paired with a white Unit", () => {
    const whiteUnit = createMockUnit({ color: "white", ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd01CagalliYulaAthha096],
      play: [whiteUnit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01CagalliYulaAthha096, unitId));

    expect(p1.getVisibleCard(unitId)?.keywords).toContain("Blocker");
  });

  it("does not grant Blocker while paired with a non-white Unit", () => {
    const blueUnit = createMockUnit({ color: "blue", ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd01CagalliYulaAthha096],
      play: [blueUnit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01CagalliYulaAthha096, unitId));

    expect(p1.getVisibleCard(unitId)?.keywords).not.toContain("Blocker");
  });
});
