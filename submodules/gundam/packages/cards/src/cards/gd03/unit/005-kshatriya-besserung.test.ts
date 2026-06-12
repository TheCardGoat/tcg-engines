import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03KshatriyaBesserung005 } from "./005-kshatriya-besserung.ts";

describe("Kshatriya Besserung (GD03-005)", () => {
  it("【Deploy】 draws 1 and has printed Repair 1", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03KshatriyaBesserung005],
      resourceArea: activeResources(6),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployUnit(gd03KshatriyaBesserung005));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(p1.getHand().length).toBe(handBefore);
    expect(getEffectiveStats(unitId, engine.getG(), framework.cards, framework).keywords).toContain(
      "Repair",
    );
  });
});
