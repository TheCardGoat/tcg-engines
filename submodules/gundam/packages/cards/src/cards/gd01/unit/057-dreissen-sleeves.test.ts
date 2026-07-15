import { describe, expect, it } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { gd01DreissenSleeves057 } from "./057-dreissen-sleeves.ts";

describe("Dreissen (Sleeves) (GD01-057)", () => {
  it("deploys from hand and exposes its combat stats to the player", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01DreissenSleeves057],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01DreissenSleeves057));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 2, effectiveHp: 3 });
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });
});
