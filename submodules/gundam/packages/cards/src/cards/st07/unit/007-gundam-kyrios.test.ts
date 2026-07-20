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
  restedResources,
} from "@tcg/gundam-engine";
import { st07GundamKyrios007 } from "./007-gundam-kyrios.ts";

describe("Gundam Kyrios (ST07-007)", () => {
  it("deploys with printed 2 AP/3 HP for Lv.3 and cost 2", () => {
    const engine = GundamTestEngine.create({
      hand: [st07GundamKyrios007],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(st07GundamKyrios007));
    const id = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(id)).toMatchObject({ effectiveAp: 2, effectiveHp: 3 });
    expect(p1.getCardsInZone("resourceArea").filter((r) => p1.isExhausted(r))).toHaveLength(2);
  });

  it("requires Lv.3", () => {
    const engine = GundamTestEngine.create({
      hand: [st07GundamKyrios007],
      resourceArea: activeResources(2),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st07GundamKyrios007),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("requires two active resources", () => {
    const engine = GundamTestEngine.create({
      hand: [st07GundamKyrios007],
      resourceArea: restedResources(3),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st07GundamKyrios007),
      "INSUFFICIENT_RESOURCES",
    );
  });

  it("gets AP+2 on its turn while a friendly CB Pilot is paired in play", () => {
    const pilot = createMockPilot({
      name: "Allelujah Haptism",
      traits: ["cb"],
      level: 1,
      cost: 1,
      apBonus: 0,
    });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [st07GundamKyrios007],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const id = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(pilot, id));
    expect(p1.getVisibleCard(id)).toMatchObject({ effectiveAp: 4 });
  });

  it("accepts Hallelujah Haptism as its other printed Link Condition", () => {
    const pilot = createMockPilot({
      name: "Hallelujah Haptism",
      traits: ["cb"],
      level: 1,
      cost: 1,
      apBonus: 0,
    });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [st07GundamKyrios007],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const id = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(pilot, id));
    expect(p1.getVisibleCard(id)).toMatchObject({ effectiveAp: 4 });
  });

  it("does not get AP+2 from a non-CB Pilot", () => {
    const pilot = createMockPilot({
      name: "Other",
      traits: ["zeon"],
      level: 1,
      cost: 1,
      apBonus: 0,
    });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [st07GundamKyrios007],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const id = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(pilot, id));
    expect(p1.getVisibleCard(id)).toMatchObject({ effectiveAp: 2 });
  });

  it("does not count a CB Pilot still in hand", () => {
    const pilot = createMockPilot({ traits: ["cb"] });
    const engine = GundamTestEngine.create({ hand: [pilot], play: [st07GundamKyrios007] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expect(p1.getVisibleCard(p1.getCardsInZone("battleArea")[0]!)).toMatchObject({
      effectiveAp: 2,
    });
    expectSuccess(p1.passPhase());
  });

  it("does not count an opponent's CB Pilot", () => {
    const enemyPilot = createMockPilot({ traits: ["cb"] });
    const enemyHost = createMockUnit();
    const engine = GundamTestEngine.create(
      { play: [st07GundamKyrios007], deck: 5 },
      { hand: [enemyPilot], play: [enemyHost], resourceArea: activeResources(1), deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p2.assignPilot(enemyPilot, p2.getCardsInZone("battleArea")[0]!));
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());
    expect(p1.getVisibleCard(p1.getCardsInZone("battleArea")[0]!)).toMatchObject({
      effectiveAp: 2,
    });
  });

  it("loses the AP+2 during the opponent's turn", () => {
    const pilot = createMockPilot({
      name: "Allelujah Haptism",
      traits: ["cb"],
      level: 1,
      cost: 1,
      apBonus: 0,
    });
    const engine = GundamTestEngine.create(
      { hand: [pilot], play: [st07GundamKyrios007], resourceArea: activeResources(3), deck: 5 },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const id = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(pilot, id));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expect(p1.getVisibleCard(id)).toMatchObject({ effectiveAp: 2 });
  });
});
