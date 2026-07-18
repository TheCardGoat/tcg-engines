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
import { gd02Zedas057 } from "./057-zedas.ts";
import { gd02DesilGalette096 } from "../pilot/096-desil-galette.ts";
import { gd02FlitAsuno088 } from "../pilot/088-flit-asuno.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

function pairedAttackFixture(enemyLevel = 4) {
  const pilot = createMockPilot({ level: 1, cost: 1 });
  const ally = createMockUnit({ hp: 4 });
  const enemy = createMockUnit({ level: enemyLevel, hp: 5 });
  const shield = createMockUnit({ name: "Opening Shield" });
  const engine = GundamTestEngine.create(
    {
      hand: [pilot],
      play: [gd02Zedas057, ally],
      resourceArea: activeResources(1),
    },
    { play: [enemy], shieldArea: [shield] },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const [zedasId, allyId] = p1.getCardsInZone("battleArea");
  const enemyId = p2.getCardsInZone("battleArea")[0]!;
  expectSuccess(p1.assignPilot(pilot, zedasId!));
  return { engine, p1, p2, zedasId: zedasId!, allyId: allyId!, enemyId };
}

describe("Zedas (GD02-057)", () => {
  describe("Playing the Unit", () => {
    it("stays in hand below its printed Lv.5 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02Zedas057],
        resourceArea: activeResources(4),
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
        hand: [spender, gd02Zedas057],
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

  describe("Link Condition: [Desil Galette]", () => {
    it("becomes a Link Unit when paired with Desil Galette", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02DesilGalette096, linkCheck],
        play: [gd02Zedas057],
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
        hand: [gd02FlitAsuno088, linkCheck],
        play: [gd02Zedas057],
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

  describe("【During Pair】【Attack】You may choose 1 of your other Units. Destroy it. If you do, choose 1 enemy Unit that is Lv.4 or lower. Deal 2 damage to it.", () => {
    it("publishes each choice, destroys the selected other Unit, and damages the legal enemy", () => {
      const { p1, p2, zedasId, allyId, enemyId } = pairedAttackFixture();

      expectSuccess(p1.enterBattle(zedasId, "direct"));
      const optional = p1.getBoardView().pendingChoice;
      if (optional?.kind !== "optional") {
        throw new Error("Expected Zedas to offer its optional destruction");
      }
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [allyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [allyId] }));
      expect(p1.getCardZone(allyId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p1.getCardZone(allyId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(zedasId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p2.getDamage(enemyId)).toBe(2);
    });

    it("lets the player decline without destroying or damaging anything", () => {
      const { p1, p2, zedasId, allyId, enemyId } = pairedAttackFixture();

      expectSuccess(p1.enterBattle(zedasId, "direct"));
      const optional = p1.getBoardView().pendingChoice;
      if (optional?.kind !== "optional") {
        throw new Error("Expected Zedas to offer its optional destruction");
      }
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: false } }));

      expect(p1.getCardZone(allyId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p2.getDamage(enemyId)).toBe(0);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("does not trigger while Zedas is unpaired", () => {
      const ally = createMockUnit({ hp: 4 });
      const enemy = createMockUnit({ level: 4, hp: 5 });
      const shield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        { play: [gd02Zedas057, ally] },
        { play: [enemy], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [zedasId, allyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(zedasId!, "direct"));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(allyId!)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p2.getDamage(enemyId)).toBe(0);
    });

    it("does not offer the sacrifice when no enemy Unit is Lv.4 or lower", () => {
      const { p1, zedasId, allyId } = pairedAttackFixture(5);

      expectSuccess(p1.enterBattle(zedasId, "direct"));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(allyId)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("does not offer the sacrifice when no other friendly Unit is in play", () => {
      const pilot = createMockPilot({ level: 1, cost: 1 });
      const enemy = createMockUnit({ level: 4, hp: 5 });
      const shield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd02Zedas057],
          resourceArea: activeResources(1),
        },
        { play: [enemy], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zedasId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, zedasId));
      expectSuccess(p1.enterBattle(zedasId, "direct"));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(zedasId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p2.getDamage(enemyId)).toBe(0);
    });
  });
});
