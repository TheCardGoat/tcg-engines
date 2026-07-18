import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01FortressDefense106 } from "../../gd01/command/106-fortress-defense.ts";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02Valedictorian105 } from "./105-valedictorian.ts";

describe("Valedictorian (GD02-105)", () => {
  it("protects the chosen Unit token from enemy battle damage during the battle", () => {
    const enemy = createMockUnit({ name: "Enemy", ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01FortressDefense106, gd02Valedictorian105],
        resourceArea: activeResources(7),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
        deck: 4,
      },
      {
        play: [enemy],
        shieldArea: [createMockUnit({ name: "Enemy Shield" })],
        deck: 4,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd01FortressDefense106));
    const tokenIds = p1.getCardsInZone("battleArea");
    expect(tokenIds).toHaveLength(2);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    const protectedTokenId = tokenIds[0]!;
    expectSuccess(p1.enterBattle(protectedTokenId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.playCommand(gd02Valedictorian105));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible Unit-token protection choice");
    }
    expect(choice.legalTargetIds).toEqual(expect.arrayContaining(tokenIds));
    expectSuccess(p1.resolveEffect({ targets: [protectedTokenId] }));
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getCardZone(protectedTokenId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getDamage(protectedTokenId)).toBe(0);
    expect(p2.getDamage(enemyId)).toBe(1);
    expect(p1.getBoardView().pendingCombat).toBeUndefined();

    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expectSuccess(p2.enterBattle(enemyId, protectedTokenId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getCardsInZone("battleArea")).not.toContain(protectedTokenId);
    expect(p1.getBoardView().pendingCombat).toBeUndefined();
  });

  it("does not prevent effect damage dealt by an enemy Unit during the battle", () => {
    const enemyEffectUnit = createMockUnit({
      name: "Enemy Effect Unit",
      ap: 1,
      hp: 5,
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
          sourceText: "【Activate･Action】Choose 1 enemy Unit. Deal 1 damage to it.",
        },
      ],
    });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01FortressDefense106, gd02Valedictorian105],
        resourceArea: activeResources(7),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
        deck: 4,
      },
      { play: [enemyEffectUnit], deck: 4 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd01FortressDefense106));
    const protectedTokenId = p1.getCardsInZone("battleArea")[0]!;
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.playCommand(gd02Valedictorian105));
    const protectionChoice = p1.getBoardView().pendingChoice;
    if (protectionChoice?.kind !== "targetSelection") {
      throw new Error("Expected a visible Unit-token protection choice");
    }
    expect(protectionChoice.legalTargetIds).toContain(protectedTokenId);
    expectSuccess(p1.resolveEffect({ targets: [protectedTokenId] }));
    expectSuccess(p2.activateAbility(enemyId, 0));
    const damageChoice = p2.getBoardView().pendingChoice;
    if (damageChoice?.kind !== "targetSelection") {
      throw new Error("Expected the enemy Unit's visible effect-damage choice");
    }
    expect(damageChoice.legalTargetIds).toContain(protectedTokenId);
    expectSuccess(p2.resolveEffect({ targets: [protectedTokenId] }));
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getCardsInZone("battleArea")).not.toContain(protectedTokenId);
    expect(p1.getBoardView().pendingCombat).toBeUndefined();
  });

  it("can be paired as Xavier Olivette instead of activating the Command", () => {
    const host = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd02Valedictorian105],
      play: [host],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
  });

  it("cannot activate during Main", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Valedictorian105],
      resourceArea: activeResources(2),
    });

    expectFailure(engine.asPlayer(PLAYER_ONE).playCommand(gd02Valedictorian105), "WRONG_TIMING");
  });

  it("enforces its printed Lv.2 and active Resource cost 1 in a legal Action step", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02Valedictorian105],
      resourceArea: activeResources(1),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    expectSuccess(lowP1.passPhase());
    expectSuccess(lowLevel.asPlayer(PLAYER_TWO).passActionStep());
    expectFailure(lowP1.playCommand(gd02Valedictorian105), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02Valedictorian105)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      level: 0,
      cost: 2,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02Valedictorian105],
      resourceArea: activeResources(2),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectSuccess(p1.passPhase());
    expectSuccess(insufficient.asPlayer(PLAYER_TWO).passActionStep());
    expectFailure(p1.playCommand(gd02Valedictorian105), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02Valedictorian105)).toBe(`hand:${PLAYER_ONE}`);
  });
});
