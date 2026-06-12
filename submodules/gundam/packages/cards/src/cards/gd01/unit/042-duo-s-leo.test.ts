import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01DuoSLeo042 } from "./042-duo-s-leo.ts";

describe("Duo's Leo (GD01-042)", () => {
  it("card data declares a constant chooseAttackTarget effect", () => {
    const constant = gd01DuoSLeo042.effects?.find((e) => e.type === "constant");
    expect(constant).toBeDefined();
    // biome-ignore lint/suspicious/noExplicitAny: card-effect union is structurally tested
    const action = (constant as any).directives?.[0]?.action;
    expect(action?.action).toBe("chooseAttackTarget");
    expect(action?.attackTarget?.state).toBe("active");
    expect(action?.attackTarget?.attributeFilters?.[0]?.attribute).toBe("level");
    expect(action?.attackTarget?.attributeFilters?.[0]?.value).toBe(2);
  });

  it("can attack an active enemy Lv.2 unit (chooseAttackTarget constant grant)", () => {
    const enemyLv2 = createMockUnit({ ap: 1, hp: 2, level: 2 });
    const engine = GundamTestEngine.create(
      { play: [gd01DuoSLeo042], deck: 5 },
      { play: [enemyLv2], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const duoId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    // Duo's Leo should be able to attack the active enemy Lv.2 unit.
    expectSuccess(p1.enterBattle(duoId, enemyId));
  });
});
