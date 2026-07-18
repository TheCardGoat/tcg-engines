import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  expectFailure,
  expectSuccess,
  createMockUnit,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd02GundamBarbatos3rdForm068 } from "./068-gundam-barbatos-3rd-form.ts";
import { gd02ItSNameIsRyuseiGo114 } from "../command/114-it-s-name-is-ryusei-go.ts";
import { gd02LafterFrankland095 } from "../pilot/095-lafter-frankland.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Gundam Barbatos 3rd Form (GD02-068)", () => {
  it("cannot deploy below its printed Lv.4 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02GundamBarbatos3rdForm068],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(gd02GundamBarbatos3rdForm068), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd02GundamBarbatos3rdForm068)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("Link Condition: (Tekkadan) Trait", () => {
    it("becomes a Link Unit when paired with a Tekkadan Pilot", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02ItSNameIsRyuseiGo114, linkCheck],
        play: [gd02GundamBarbatos3rdForm068],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [pilotId, commandId] = p1.getHand();

      expectSuccess(p1.playCommandAsPilot(pilotId!, unitId));
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
        play: [gd02GundamBarbatos3rdForm068],
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

  it("【Deploy】 deals 2 damage to itself", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02GundamBarbatos3rdForm068],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02GundamBarbatos3rdForm068));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getDamage(unitId)).toBe(2);
  });

  it("cannot deploy without enough active Resources", () => {
    const resourceSpender = createMockUnit({ level: 1, cost: 3 });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02GundamBarbatos3rdForm068],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(resourceSpender));
    expectFailure(p1.deployUnit(gd02GundamBarbatos3rdForm068), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02GundamBarbatos3rdForm068)).toBe(`hand:${PLAYER_ONE}`);
  });
});
