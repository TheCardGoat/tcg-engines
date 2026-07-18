import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd02Hyakuri061 } from "./061-hyakuri.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import { gd02LafterFrankland095 } from "../pilot/095-lafter-frankland.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Hyakuri (GD02-061)", () => {
  describe("Playing the Unit", () => {
    it("stays in hand below its printed Lv.4 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02Hyakuri061],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("stays in hand after another legal deployment leaves too few active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 3 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02Hyakuri061],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("Link Condition: (Teiwaz) Trait", () => {
    it("becomes a Link Unit when paired with a Teiwaz Pilot", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02LafterFrankland095, linkCheck],
        play: [gd02Hyakuri061],
        resourceArea: activeResources(4),
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
        hand: [gd02JeridMessa086, linkCheck],
        play: [gd02Hyakuri061],
        resourceArea: activeResources(3),
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

  it("【When Paired･Purple Pilot】 offers only an enemy Unit with 3 or less AP and rests it", () => {
    const pilot = createMockPilot({ color: "purple", level: 1, cost: 1 });
    const trash = [
      createMockUnit({ traits: ["teiwaz"] }),
      createMockUnit({ traits: ["tekkadan"] }),
      createMockUnit({ traits: ["tekkadan"] }),
    ];
    const friendlyUnit = createMockUnit({ ap: 2 });
    const legalEnemy = createMockUnit({ ap: 3 });
    const highApEnemy = createMockUnit({ ap: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd02Hyakuri061, friendlyUnit],
        trash,
        resourceArea: activeResources(4),
      },
      { play: [legalEnemy, highApEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hyakuriId, friendlyUnitId] = p1.getCardsInZone("battleArea");
    const [legalEnemyId, highApEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(pilot, hyakuriId!));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [legalEnemyId],
    });
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected target selection");
    expect(choice.legalTargetIds).not.toContain(friendlyUnitId);
    expect(choice.legalTargetIds).not.toContain(highApEnemyId);
    expectSuccess(p1.resolveEffect({ targets: [legalEnemyId!] }));

    expect(p2.isExhausted(legalEnemyId!)).toBe(true);
    expect(p2.isExhausted(highApEnemyId!)).toBe(false);
  });

  it("does not trigger with fewer than 3 matching cards in trash", () => {
    const pilot = createMockPilot({ color: "purple", level: 1, cost: 1 });
    const trash = [
      createMockUnit({ traits: ["teiwaz"] }),
      createMockUnit({ traits: ["tekkadan"] }),
      createMockUnit({ traits: ["gjallarhorn"] }),
    ];
    const enemy = createMockUnit({ ap: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd02Hyakuri061],
        trash,
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(enemyId)).toBe(false);
  });

  it("does not trigger when the paired Pilot is not purple", () => {
    const pilot = createMockPilot({ color: "red", level: 1, cost: 1 });
    const trash = Array.from({ length: 3 }, () => createMockUnit({ traits: ["teiwaz"] }));
    const enemy = createMockUnit({ ap: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd02Hyakuri061],
        trash,
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(enemyId)).toBe(false);
  });

  it("does not publish a target prompt when every enemy Unit has more than 3 AP", () => {
    const pilot = createMockPilot({ color: "purple", level: 1, cost: 1 });
    const trash = Array.from({ length: 3 }, () => createMockUnit({ traits: ["teiwaz"] }));
    const enemy = createMockUnit({ ap: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd02Hyakuri061],
        trash,
        resourceArea: activeResources(1),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(enemyId)).toBe(false);
  });
});
