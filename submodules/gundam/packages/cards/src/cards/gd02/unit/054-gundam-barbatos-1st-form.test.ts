import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, createMockUnit, expectSuccess } from "@tcg/gundam-engine";
import { gd02GundamBarbatos1stForm054 } from "./054-gundam-barbatos-1st-form.ts";

describe("Gundam Barbatos 1st Form (GD02-054)", () => {
  it("draws 1 on attack if this Unit is damaged", () => {
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd02GundamBarbatos1stForm054], deck: 5 },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [barbatosId] = p1.getCardsInZone("battleArea");
    const enemyId = engine.asPlayer("player_two").getCardsInZone("battleArea")[0]!;
    engine.getG().damage[barbatosId!] = 1;
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    expectSuccess(p1.enterBattle(barbatosId!, enemyId));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
  });
});
