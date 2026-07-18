import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd02GundamAge1Titus031 } from "./031-gundam-age-1-titus.ts";
import { gd02FlitAsuno088 } from "../pilot/088-flit-asuno.ts";

describe("Gundam AGE-1 Titus (GD02-031)", () => {
  describe("Printed Lv.4 and cost 2", () => {
    it("cannot deploy with only 3 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamAge1Titus031],
        resourceArea: activeResources(3),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 1 active Resource", () => {
      const spender = createMockUnit({ level: 1, cost: 3 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GundamAge1Titus031],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  it("gets AP+2 while its controller is Lv.7", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02GundamAge1Titus031],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(unitId));

    expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(4);
  });

  it("keeps its printed AP while its controller is below Lv.7", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02GundamAge1Titus031],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(unitId));

    expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(2);
  });

  it("can attack on its deployment turn after pairing Flit Asuno", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamAge1Titus031, gd02FlitAsuno088],
        resourceArea: activeResources(5),
      },
      { shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02GundamAge1Titus031));
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(gd02FlitAsuno088, unitId));

    expectSuccess(p1.enterBattle(unitId, "direct"));
  });
});
