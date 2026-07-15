import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03KshatriyaBesserung005 } from "./005-kshatriya-besserung.ts";

describe("Kshatriya Besserung (GD03-005)", () => {
  it("【Deploy】 draws 1 and leaves Kshatriya Besserung in the battle area", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03KshatriyaBesserung005],
      resourceArea: activeResources(6),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployUnit(gd03KshatriyaBesserung005));

    expect(p1.getHand().length).toBe(handBefore);
    expect(p1.getCardsInZone("deck")).toHaveLength(2);
    expect(p1.getCardZone(gd03KshatriyaBesserung005)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("<Repair 1> recovers 1 HP at the end of its controller's turn", () => {
    const engine = GundamTestEngine.create({
      play: [{ card: gd03KshatriyaBesserung005, damage: 2 }],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getDamage(unitId)).toBe(1);
  });
});
