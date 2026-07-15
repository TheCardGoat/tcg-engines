import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { st07GundamKyriosFlightMode008 } from "./008-gundam-kyrios-flight-mode.ts";

describe("Gundam Kyrios (Flight Mode) (ST07-008)", () => {
  it("can be deployed with 2 resources by paying 2", () => {
    const engine = GundamTestEngine.create({
      hand: [st07GundamKyriosFlightMode008],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(unitId));

    expect(p1.getCardsInZone("battleArea")).toContain(unitId);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 3, effectiveHp: 1 });
  });
});
