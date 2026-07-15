import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01BusterGundam046 } from "./046-buster-gundam.ts";

describe("Buster Gundam (GD01-046)", () => {
  it("rests to give another friendly Unit AP+3 with Support", () => {
    const ally = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create({ play: [gd01BusterGundam046, ally] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [busterId, allyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.useSupport(busterId!, allyId!));

    expect(p1.isExhausted(busterId!)).toBe(true);
    expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(5);
  });

  it("sets itself active after its Support increases a ZAFT Unit while paired with a Coordinator", () => {
    const dearka = createMockPilot({
      name: "Dearka Elthman",
      traits: ["coordinator"],
      level: 1,
      cost: 1,
    });
    const zaftAlly = createMockUnit({ traits: ["zaft"], ap: 2, hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [dearka],
      play: [gd01BusterGundam046, zaftAlly],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [busterId, allyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(dearka, busterId!));
    expectSuccess(p1.useSupport(busterId!, allyId!));

    expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(5);
    expect(p1.isExhausted(busterId!)).toBe(false);
  });

  it("stays rested when the supported Unit is not ZAFT", () => {
    const coordinator = createMockPilot({ traits: ["coordinator"], level: 1, cost: 1 });
    const academyAlly = createMockUnit({ traits: ["academy"], ap: 2, hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [coordinator],
      play: [gd01BusterGundam046, academyAlly],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [busterId, allyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(coordinator, busterId!));
    expectSuccess(p1.useSupport(busterId!, allyId!));

    expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(5);
    expect(p1.isExhausted(busterId!)).toBe(true);
  });

  it("stays rested when its paired Pilot is not a Coordinator", () => {
    const unrelatedPilot = createMockPilot({ traits: ["newtype"], level: 1, cost: 1 });
    const zaftAlly = createMockUnit({ traits: ["zaft"], ap: 2, hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [unrelatedPilot],
      play: [gd01BusterGundam046, zaftAlly],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [busterId, allyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(unrelatedPilot, busterId!));
    expectSuccess(p1.useSupport(busterId!, allyId!));

    expect(p1.isExhausted(busterId!)).toBe(true);
  });

  it("sets itself active only once per turn", () => {
    const coordinator = createMockPilot({ traits: ["coordinator"], level: 1, cost: 1 });
    const firstZaft = createMockUnit({ traits: ["zaft"], ap: 2, hp: 5 });
    const secondZaft = createMockUnit({ traits: ["zaft"], ap: 1, hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [coordinator],
      play: [gd01BusterGundam046, firstZaft, secondZaft],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [busterId, firstZaftId, secondZaftId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(coordinator, busterId!));
    expectSuccess(p1.useSupport(busterId!, firstZaftId!));
    expect(p1.isExhausted(busterId!)).toBe(false);
    expectSuccess(p1.useSupport(busterId!, secondZaftId!));

    expect(p1.isExhausted(busterId!)).toBe(true);
  });
});
