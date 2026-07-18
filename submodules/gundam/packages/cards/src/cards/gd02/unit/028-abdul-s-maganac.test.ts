import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02AbdulSMaganac028 } from "./028-abdul-s-maganac.ts";

describe("Abdul's Maganac (GD02-028)", () => {
  describe("Link Condition: (Maganac Corps) Trait", () => {
    it("can attack on its deploy turn after a Maganac Corps Pilot is paired", () => {
      const maganacPilot = createMockPilot({
        traits: ["maganac corps"],
        level: 1,
        cost: 1,
      });
      const engine = GundamTestEngine.create({
        hand: [gd02AbdulSMaganac028, maganacPilot],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02AbdulSMaganac028));
      const maganacId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(maganacPilot, maganacId));
      expectSuccess(p1.enterBattle(maganacId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: maganacId });
    });

    it("cannot attack on its deploy turn after a Pilot from another trait is paired", () => {
      const otherPilot = createMockPilot({ traits: ["oz"], level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [gd02AbdulSMaganac028, otherPilot],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02AbdulSMaganac028));
      const maganacId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(otherPilot, maganacId));

      expectFailure(p1.enterBattle(maganacId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  it("deploys from hand as the 3 AP / 3 HP Unit shown to the player", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02AbdulSMaganac028],
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
      hand: [gd02AbdulSMaganac028],
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
      hand: [spender, gd02AbdulSMaganac028],
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
