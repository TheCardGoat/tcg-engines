import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02HyakuShiki072 } from "./072-hyaku-shiki.ts";
import { gd02KamilleBidan097 } from "../pilot/097-kamille-bidan.ts";
import { gd02QuattroBajeena098 } from "../pilot/098-quattro-bajeena.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

function damageCommand() {
  return createMockCommand({
    level: 1,
    cost: 1,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 1,
              target: { owner: "opponent", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose 1 enemy Unit. Deal 1 damage to it.",
      },
    ],
  });
}

describe("Hyaku-Shiki (GD02-072)", () => {
  it("requires its printed Lv.5 and three active Resources to deploy", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02HyakuShiki072],
      resourceArea: activeResources(4),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);

    expectFailure(lowP1.deployUnit(gd02HyakuShiki072), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02HyakuShiki072)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 5,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02HyakuShiki072],
      resourceArea: activeResources(5),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(setup));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployUnit(gd02HyakuShiki072), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02HyakuShiki072)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("Link Condition: [Quattro Bajeena]", () => {
    it("becomes a Link Unit when paired with Quattro Bajeena", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02QuattroBajeena098, linkCheck],
        play: [gd02HyakuShiki072],
        resourceArea: activeResources(4),
        deck: [
          createMockUnit({ name: "Card drawn by Quattro Bajeena" }),
          createMockUnit({ name: "Card left in deck" }),
        ],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [pilotId, commandId] = p1.getHand();

      expectSuccess(p1.assignPilot(pilotId!, unitId));
      const discardChoice = p1.getBoardView().pendingChoice;
      if (discardChoice?.kind !== "targetSelection") {
        throw new Error("Expected Quattro Bajeena's visible discard choice after drawing");
      }
      const drawnCardId = discardChoice.legalTargetIds.find((id) => id !== commandId);
      if (!drawnCardId) throw new Error("Expected the newly drawn card to be discardable");
      expectSuccess(p1.resolveEffect({ targets: [drawnCardId] }));
      const apBefore = p1.getVisibleCard(unitId)?.effectiveAp;
      expectSuccess(p1.playCommand(commandId!));
      const linkChoice = p1.getBoardView().pendingChoice;
      if (linkChoice?.kind !== "targetSelection") {
        throw new Error("Expected the Link check to ask which friendly Unit gets AP+1");
      }
      expect(linkChoice.legalTargetIds).toEqual([unitId]);
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));

      expect(apBefore).toBeDefined();
      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(apBefore! + 1);
    });

    it("does not become a Link Unit when paired with a different Pilot", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02KamilleBidan097, linkCheck],
        play: [gd02HyakuShiki072],
        resourceArea: activeResources(5),
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

  describe("<Blocker>", () => {
    it("rests to redirect a direct attack to itself", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [gd02HyakuShiki072], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.declareBlock(blockerId));

      expect(p2.isExhausted(blockerId)).toBe(true);
      expect(p2.getBoardView().pendingCombat).toMatchObject({ attackerId, blockerId });
    });
  });

  describe("While a friendly white Base is in play, this Unit gains <Repair 1>.", () => {
    it("recovers 1 damage at the end of its controller's turn with a friendly white Base", () => {
      const whiteBase = createMockBase({ color: "white" });
      const command = damageCommand();
      const engine = GundamTestEngine.create(
        { play: [gd02HyakuShiki072], baseSection: [whiteBase], deck: 5 },
        { hand: [command], resourceArea: activeResources(1), deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hyakuShikiId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.playCommand(command));
      const choice = p2.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected the enemy Command's visible Unit damage choice");
      }
      expect(choice.legalTargetIds).toEqual([hyakuShikiId]);
      expectSuccess(p2.resolveEffect({ targets: [hyakuShikiId] }));
      expect(p1.getDamage(hyakuShikiId)).toBe(1);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      expect(p1.getDamage(hyakuShikiId)).toBe(0);
    });

    it("does not recover with a friendly non-white Base", () => {
      const blueBase = createMockBase({ color: "blue" });
      const command = damageCommand();
      const engine = GundamTestEngine.create(
        { play: [gd02HyakuShiki072], baseSection: [blueBase], deck: 5 },
        { hand: [command], resourceArea: activeResources(1), deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hyakuShikiId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.playCommand(command));
      const choice = p2.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected the enemy Command's visible Unit damage choice");
      }
      expect(choice.legalTargetIds).toEqual([hyakuShikiId]);
      expectSuccess(p2.resolveEffect({ targets: [hyakuShikiId] }));
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      expect(p1.getDamage(hyakuShikiId)).toBe(1);
    });
  });
});
