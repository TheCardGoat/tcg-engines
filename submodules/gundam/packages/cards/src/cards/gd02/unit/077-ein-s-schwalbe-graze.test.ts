import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  expectFailure,
  expectSuccess,
  createMockUnit,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd02EinSSchwalbeGraze077 } from "./077-ein-s-schwalbe-graze.ts";
import { gd02GaelioBauduin099 } from "../pilot/099-gaelio-bauduin.ts";
import { gd02LafterFrankland095 } from "../pilot/095-lafter-frankland.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Ein's Schwalbe Graze (GD02-077)", () => {
  it("cannot deploy below its printed Lv.4 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02EinSSchwalbeGraze077],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(gd02EinSSchwalbeGraze077), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd02EinSSchwalbeGraze077)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("Link Condition: (Gjallarhorn) Trait", () => {
    it("becomes a Link Unit when paired with a Gjallarhorn Pilot", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02GaelioBauduin099, linkCheck],
        play: [gd02EinSSchwalbeGraze077],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [pilotId, commandId] = p1.getHand();

      expectSuccess(p1.assignPilot(pilotId!, unitId));
      const apBefore = p1.getVisibleCard(unitId)?.effectiveAp;
      expectSuccess(p1.playCommand(commandId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [unitId],
      });
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));

      expect(apBefore).toBeDefined();
      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(apBefore! + 1);
    });

    it("does not become a Link Unit when paired with a Pilot from another faction", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02LafterFrankland095, linkCheck],
        play: [gd02EinSSchwalbeGraze077],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [pilotId, commandId] = p1.getHand();

      expectSuccess(p1.assignPilot(pilotId!, unitId));
      expectFailure(p1.playCommand(commandId!), "NO_LEGAL_TARGETS");

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  it("deploys from hand and exposes its combat stats", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02EinSSchwalbeGraze077],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02EinSSchwalbeGraze077));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 4, effectiveHp: 3 });
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("cannot deploy without enough active Resources", () => {
    const resourceSpender = createMockUnit({ level: 1, cost: 3 });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02EinSSchwalbeGraze077],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(resourceSpender));
    expectFailure(p1.deployUnit(gd02EinSSchwalbeGraze077), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02EinSSchwalbeGraze077)).toBe(`hand:${PLAYER_ONE}`);
  });
});
