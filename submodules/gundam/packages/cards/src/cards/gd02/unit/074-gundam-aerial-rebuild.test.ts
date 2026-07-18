import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02GundamAerialRebuild074 } from "./074-gundam-aerial-rebuild.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Gundam Aerial Rebuild (GD02-074)", () => {
  it("requires its printed Lv.7 and five active Resources to deploy", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02GundamAerialRebuild074],
      resourceArea: activeResources(6),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);

    expectFailure(lowP1.deployUnit(gd02GundamAerialRebuild074), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02GundamAerialRebuild074)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 7,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02GundamAerialRebuild074],
      resourceArea: activeResources(7),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(setup));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployUnit(gd02GundamAerialRebuild074), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02GundamAerialRebuild074)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("Link Condition: [Suletta Mercury]", () => {
    it("becomes a Link Unit when paired with Suletta Mercury", () => {
      const pilot = createMockPilot({ name: "Suletta Mercury", level: 1, cost: 1 });
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [pilot, linkCheck],
        play: [gd02GundamAerialRebuild074],
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

    it("does not become a Link Unit when paired with a different Pilot", () => {
      const pilot = createMockPilot({ name: "Elan Ceres", level: 1, cost: 1 });
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [pilot, linkCheck],
        play: [gd02GundamAerialRebuild074],
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

  describe("<High-Maneuver>", () => {
    it("prevents an enemy Blocker from intercepting its attack", () => {
      const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
      const engine = GundamTestEngine.create(
        { play: [gd02GundamAerialRebuild074] },
        { play: [blocker], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");

      expect(p2.isExhausted(blockerId)).toBe(false);
    });
  });

  describe("【During Pair】While there are 4 or more Command cards in your trash, this Unit gains <Blocker>.", () => {
    it("blocks a direct attack while paired with 4 Commands in trash", () => {
      const pilot = createMockPilot({ level: 1, cost: 1 });
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker], deck: 5 },
        {
          hand: [pilot],
          play: [gd02GundamAerialRebuild074],
          trash: Array.from({ length: 4 }, () => createMockCommand()),
          resourceArea: activeResources(1),
          deck: 5,
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const aerialId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.assignPilot(pilot, aerialId));
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.declareBlock(aerialId));

      expect(p2.isExhausted(aerialId)).toBe(true);
    });

    it("does not count Unit cards toward the 4-Command trash threshold", () => {
      const pilot = createMockPilot({ level: 1, cost: 1 });
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker], deck: 5 },
        {
          hand: [pilot],
          play: [gd02GundamAerialRebuild074],
          trash: [
            ...Array.from({ length: 3 }, () => createMockCommand()),
            createMockUnit(),
            createMockUnit(),
          ],
          resourceArea: activeResources(1),
          deck: 5,
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const aerialId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.assignPilot(pilot, aerialId));
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectFailure(p2.declareBlock(aerialId), "CANNOT_BLOCK_DIRECT");

      expect(p2.isExhausted(aerialId)).toBe(false);
      expect(p2.getBoardView().players[PLAYER_TWO]?.trashCount).toBe(5);
    });

    it("cannot block with 4 Commands in trash while unpaired", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker], deck: 5 },
        {
          play: [gd02GundamAerialRebuild074],
          trash: Array.from({ length: 4 }, () => createMockCommand()),
          deck: 5,
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const aerialId = p2.getCardsInZone("battleArea")[0]!;

      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectFailure(p2.declareBlock(aerialId), "CANNOT_BLOCK_DIRECT");

      expect(p2.isExhausted(aerialId)).toBe(false);
    });
  });
});
