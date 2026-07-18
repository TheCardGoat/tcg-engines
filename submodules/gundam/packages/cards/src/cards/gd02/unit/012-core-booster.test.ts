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
import { gd02CoreBooster012 } from "./012-core-booster.ts";

describe("Core Booster (GD02-012)", () => {
  describe("Link Condition: (White Base Team) Trait", () => {
    it("can attack on its deploy turn after a White Base Team Pilot is paired", () => {
      const whiteBasePilot = createMockPilot({
        traits: ["white base team"],
        level: 1,
        cost: 1,
      });
      const engine = GundamTestEngine.create({
        hand: [gd02CoreBooster012, whiteBasePilot],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02CoreBooster012));
      const boosterId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(whiteBasePilot, boosterId));
      expectSuccess(p1.enterBattle(boosterId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: boosterId });
    });

    it("cannot attack on its deploy turn after a Pilot from another team is paired", () => {
      const otherPilot = createMockPilot({ traits: ["zeon"], level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [gd02CoreBooster012, otherPilot],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02CoreBooster012));
      const boosterId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(otherPilot, boosterId));

      expectFailure(p1.enterBattle(boosterId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  it("deploys from hand as the 2 AP / 2 HP Unit shown to the player", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02CoreBooster012],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cardId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(cardId));

    expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(cardId)).toMatchObject({ effectiveAp: 2, effectiveHp: 2 });
  });

  it("cannot deploy below its printed Lv.2 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02CoreBooster012],
      resourceArea: activeResources(1),
    });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const cardId = p1.getHand()[0]!;

    expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

    expect(p1.getHand()).toContain(cardId);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
  });

  it("cannot deploy after another legal play leaves only 1 active Resource", () => {
    const spender = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [spender, gd02CoreBooster012],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(spender));
    const cardId = p1.getHand()[0]!;

    expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

    expect(p1.getHand()).toContain(cardId);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
  });
});
