import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02RaiderGundamMaMode019 } from "./019-raider-gundam-ma-mode.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import { gd02OrgaCrotAndShani087 } from "../pilot/087-orga-crot-and-shani.ts";

describe("Raider Gundam (MA Mode) (GD02-019)", () => {
  describe("Link Condition: (Biological CPU) Trait", () => {
    it("can attack on its deploy turn after a Biological CPU Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02RaiderGundamMaMode019, gd02OrgaCrotAndShani087],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02RaiderGundamMaMode019));
      const raiderId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02OrgaCrotAndShani087, raiderId));
      expectSuccess(p1.enterBattle(raiderId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: raiderId });
    });

    it("cannot attack on its deploy turn after a non-Biological CPU Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02RaiderGundamMaMode019, gd02JeridMessa086],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02RaiderGundamMaMode019));
      const raiderId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02JeridMessa086, raiderId));

      expectFailure(p1.enterBattle(raiderId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  it("deploys from hand as the 4 AP / 3 HP Unit shown to the player", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02RaiderGundamMaMode019],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cardId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(cardId));

    expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(cardId)).toMatchObject({ effectiveAp: 4, effectiveHp: 3 });
  });

  it("cannot deploy below its printed Lv.4 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02RaiderGundamMaMode019],
      resourceArea: activeResources(3),
    });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const cardId = p1.getHand()[0]!;

    expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

    expect(p1.getHand()).toContain(cardId);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
  });

  it("cannot deploy after another legal play leaves only 1 active Resource", () => {
    const spender = createMockUnit({ level: 1, cost: 3 });
    const engine = GundamTestEngine.create({
      hand: [spender, gd02RaiderGundamMaMode019],
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
