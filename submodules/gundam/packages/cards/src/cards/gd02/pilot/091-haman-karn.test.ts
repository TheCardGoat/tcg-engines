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
import { gd02HamanKarn091 } from "./091-haman-karn.ts";

describe("Haman Karn (GD02-091)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02HamanKarn091] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstChoice = p2.getBoardView().pendingChoice;
    if (burstChoice?.kind !== "optional") {
      throw new Error("Expected Haman Karn's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02HamanKarn091)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("damages an enemy Unit at or below the paired red Unit's Lv.", () => {
    const host = createMockUnit({ color: "red", level: 5, hp: 5 });
    const eligible = createMockUnit({ level: 5, hp: 4 });
    const tooHigh = createMockUnit({ level: 6, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02HamanKarn091],
        play: [host],
        resourceArea: activeResources(5),
      },
      { play: [eligible, tooHigh] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, tooHighId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd02HamanKarn091, hostId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Haman Karn to ask which eligible enemy Unit takes damage");
    }
    expect(choice.legalTargetIds).toEqual([eligibleId]);
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.getDamage(eligibleId!)).toBe(1);
    expect(p2.getDamage(tooHighId!)).toBe(0);
  });

  it("does not trigger when paired with a non-red Unit", () => {
    const host = createMockUnit({ color: "green", level: 5, hp: 5 });
    const enemy = createMockUnit({ level: 3, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02HamanKarn091],
        play: [host],
        resourceArea: activeResources(5),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd02HamanKarn091, hostId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(enemyId)).toBe(0);
  });

  it("requires both its printed Lv.5 and one active Resource to be paired", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02HamanKarn091],
      play: [createMockUnit({ name: "Low-Level Host" })],
      resourceArea: activeResources(4),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    const lowHostId = lowP1.getCardsInZone("battleArea")[0]!;

    expectFailure(lowP1.assignPilot(gd02HamanKarn091, lowHostId), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02HamanKarn091)).toBe(`hand:${PLAYER_ONE}`);
    expect(lowP1.getPilotId(lowHostId)).toBeUndefined();

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 5,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02HamanKarn091],
      play: [createMockUnit({ name: "Cost-Gate Host" })],
      resourceArea: activeResources(5),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.assignPilot(gd02HamanKarn091, hostId), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02HamanKarn091)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
