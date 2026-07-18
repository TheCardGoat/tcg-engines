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
import { gd02AllRangeAttack107 } from "./107-all-range-attack.ts";

describe("All-Range Attack (GD02-107)", () => {
  it("【Burst】 asks for an enemy Unit and deals 1 damage to the chosen target", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const otherEnemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd02AllRangeAttack107] },
      { play: [attacker, otherEnemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [attackerId, otherEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.enterBattle(attackerId!, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    const burstChoice = p1.getBoardView().pendingChoice;
    if (burstChoice?.kind !== "optional") {
      throw new Error("Expected All-Range Attack's visible Burst choice");
    }
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible enemy Unit damage choice");
    }
    expect(choice.legalTargetIds).toEqual(expect.arrayContaining([attackerId, otherEnemyId]));
    expectSuccess(p1.resolveEffect({ targets: [otherEnemyId!] }));

    expect(p2.getDamage(attackerId!)).toBe(0);
    expect(p2.getDamage(otherEnemyId!)).toBe(1);
  });

  it("【Main】 damages every enemy non-Link Unit and leaves Link Units untouched", () => {
    const linkUnit = createMockUnit({
      name: "Link Unit",
      hp: 5,
      linkCondition: "[Link Pilot]",
    });
    const plainUnit = createMockUnit({ name: "Plain Unit", hp: 5 });
    const linkPilot = createMockPilot({ name: "Link Pilot", level: 1, cost: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02AllRangeAttack107],
        resourceArea: activeResources(4),
        deck: 3,
      },
      {
        hand: [linkPilot],
        play: [linkUnit, plainUnit],
        resourceArea: activeResources(2),
        deck: 3,
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [linkUnitId, plainUnitId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.assignPilot(linkPilot, linkUnitId!));
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.playCommand(gd02AllRangeAttack107));

    expect(p2.getDamage(linkUnitId!)).toBe(0);
    expect(p2.getDamage(plainUnitId!)).toBe(1);
    expect(p1.getCardZone(gd02AllRangeAttack107)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot activate its Main effect during a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02AllRangeAttack107],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd02AllRangeAttack107), "WRONG_TIMING");
  });

  it("enforces both its printed Lv.4 and active Resource cost 2", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02AllRangeAttack107],
      resourceArea: activeResources(3),
    });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).playCommand(gd02AllRangeAttack107),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowLevel.asPlayer(PLAYER_ONE).getCardZone(gd02AllRangeAttack107)).toBe(
      `hand:${PLAYER_ONE}`,
    );

    const setup = createMockCommand({
      level: 0,
      cost: 3,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02AllRangeAttack107],
      resourceArea: activeResources(4),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.playCommand(gd02AllRangeAttack107), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02AllRangeAttack107)).toBe(`hand:${PLAYER_ONE}`);
  });
});
