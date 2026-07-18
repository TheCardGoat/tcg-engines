import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd02Gquuuuuux034 } from "./034-gquuuuuux.ts";
import { gd02FourMurasame085 } from "../pilot/085-four-murasame.ts";
import { gd02HamanKarn091 } from "../pilot/091-haman-karn.ts";

describe("GQuuuuuuX (GD02-034)", () => {
  describe("Printed Lv.2 and cost 1", () => {
    it("cannot deploy with only 1 total Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02Gquuuuuux034],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play rests both Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02Gquuuuuux034],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    });
  });

  it("gets AP+2 while paired with a red Pilot", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Gquuuuuux034, gd02HamanKarn091],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(unitId));
    expectSuccess(p1.assignPilot(gd02HamanKarn091, unitId));

    expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(4);
  });

  it("does not get AP+2 while paired with a non-red Pilot", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Gquuuuuux034, gd02FourMurasame085],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(unitId));
    expectSuccess(p1.assignPilot(gd02FourMurasame085, unitId));

    expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(2);
  });
});
