import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectAttackRedirectedTo,
  expectSuccess,
  getEffectiveStats,
  markAsLinkUnit,
} from "@tcg/gundam-engine";
import { gd01FreedomGundam065 } from "./065-freedom-gundam.ts";

describe("Freedom Gundam (GD01-065)", () => {
  it("uses Blocker to intercept an attack", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [defender, gd01FreedomGundam065] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.declareBlock(blockerId));

    expectAttackRedirectedTo(engine, blockerId);
  });

  describe("【During Pair】【Once per Turn】When you pair a Pilot with this Unit or one of your white Units, choose 1 enemy Unit. It gets AP-2 during this turn.", () => {
    it("gives an enemy Unit AP-2 when a Pilot is paired with Freedom", () => {
      const pilot = createMockPilot({ name: "Kira Yamato", cost: 1 });
      const enemy = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd01FreedomGundam065],
          resourceArea: activeResources(1),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, gd01FreedomGundam065));

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(getEffectiveStats(enemyId, engine.getG(), framework.cards, framework).ap).toBe(2);
    });

    it("observes a Pilot paired with another friendly white Unit while Freedom is paired", () => {
      const whiteUnit = createMockUnit({ color: "white" });
      const pilot = createMockPilot({ cost: 1 });
      const enemy = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd01FreedomGundam065, whiteUnit],
          resourceArea: activeResources(1),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [freedomId, whiteUnitId] = p1.getCardsInZone("battleArea");
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      markAsLinkUnit(engine, freedomId!);

      expectSuccess(p1.assignPilot(pilot, whiteUnitId!));

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(getEffectiveStats(enemyId, engine.getG(), framework.cards, framework).ap).toBe(2);
    });

    it("does not trigger when the paired Unit is not white", () => {
      const nonWhiteUnit = createMockUnit({ color: "blue" });
      const pilot = createMockPilot({ cost: 1 });
      const enemy = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd01FreedomGundam065, nonWhiteUnit],
          resourceArea: activeResources(1),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [freedomId, nonWhiteUnitId] = p1.getCardsInZone("battleArea");
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      markAsLinkUnit(engine, freedomId!);

      expectSuccess(p1.assignPilot(pilot, nonWhiteUnitId!));

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(getEffectiveStats(enemyId, engine.getG(), framework.cards, framework).ap).toBe(4);
    });

    it("applies only once per turn across multiple qualifying pair events", () => {
      const whiteA = createMockUnit({ cardNumber: "TEST-WHITE-A", color: "white" });
      const whiteB = createMockUnit({ cardNumber: "TEST-WHITE-B", color: "white" });
      const pilotA = createMockPilot({ cardNumber: "TEST-PILOT-A", cost: 1 });
      const pilotB = createMockPilot({ cardNumber: "TEST-PILOT-B", cost: 1 });
      const enemy = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilotA, pilotB],
          play: [gd01FreedomGundam065, whiteA, whiteB],
          resourceArea: activeResources(2),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [freedomId, whiteAId, whiteBId] = p1.getCardsInZone("battleArea");
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      markAsLinkUnit(engine, freedomId!);

      expectSuccess(p1.assignPilot(pilotA, whiteAId!));
      expectSuccess(p1.assignPilot(pilotB, whiteBId!));

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(getEffectiveStats(enemyId, engine.getG(), framework.cards, framework).ap).toBe(2);
    });
  });
});
