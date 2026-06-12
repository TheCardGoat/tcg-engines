import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getContinuousEffects,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03KMpfer017 } from "./017-k-mpfer.ts";

describe("Kämpfer (GD03-017)", () => {
  it("behavior: Burst adds a Cyclops Team Pilot card from trash to hand", () => {
    const cyclopsPilot = createMockPilot({ traits: ["cyclops team"] });
    const engine = GundamTestEngine.create({}, { deck: [gd03KMpfer017], trash: [cyclopsPilot] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const pilotId = p2.getCardsInZone("trash")[0]!;

    engine.fireShieldBurst(shieldId!);

    expect(p2.getCardsInZone("hand")).toContain(pilotId);
    expect(p2.getCardsInZone("trash")).not.toContain(pilotId);
  });

  describe("【When Paired･(Cyclops Team) Pilot】All your (Cyclops Team) Units may choose an active enemy Unit with 5 or less AP as their attack target during this turn.", () => {
    function grantsFor(engine: GundamTestEngine, targetId: string) {
      return getContinuousEffects(engine).filter(
        (effect) =>
          effect.targetId === targetId && effect.payload.kind === "grant-attack-target-option",
      );
    }

    it("grants the attack option to Kämpfer and another friendly Cyclops Team Unit", () => {
      const cyclopsPilot = createMockPilot({ traits: ["cyclops team"], cost: 1 });
      const ally = createMockUnit({ traits: ["cyclops team"] });
      const enemy = createMockUnit({ ap: 5, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [cyclopsPilot],
          play: [gd03KMpfer017, ally],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [kampferId, allyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(cyclopsPilot, kampferId!));

      for (const targetId of [kampferId!, allyId!]) {
        expect(grantsFor(engine, targetId)[0]?.payload).toMatchObject({
          kind: "grant-attack-target-option",
          attackTarget: {
            owner: "opponent",
            cardType: "unit",
            state: "active",
            attributeFilters: [{ attribute: "ap", comparison: "lte", value: 5 }],
          },
        });
      }
    });

    it("does not grant the attack option to friendly non-Cyclops Team Units", () => {
      const cyclopsPilot = createMockPilot({ traits: ["cyclops team"], cost: 1 });
      const nonCyclopsAlly = createMockUnit({ traits: ["zeon"] });
      const enemy = createMockUnit({ ap: 5, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [cyclopsPilot],
          play: [gd03KMpfer017, nonCyclopsAlly],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [kampferId, nonCyclopsId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(cyclopsPilot, kampferId!));

      expect(grantsFor(engine, kampferId!)).toHaveLength(1);
      expect(grantsFor(engine, nonCyclopsId!)).toHaveLength(0);
    });

    it("does not trigger when paired with a non-Cyclops Team Pilot", () => {
      const ordinaryPilot = createMockPilot({ traits: ["zeon"], cost: 1 });
      const ally = createMockUnit({ traits: ["cyclops team"] });
      const enemy = createMockUnit({ ap: 5, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [ordinaryPilot],
          play: [gd03KMpfer017, ally],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [kampferId, allyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(ordinaryPilot, kampferId!));

      expect(grantsFor(engine, kampferId!)).toHaveLength(0);
      expect(grantsFor(engine, allyId!)).toHaveLength(0);
    });
  });
});
