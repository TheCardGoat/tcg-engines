import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02GundamAge1Titus027 } from "./027-gundam-age-1-titus.ts";

describe("Gundam AGE-1 Titus (GD02-027)", () => {
  it("<Breach 3> deals 3 damage to a shield when the attacker destroys a Unit", () => {
    const defender = createMockUnit({ ap: 1, hp: 1 });
    const shieldSeed = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd02GundamAge1Titus027] },
      { play: [defender], deck: [shieldSeed] },
    );
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const titusId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(titusId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    // AGE-1 Titus (AP 5) destroys defender (HP 1) -> Breach 3 lands on the shield.
    expect(getDamageCounter(engine, shieldId!)).toBe(3);
  });
});
