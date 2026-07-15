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
import { gd01StrategicArms108 } from "./108-strategic-arms.ts";
import { gd01DeepDevotion101 } from "./101-deep-devotion.ts";

function linkFixture() {
  const pilot = createMockPilot({ name: "Setup Pilot", level: 1, cost: 1 });
  const host = createMockUnit({
    name: "Linked Blocker",
    ap: 2,
    hp: 8,
    linkCondition: "[Setup Pilot]",
    keywordEffects: [{ keyword: "Blocker" }],
  });
  return { pilot, host };
}

describe("Deep Devotion (GD01-101)", () => {
  it("【Main】 recovers 3 HP from a friendly Link Unit", () => {
    const { pilot, host } = linkFixture();
    const engine = GundamTestEngine.create({
      hand: [pilot, gd01StrategicArms108, gd01StrategicArms108, gd01DeepDevotion101],
      play: [host],
      resourceArea: activeResources(15),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [pilotId, firstArmsId, secondArmsId, commandId] = p1.getHand();

    expectSuccess(p1.assignPilot(pilotId!, hostId));
    expectSuccess(p1.playCommand(firstArmsId!));
    expectSuccess(p1.playCommand(secondArmsId!));
    expect(p1.getDamage(hostId)).toBe(4);
    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Deep Devotion to ask which friendly Link Unit recovers HP");
    }
    expect(choice.legalTargetIds).toEqual([hostId]);
    expectSuccess(p1.resolveEffect({ targets: [hostId] }));

    expect(p1.getDamage(hostId)).toBe(1);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("can recover a friendly Link Unit during a legally reached Action step", () => {
    const { pilot, host } = linkFixture();
    const engine = GundamTestEngine.create({
      hand: [pilot, gd01StrategicArms108, gd01DeepDevotion101],
      play: [host],
      resourceArea: activeResources(10),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, hostId));
    expectSuccess(p1.playCommand(gd01StrategicArms108));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd01DeepDevotion101));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Deep Devotion to ask which friendly Link Unit recovers HP");
    }
    expect(choice.legalTargetIds).toEqual([hostId]);
    expectSuccess(p1.resolveEffect({ targets: [hostId] }));

    expect(p1.getDamage(hostId)).toBe(0);
  });

  it("rejects a damaged friendly Unit that is not linked", () => {
    const host = createMockUnit({
      ap: 2,
      hp: 8,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create({
      hand: [gd01StrategicArms108, gd01DeepDevotion101],
      play: [host],
      resourceArea: activeResources(8),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd01StrategicArms108));
    expectFailure(p1.playCommand(gd01DeepDevotion101, { targets: [hostId] }), "INVALID_TARGET");

    expect(p1.getDamage(hostId)).toBe(2);
  });

  it("plays as Lucrezia Noin, applies AP+1/HP+0, and forms a Link through her printed name", () => {
    const host = createMockUnit({
      level: 0,
      cost: 0,
      ap: 2,
      hp: 3,
      linkCondition: "[Lucrezia Noin]",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [host, gd01DeepDevotion101],
        resourceArea: activeResources(2),
      },
      { shieldArea: [createMockUnit({ name: "Shield" })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, commandId] = p1.getHand();

    expectSuccess(p1.deployUnit(hostId!));
    expectSuccess(p1.playCommandAsPilot(commandId!, hostId!));

    expect(p1.getPilotId(hostId!)).toBe(commandId);
    expect(p1.getCardZone(commandId!)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(hostId!)?.effectiveAp).toBe(3);
    expect(p1.getVisibleCard(hostId!)?.effectiveHp).toBe(3);
    expectSuccess(p1.enterBattle(hostId!, "direct"));
  });

  it("cannot be played below its printed Lv.2 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01DeepDevotion101],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01DeepDevotion101), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01DeepDevotion101)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves no active Resources", () => {
    const setup = createMockCommand({
      name: "Resource Setup",
      level: 0,
      cost: 2,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [],
          sourceText: "【Main】Do nothing.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [setup, gd01DeepDevotion101],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
