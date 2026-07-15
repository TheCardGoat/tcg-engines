import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
} from "@tcg/gundam-engine";
import { st04AegisGundamMaMode007 } from "./007-aegis-gundam-ma-mode.ts";

describe("Aegis Gundam (MA Mode) (ST04-007)", () => {
  it("<Breach 3> deals 3 damage to the defender's top shield on kill", () => {
    const defender = createMockUnit({ ap: 1, hp: 1 });
    const shieldSeed = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [st04AegisGundamMaMode007] },
      { play: [{ card: defender, exhausted: true }], shieldArea: [shieldSeed] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const aegisId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(aegisId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(shieldId)).toBe(`trash:${PLAYER_TWO}`);
  });
});
