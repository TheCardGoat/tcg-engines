import { describe, it, expect } from "vite-plus/test";
import {
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd03FreedomGundam070 } from "./070-freedom-gundam.ts";

describe("Freedom Gundam (GD03-070)", () => {
  it("while this Unit is rested, friendly Shields cannot receive battle damage from enemy Units", () => {
    const attacker = createMockUnit({ ap: 4, hp: 5, level: 4, cost: 1 });
    const shield = createMockUnit({ name: "Shield" });
    const engine = GundamTestEngine.create(
      {
        play: [{ card: gd03FreedomGundam070, exhausted: true }],
        shieldArea: [shield],
        deck: 5,
      },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(1);
  });

  it("does not protect friendly Shields while this Unit is active", () => {
    const attacker = createMockUnit({ ap: 4, hp: 5, level: 4, cost: 1 });
    const shield = createMockUnit({ name: "Shield" });
    const engine = GundamTestEngine.create(
      { play: [gd03FreedomGundam070], shieldArea: [shield], deck: 5 },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(0);
    expect(p1.getCardZone(shield)).toBe(`trash:${PLAYER_ONE}`);
  });
});
