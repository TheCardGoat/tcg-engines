import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  createMockBase,
  expectSuccess,
  findStatModifier,
  isCardExhausted,
} from "@tcg/gundam-engine";
import { gd02RickDiasRed075 } from "./075-rick-dias-red.ts";

describe("Rick Dias (Red) (GD02-075)", () => {
  it("【Attack】rests a friendly Base and applies AP-2 to an enemy Unit Lv.4 or lower", () => {
    const base = createMockBase({ hp: 5 });
    const enemy = createMockUnit({ ap: 3, hp: 5, level: 3 });
    const engine = GundamTestEngine.create(
      {
        play: [gd02RickDiasRed075],
        baseSection: [base],
        deck: 5,
      },
      { play: [{ card: enemy, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    // Ensure attacker is ready and not deploy-sick
    engine.getG().exhausted[attackerId] = false;
    engine.getG().turnMetadata.deployedThisTurn = [];

    expectSuccess(p1.enterBattle(attackerId, enemyId));

    // Base should be rested
    expect(isCardExhausted(engine, baseId)).toBe(true);
    // Enemy should have AP-2 continuous effect
    const mod = findStatModifier(engine, enemyId, "ap");
    expect(mod).toBeDefined();
    expect(mod!.modifier).toBe(-2);
  });

  it("【Attack】does NOT apply AP-2 when no active friendly Base is available", () => {
    const base = createMockBase({ hp: 5 });
    const enemy = createMockUnit({ ap: 3, hp: 5, level: 3 });
    const engine = GundamTestEngine.create(
      {
        play: [gd02RickDiasRed075],
        baseSection: [{ card: base, exhausted: true }],
        deck: 5,
      },
      { play: [{ card: enemy, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    engine.getG().exhausted[attackerId] = false;
    engine.getG().turnMetadata.deployedThisTurn = [];

    expectSuccess(p1.enterBattle(attackerId, enemyId));

    // No active base available → rest finds no target → dependsOnPrevious skips AP-2
    const mod = findStatModifier(engine, enemyId, "ap");
    expect(mod).toBeUndefined();
  });
});
