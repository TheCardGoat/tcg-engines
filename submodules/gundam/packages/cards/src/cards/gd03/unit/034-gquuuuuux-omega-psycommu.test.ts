import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03GquuuuuuxOmegaPsycommu034 } from "./034-gquuuuuux-omega-psycommu.ts";

describe("GQuuuuuuX (Omega Psycommu) (GD03-034)", () => {
  it("【Deploy】 deals 3 damage to the chosen enemy Unit", () => {
    const target = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create(
      { hand: [gd03GquuuuuuxOmegaPsycommu034], resourceArea: activeResources(8) },
      { play: [target] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const targetId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd03GquuuuuuxOmegaPsycommu034, { targets: [targetId] }));

    expect(engine.asPlayer(PLAYER_TWO).getDamage(targetId)).toBe(3);
    expect(p1.getCardZone(gd03GquuuuuuxOmegaPsycommu034)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("cannot choose a friendly Unit for its Deploy damage", () => {
    const friendly = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create({
      hand: [gd03GquuuuuuxOmegaPsycommu034],
      play: [friendly],
      resourceArea: activeResources(8),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.deployUnit(gd03GquuuuuuxOmegaPsycommu034, { targets: [friendlyId] }),
      "INVALID_TARGET",
    );

    expect(p1.getCardZone(gd03GquuuuuuxOmegaPsycommu034)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getDamage(friendlyId)).toBe(0);
  });

  it("<Suppression> destroys the first 2 Shields in one direct attack", () => {
    const firstShield = createMockUnit({ name: "First Shield" });
    const secondShield = createMockUnit({ name: "Second Shield" });
    const engine = GundamTestEngine.create(
      { play: [gd03GquuuuuuxOmegaPsycommu034] },
      { shieldArea: [firstShield, secondShield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    expect(p2.getCardsInZone("trash")).toHaveLength(2);
  });
});
