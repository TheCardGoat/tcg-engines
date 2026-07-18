import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd02UndyingPersistence109 } from "../command/109-undying-persistence.ts";
import { gd02GarrodRanTiffaAdill094 } from "../pilot/094-garrod-ran-tiffa-adill.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import { gd02GundamLeopard064 } from "./064-gundam-leopard.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Gundam Leopard (GD02-064)", () => {
  it("requires its printed Lv.5 and four active Resources to deploy", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02GundamLeopard064],
      resourceArea: activeResources(4),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);

    expectFailure(lowP1.deployUnit(gd02GundamLeopard064), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02GundamLeopard064)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 5,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02GundamLeopard064],
      resourceArea: activeResources(5),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(setup));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployUnit(gd02GundamLeopard064), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02GundamLeopard064)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("Link Condition: (Vulture) Trait", () => {
    it("becomes a Link Unit when paired with a Vulture Pilot", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02GarrodRanTiffaAdill094, linkCheck],
        play: [gd02GundamLeopard064],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [pilotId, commandId] = p1.getHand();

      expectSuccess(p1.assignPilot(pilotId!, unitId));
      const apBefore = p1.getVisibleCard(unitId)?.effectiveAp;
      expectSuccess(p1.playCommand(commandId!));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected the Link check to ask which friendly Unit gets AP+1");
      }
      expect(choice.legalTargetIds).toEqual([unitId]);
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));

      expect(apBefore).toBeDefined();
      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(apBefore! + 1);
    });

    it("does not become a Link Unit when paired with a Pilot from another faction", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02JeridMessa086, linkCheck],
        play: [gd02GundamLeopard064],
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

  it("prevents damage from an enemy Command during its controller's turn with 7 cards in trash", () => {
    const trash = Array.from({ length: 7 }, () => createMockUnit());
    const engine = GundamTestEngine.create(
      { play: [gd02GundamLeopard064], trash, deck: 5 },
      {
        hand: [gd02UndyingPersistence109],
        resourceArea: activeResources(4),
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const leopardId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p2.getHand()[0]!;

    expectSuccess(p1.enterBattle(leopardId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.playCommand(commandId));
    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected the enemy Command's visible Unit damage choice");
    }
    expect(choice.legalTargetIds).toEqual([leopardId]);
    expectSuccess(p2.resolveEffect({ targets: [leopardId] }));

    expect(p1.getDamage(leopardId)).toBe(0);
    expect(p2.getCardZone(commandId)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("receives enemy Command damage with fewer than 7 cards in trash", () => {
    const trash = Array.from({ length: 6 }, () => createMockUnit());
    const engine = GundamTestEngine.create(
      { play: [gd02GundamLeopard064], trash, deck: 5 },
      {
        hand: [gd02UndyingPersistence109],
        resourceArea: activeResources(4),
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const leopardId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p2.getHand()[0]!;

    expectSuccess(p1.enterBattle(leopardId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.playCommand(commandId));
    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected the enemy Command's visible Unit damage choice");
    }
    expect(choice.legalTargetIds).toEqual([leopardId]);
    expectSuccess(p2.resolveEffect({ targets: [leopardId] }));

    expect(p1.getDamage(leopardId)).toBe(1);
  });

  it("receives enemy Command damage during the opponent's turn", () => {
    const trash = Array.from({ length: 7 }, () => createMockUnit());
    const engine = GundamTestEngine.create(
      { play: [gd02GundamLeopard064], trash },
      {
        hand: [gd02UndyingPersistence109],
        resourceArea: activeResources(4),
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const leopardId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p2.getHand()[0]!;

    expectSuccess(p2.playCommand(commandId));
    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected the enemy Command's visible Unit damage choice");
    }
    expect(choice.legalTargetIds).toEqual([leopardId]);
    expectSuccess(p2.resolveEffect({ targets: [leopardId] }));

    expect(p1.getDamage(leopardId)).toBe(1);
  });

  it("receives effect damage from its controller's own Command", () => {
    const friendlyDamageCommand = createMockCommand({
      name: "Friendly Damage Command",
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "dealDamage",
                amount: 1,
                target: { owner: "friendly", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "【Main】Choose 1 friendly Unit. Deal 1 damage to it.",
        },
      ],
    });
    const trash = Array.from({ length: 7 }, () => createMockUnit());
    const engine = GundamTestEngine.create({
      hand: [friendlyDamageCommand],
      play: [gd02GundamLeopard064],
      resourceArea: activeResources(1),
      trash,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const leopardId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected the friendly Command's visible Unit damage choice");
    }
    expect(choice.legalTargetIds).toEqual([leopardId]);
    expectSuccess(p1.resolveEffect({ targets: [leopardId] }));

    expect(p1.getDamage(leopardId)).toBe(1);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("receives effect damage from an enemy Unit effect", () => {
    const enemyEffectUnit = createMockUnit({
      name: "Enemy Effect Unit",
      effects: [
        {
          type: "activated",
          activation: { timing: ["activate:action"] },
          directives: [
            {
              action: {
                action: "dealDamage",
                amount: 1,
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "【Activate·Action】Choose 1 enemy Unit. Deal 1 damage to it.",
        },
      ],
    });
    const trash = Array.from({ length: 7 }, () => createMockUnit());
    const engine = GundamTestEngine.create(
      { play: [gd02GundamLeopard064], trash, deck: 5 },
      { play: [enemyEffectUnit], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const leopardId = p1.getCardsInZone("battleArea")[0]!;
    const enemyEffectUnitId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(leopardId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.activateAbility(enemyEffectUnitId, 0));
    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected the enemy Unit's visible effect-damage choice");
    }
    expect(choice.legalTargetIds).toEqual([leopardId]);
    expectSuccess(p2.resolveEffect({ targets: [leopardId] }));

    expect(p1.getDamage(leopardId)).toBe(1);
  });
});
