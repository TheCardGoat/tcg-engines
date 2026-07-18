import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  expectFailure,
  expectSuccess,
  createMockUnit,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd02ZakuSleeves048 } from "./048-zaku-sleeves.ts";
import { gd02HamanKarn091 } from "../pilot/091-haman-karn.ts";
import { gd02QuattroBajeena098 } from "../pilot/098-quattro-bajeena.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Zaku III (Sleeves) (GD02-048)", () => {
  it("stays in hand below its printed Lv.3 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02ZakuSleeves048],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cardId = p1.getHand()[0]!;

    expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

    expect(p1.getHand()).toContain(cardId);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
  });

  describe("Link Condition: (Neo Zeon) Trait", () => {
    it("becomes a Link Unit when paired with a Neo Zeon Pilot", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02HamanKarn091, linkCheck],
        play: [gd02ZakuSleeves048],
        resourceArea: activeResources(5),
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
        hand: [gd02QuattroBajeena098, linkCheck],
        play: [gd02ZakuSleeves048],
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

  it("deploys from hand and rests 2 Resources", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02ZakuSleeves048],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cardId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(cardId));

    expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });

  it("stays in hand when its cost cannot be paid", () => {
    const resourceSpender = createMockUnit({ level: 1, cost: 2 });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02ZakuSleeves048],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cardId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(resourceSpender));
    expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

    expect(p1.getHand()).toContain(cardId);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
  });
});
