import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  findStatModifier,
} from "@tcg/gundam-engine";
import { gd01BusterGundam046 } from "./046-buster-gundam.ts";

describe("Buster Gundam (GD01-046)", () => {
  it("uses Support 3 to buff another friendly Unit", () => {
    const ally = createMockUnit({ traits: ["zaft"], ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({ play: [gd01BusterGundam046, ally] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [busterId, allyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.useSupport(busterId!, allyId!));

    expect(findStatModifier(engine, allyId!, "ap")?.modifier).toBe(3);
  });

  describe("【During Pair･(Coordinator) Pilot】【Once per Turn】When you use this Unit's <Support> to increase a (ZAFT) Unit's AP, set this Unit as active.", () => {
    it("readies Buster after its Support increases a friendly ZAFT Unit's AP while paired with a Coordinator Pilot", () => {
      const coordinator = createMockPilot({ traits: ["coordinator"], level: 1, cost: 1 });
      const zaftAlly = createMockUnit({ traits: ["zaft"], ap: 2, hp: 4 });
      const engine = GundamTestEngine.create({
        hand: [coordinator],
        play: [gd01BusterGundam046, zaftAlly],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [busterId, allyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(coordinator, busterId!));
      expectSuccess(p1.useSupport(busterId!, allyId!));

      expect(findStatModifier(engine, allyId!, "ap")?.modifier).toBe(3);
      expect(engine.getG().exhausted[busterId!] ?? false).toBe(false);
    });

    it("does not ready Buster when Support increases a non-ZAFT Unit's AP", () => {
      const coordinator = createMockPilot({ traits: ["coordinator"], level: 1, cost: 1 });
      const nonZaftAlly = createMockUnit({ traits: ["earth federation"], ap: 2, hp: 4 });
      const engine = GundamTestEngine.create({
        hand: [coordinator],
        play: [gd01BusterGundam046, nonZaftAlly],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [busterId, allyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(coordinator, busterId!));
      expectSuccess(p1.useSupport(busterId!, allyId!));

      expect(engine.getG().exhausted[busterId!]).toBe(true);
    });

    it("only readies Buster once per turn", () => {
      const coordinator = createMockPilot({ traits: ["coordinator"], level: 1, cost: 1 });
      const zaftAlly = createMockUnit({ traits: ["zaft"], ap: 2, hp: 4 });
      const secondZaftAlly = createMockUnit({ traits: ["zaft"], ap: 1, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [coordinator],
        play: [gd01BusterGundam046, zaftAlly, secondZaftAlly],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [busterId, allyId, secondAllyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(coordinator, busterId!));
      expectSuccess(p1.useSupport(busterId!, allyId!));
      expect(engine.getG().exhausted[busterId!] ?? false).toBe(false);

      expectSuccess(p1.useSupport(busterId!, secondAllyId!));

      expect(engine.getG().exhausted[busterId!]).toBe(true);
    });
  });
});
