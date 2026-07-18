import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  expectFailure,
  expectSuccess,
  createMockUnit,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd02LaudaSDilanza084 } from "./084-lauda-s-dilanza.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Lauda's Dilanza (GD02-084)", () => {
  it("cannot deploy below its printed Lv.2 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02LaudaSDilanza084],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(gd02LaudaSDilanza084), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd02LaudaSDilanza084)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("Link Condition: (Academy) Trait", () => {
    it("becomes a Link Unit when paired with an Academy Pilot", () => {
      const pilot = createMockPilot({ traits: ["academy"], level: 1, cost: 1 });
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [pilot, linkCheck],
        play: [gd02LaudaSDilanza084],
        resourceArea: activeResources(1),
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
      const pilot = createMockPilot({ traits: ["coordinator"], level: 1, cost: 1 });
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [pilot, linkCheck],
        play: [gd02LaudaSDilanza084],
        resourceArea: activeResources(1),
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
      hand: [gd02LaudaSDilanza084],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02LaudaSDilanza084));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 1, effectiveHp: 3 });
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("cannot deploy without enough active Resources", () => {
    const resourceSpender = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02LaudaSDilanza084],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(resourceSpender));
    expectFailure(p1.deployUnit(gd02LaudaSDilanza084), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02LaudaSDilanza084)).toBe(`hand:${PLAYER_ONE}`);
  });
});
