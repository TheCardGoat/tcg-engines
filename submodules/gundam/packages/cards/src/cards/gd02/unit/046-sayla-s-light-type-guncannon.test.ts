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
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02DaughtressWeapon043 } from "./043-daughtress-weapon.ts";
import { gd02SaylaSLightTypeGuncannon046 } from "./046-sayla-s-light-type-guncannon.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Sayla's Light-Type Guncannon (GD02-046)", () => {
  describe("Playing the Unit", () => {
    it("stays in hand below its printed Lv.4 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02SaylaSLightTypeGuncannon046],
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
        hand: [spender, gd02SaylaSLightTypeGuncannon046],
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

  describe("Link Condition: [Sayla Mass]", () => {
    it("becomes a Link Unit when paired with Sayla Mass", () => {
      const pilot = createMockPilot({ name: "Sayla Mass", level: 1, cost: 1 });
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [pilot, linkCheck],
        play: [gd02SaylaSLightTypeGuncannon046],
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
      const pilot = createMockPilot({ name: "Amuro Ray", level: 1, cost: 1 });
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [pilot, linkCheck],
        play: [gd02SaylaSLightTypeGuncannon046],
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

  describe("【Deploy】Choose 1 enemy Unit token. Deal 2 damage to it.", () => {
    it("publishes the enemy Unit-token choice and deals 2 damage to the selected token", () => {
      const friendlyNewUne = createMockUnit({ traits: ["new une"], hp: 4 });
      const enemyNewUne = createMockUnit({ traits: ["new une"], hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02DaughtressWeapon043, gd02SaylaSLightTypeGuncannon046],
          play: [friendlyNewUne],
          resourceArea: activeResources(6),
          deck: 5,
        },
        {
          hand: [gd02DaughtressWeapon043],
          play: [enemyNewUne],
          resourceArea: activeResources(2),
          deck: 5,
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const friendlyNewUneId = p1.getCardsInZone("battleArea")[0]!;
      const enemyNewUneId = p2.getCardsInZone("battleArea")[0]!;
      const [friendlyProducerId, guncannonId] = p1.getHand();
      const enemyProducerId = p2.getHand()[0]!;

      expectSuccess(p2.deployUnit(enemyProducerId));
      const enemyTokenId = p2
        .getCardsInZone("battleArea")
        .find((id) => id !== enemyNewUneId && id !== enemyProducerId);
      expect(enemyTokenId).toBeDefined();
      expect(p2.isExhausted(enemyTokenId!)).toBe(true);
      expect(p2.getVisibleCard(enemyTokenId!)).toMatchObject({ effectiveAp: 0, effectiveHp: 1 });
      passTurnThroughPublicMoves(engine, PLAYER_TWO);

      expectSuccess(p1.deployUnit(friendlyProducerId!));
      const friendlyTokenId = p1
        .getCardsInZone("battleArea")
        .find((id) => id !== friendlyNewUneId && id !== friendlyProducerId);
      expect(friendlyTokenId).toBeDefined();
      expect(p1.isExhausted(friendlyTokenId!)).toBe(true);

      expectSuccess(p1.deployUnit(guncannonId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyTokenId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyTokenId!] }));

      expect(p2.getCardsInZone("battleArea")).not.toContain(enemyTokenId);
      expect(p2.getCardZone(enemyTokenId!)).toBeUndefined();
      expect(p2.getDamage(enemyNewUneId)).toBe(0);
      expect(p2.getDamage(enemyProducerId)).toBe(0);
      expect(p1.getDamage(friendlyTokenId!)).toBe(0);
    });

    it("deploys without a choice when the opponent has no Unit token", () => {
      const nonToken = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [gd02SaylaSLightTypeGuncannon046], resourceArea: activeResources(4) },
        { play: [nonToken] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const nonTokenId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd02SaylaSLightTypeGuncannon046));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(nonTokenId)).toBe(0);
      expect(p1.getCardZone(gd02SaylaSLightTypeGuncannon046)).toBe(`battleArea:${PLAYER_ONE}`);
    });
  });
});
