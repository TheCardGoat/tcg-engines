import { describe, it, expect } from "vite-plus/test";
import {
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd03FreedomGundamMeteor076 } from "./076-freedom-gundam-meteor.ts";

describe("Freedom Gundam (METEOR) (GD03-076)", () => {
  it("may return an enemy Unit after a friendly Triple Ship Alliance Unit deals battle damage to it", () => {
    const attacker = createMockUnit({
      traits: ["triple ship alliance"],
      ap: 2,
      hp: 6,
    });
    const defender = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [gd03FreedomGundamMeteor076, attacker] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[1]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

    expect(p2.getCardsInZone("hand")).toContain(defenderId);
    expect(p2.getCardsInZone("battleArea")).not.toContain(defenderId);
  });

  it("does not trigger for a non-Triple Ship Alliance damage source", () => {
    const attacker = createMockUnit({ traits: ["zaft"], ap: 2, hp: 6 });
    const defender = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [gd03FreedomGundamMeteor076, attacker] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[1]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(engine.resolveCombat({ attackerId, target: defenderId }));

    expect(p2.getCardsInZone("battleArea")).toContain(defenderId);
    expect(p2.getCardsInZone("hand")).not.toContain(defenderId);
  });
});
