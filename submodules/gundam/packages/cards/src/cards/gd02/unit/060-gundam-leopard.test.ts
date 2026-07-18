import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd02GundamLeopard060 } from "./060-gundam-leopard.ts";
import { gd02ComradesComeFirst116 } from "../command/116-comrades-come-first.ts";
import { gd02GarrodRanTiffaAdill094 } from "../pilot/094-garrod-ran-tiffa-adill.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Gundam Leopard (GD02-060)", () => {
  describe("Playing the Unit", () => {
    it("stays in hand below its printed Lv.5 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamLeopard060],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("stays in hand after another legal deployment leaves too few active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GundamLeopard060],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("Link Condition: [Roybea Loy]", () => {
    it("becomes a Link Unit when paired with Roybea Loy", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02ComradesComeFirst116, linkCheck],
        play: [gd02GundamLeopard060],
        resourceArea: activeResources(3),
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

    it("does not become a Link Unit when paired with a different Pilot", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02GarrodRanTiffaAdill094, linkCheck],
        play: [gd02GundamLeopard060],
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

  it("【Deploy】 offers only an enemy Unit that is Lv.4 or lower and rests it", () => {
    const trash = Array.from({ length: 7 }, () => createMockUnit());
    const legalEnemy = createMockUnit({ level: 4 });
    const highLevelEnemy = createMockUnit({ level: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamLeopard060],
        trash,
        resourceArea: activeResources(5),
      },
      { play: [legalEnemy, highLevelEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [legalEnemyId, highLevelEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd02GundamLeopard060));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [legalEnemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [legalEnemyId!] }));

    expect(p2.isExhausted(legalEnemyId!)).toBe(true);
    expect(p2.isExhausted(highLevelEnemyId!)).toBe(false);
  });

  it("does not offer a target with fewer than 7 cards in trash", () => {
    const trash = Array.from({ length: 6 }, () => createMockUnit());
    const enemy = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamLeopard060],
        trash,
        resourceArea: activeResources(5),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd02GundamLeopard060));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(enemyId)).toBe(false);
  });

  it("does not offer an enemy Unit above Lv.4", () => {
    const trash = Array.from({ length: 7 }, () => createMockUnit());
    const enemy = createMockUnit({ level: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamLeopard060],
        trash,
        resourceArea: activeResources(5),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02GundamLeopard060));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
