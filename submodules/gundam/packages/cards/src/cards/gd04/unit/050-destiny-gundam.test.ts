import { describe, it, expect } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd04DestinyGundam050 } from "./050-destiny-gundam.ts";

describe("Destiny Gundam (GD04-050)", () => {
  it("<High-Maneuver> prevents an enemy Blocker from intercepting its attack", () => {
    const blocker = createMockUnit({
      name: "Enemy Blocker",
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create({ play: [gd04DestinyGundam050] }, { play: [blocker] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const destinyId = p1.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(destinyId, "direct"));
    expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");

    expect(p2.isExhausted(blockerId)).toBe(false);
  });

  it("【During Pair】【Attack】may pay cost to deploy a Minerva Squad Unit from trash", () => {
    const pilot = createMockPilot({ name: "Shinn Asuka", cost: 1 });
    const target = createMockUnit({
      cardNumber: "TEST-MINERVA-TARGET",
      traits: ["minerva squad"],
      cost: 2,
    });
    const engine = GundamTestEngine.create({
      play: [gd04DestinyGundam050],
      hand: [pilot],
      trash: [target],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const destinyId = p1.getCardsInZone("battleArea")[0]!;
    const targetId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.assignPilot(pilot, destinyId));
    expectSuccess(p1.enterBattle(destinyId, "direct"));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
    expectSuccess(p1.resolveEffect({ targets: [targetId] }));

    expect(p1.getCardsInZone("battleArea")).toContain(targetId);
    expect(p1.getCardsInZone("trash")).not.toContain(targetId);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
  });

  it("may decline to deploy the Minerva Squad Unit from trash", () => {
    const pilot = createMockPilot({ name: "Shinn Asuka", cost: 1 });
    const target = createMockUnit({
      cardNumber: "TEST-MINERVA-DECLINED",
      traits: ["minerva squad"],
      cost: 2,
    });
    const engine = GundamTestEngine.create({
      play: [gd04DestinyGundam050],
      hand: [pilot],
      trash: [target],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const destinyId = p1.getCardsInZone("battleArea")[0]!;
    const targetId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.assignPilot(pilot, destinyId));
    expectSuccess(p1.enterBattle(destinyId, "direct"));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

    expect(p1.getCardsInZone("trash")).toContain(targetId);
    expect(p1.getCardsInZone("battleArea")).not.toContain(targetId);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
  });

  it("does not deploy from trash when unpaired", () => {
    const target = createMockUnit({
      cardNumber: "TEST-MINERVA-UNPAIRED",
      traits: ["minerva squad"],
      cost: 2,
    });
    const engine = GundamTestEngine.create({
      play: [gd04DestinyGundam050],
      trash: [target],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const destinyId = p1.getCardsInZone("battleArea")[0]!;
    const targetId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.enterBattle(destinyId, "direct"));

    expect(p1.getCardsInZone("battleArea")).not.toContain(targetId);
    expect(p1.getCardsInZone("trash")).toContain(targetId);
  });
});
