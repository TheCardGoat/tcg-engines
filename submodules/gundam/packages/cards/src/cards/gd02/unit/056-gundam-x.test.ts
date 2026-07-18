import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02GundamX056 } from "./056-gundam-x.ts";
import { gd02GarrodRanTiffaAdill094 } from "../pilot/094-garrod-ran-tiffa-adill.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Gundam X (GD02-056)", () => {
  describe("Playing the Unit", () => {
    it("stays in hand below its printed Lv.4 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamX056],
        resourceArea: activeResources(3),
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
        hand: [spender, gd02GundamX056],
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

  describe("Link Condition: [Garrod Ran]", () => {
    it("becomes a Link Unit when paired with Garrod Ran", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02GarrodRanTiffaAdill094, linkCheck],
        play: [gd02GundamX056],
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

    it("does not become a Link Unit when paired with a different Pilot", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02JeridMessa086, linkCheck],
        play: [gd02GundamX056],
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

  describe("【During Pair･(Vulture) Pilot】【Destroyed】Choose 1 (Vulture) Unit card that is Lv.5 or higher from your trash. Add it to your hand.", () => {
    it("publishes only a Lv.5-or-higher Vulture Unit after the paired host is destroyed", () => {
      const pilot = createMockPilot({ traits: ["vulture"], level: 1, cost: 1 });
      const validTarget = createMockUnit({ traits: ["vulture"], level: 5 });
      const lowLevelVulture = createMockUnit({ traits: ["vulture"], level: 4 });
      const wrongTrait = createMockUnit({ traits: ["gjallarhorn"], level: 6 });
      const attacker = createMockUnit({ ap: 5, hp: 5 });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd02GundamX056],
          trash: [validTarget, lowLevelVulture, wrongTrait],
          resourceArea: activeResources(1),
          deck: 5,
        },
        { play: [attacker], shieldArea: [openingShield], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundamXId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;
      const [validTargetId] = p1.getCardsInZone("trash");

      expectSuccess(p1.assignPilot(pilot, gundamXId));
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [gundamXId]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      resolveUnitBattle(engine, PLAYER_TWO, attackerId, gundamXId);

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [validTargetId],
      });
      expectSuccess(p1.resolveEffect({ targets: [validTargetId!] }));

      expect(p1.getCardZone(gundamXId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(validTargetId!)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("does not trigger when paired with a non-Vulture Pilot", () => {
      const pilot = createMockPilot({ traits: ["gjallarhorn"], level: 1, cost: 1 });
      const validTarget = createMockUnit({ traits: ["vulture"], level: 5 });
      const attacker = createMockUnit({ ap: 5, hp: 5 });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd02GundamX056],
          trash: [validTarget],
          resourceArea: activeResources(1),
          deck: 5,
        },
        { play: [attacker], shieldArea: [openingShield], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundamXId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = p1.getCardsInZone("trash")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, gundamXId));
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [gundamXId]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      resolveUnitBattle(engine, PLAYER_TWO, attackerId, gundamXId);

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(targetId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("resolves without a prompt when no Vulture Unit card in trash is Lv.5 or higher", () => {
      const pilot = createMockPilot({ traits: ["vulture"], level: 1, cost: 1 });
      const lowLevelVulture = createMockUnit({ traits: ["vulture"], level: 4 });
      const wrongTrait = createMockUnit({ traits: ["gjallarhorn"], level: 6 });
      const attacker = createMockUnit({ ap: 5, hp: 5 });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd02GundamX056],
          trash: [lowLevelVulture, wrongTrait],
          resourceArea: activeResources(1),
          deck: 5,
        },
        { play: [attacker], shieldArea: [openingShield], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundamXId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;
      const existingTrashIds = p1.getCardsInZone("trash");

      expectSuccess(p1.assignPilot(pilot, gundamXId));
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [gundamXId]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      resolveUnitBattle(engine, PLAYER_TWO, attackerId, gundamXId);

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(gundamXId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("trash")).toEqual(expect.arrayContaining(existingTrashIds));
    });
  });
});
