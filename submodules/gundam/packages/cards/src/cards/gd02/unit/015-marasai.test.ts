import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02Marasai015 } from "./015-marasai.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import { gd02QuattroBajeena098 } from "../pilot/098-quattro-bajeena.ts";

describe("Marasai (GD02-015)", () => {
  describe("Link Condition: (Titans) Trait", () => {
    it("can attack on its deploy turn after a Titans Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02Marasai015, gd02JeridMessa086],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02Marasai015));
      const marasaiId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02JeridMessa086, marasaiId));
      expectSuccess(p1.enterBattle(marasaiId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: marasaiId });
    });

    it("cannot attack on its deploy turn after a non-Titans Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02Marasai015, gd02QuattroBajeena098],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02Marasai015));
      const marasaiId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02QuattroBajeena098, marasaiId));

      expectFailure(p1.enterBattle(marasaiId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  it("deploys from hand as the 3 AP / 3 HP Unit shown to the player", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Marasai015],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cardId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(cardId));

    expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(cardId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
  });

  it("cannot deploy below its printed Lv.3 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Marasai015],
      resourceArea: activeResources(2),
    });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const cardId = p1.getHand()[0]!;

    expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

    expect(p1.getHand()).toContain(cardId);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
  });

  it("cannot deploy after another legal play leaves only 1 active Resource", () => {
    const spender = createMockUnit({ level: 1, cost: 2 });
    const engine = GundamTestEngine.create({
      hand: [spender, gd02Marasai015],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(spender));
    const cardId = p1.getHand()[0]!;

    expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

    expect(p1.getHand()).toContain(cardId);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
  });
});
