import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { gd05GavaneGoonny101 } from "./101-gavane-goonny.ts";

describe("Gavane Goonny (GD05-101)", () => {
  /** @behavioral-proof complete: Burst, Pair, paid friendly Unit gate, Militia host, controller, recovery, and once-per-turn are public. */
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(gd05GavaneGoonny101);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05GavaneGoonny101],
      play: [unit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05GavaneGoonny101, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  describe("【Once per Turn】When you pay ① or more for one of your Unit's effects, if this is a (Militia) Unit, it may recover 2 HP.", () => {
    it("recovers 2 HP from its Militia host after paying for a friendly Unit effect", () => {
      const host = createMockUnit({ traits: ["militia"], hp: 6 });
      const paidUnit = createPaidEffectUnit("FRIENDLY");
      const engine = GundamTestEngine.create({
        hand: [gd05GavaneGoonny101],
        play: [{ card: host, damage: 4 }, paidUnit],
        resourceArea: activeResources(4),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [hostId, paidUnitId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd05GavaneGoonny101, hostId!));
      expectSuccess(p1.activateAbility(paidUnitId!, 0));

      expect(p1.getDamage(hostId!)).toBe(2);
    });

    it("does not recover a non-Militia host", () => {
      const host = createMockUnit({ traits: ["earth federation"], hp: 6 });
      const paidUnit = createPaidEffectUnit("WRONG-HOST");
      const engine = GundamTestEngine.create({
        hand: [gd05GavaneGoonny101],
        play: [{ card: host, damage: 4 }, paidUnit],
        resourceArea: activeResources(4),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [hostId, paidUnitId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd05GavaneGoonny101, hostId!));
      expectSuccess(p1.activateAbility(paidUnitId!, 0));

      expect(p1.getDamage(hostId!)).toBe(4);
    });

    it("does not recover when the opponent pays for a Unit effect", () => {
      const host = createMockUnit({ traits: ["militia"], hp: 6 });
      const enemyPaidUnit = createPaidEffectUnit("ENEMY");
      const engine = GundamTestEngine.create(
        {
          hand: [gd05GavaneGoonny101],
          play: [{ card: host, damage: 4 }],
          resourceArea: activeResources(3),
          deck: 3,
        },
        { play: [enemyPaidUnit], resourceArea: activeResources(1), deck: 3 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyPaidUnitId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd05GavaneGoonny101, hostId));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.activateAbility(enemyPaidUnitId, 0));

      expect(p1.getDamage(hostId)).toBe(4);
    });

    it("recovers only once when two friendly Unit effects are paid for in the same turn", () => {
      const host = createMockUnit({ traits: ["militia"], hp: 8 });
      const firstPaidUnit = createPaidEffectUnit("FIRST");
      const secondPaidUnit = createPaidEffectUnit("SECOND");
      const engine = GundamTestEngine.create({
        hand: [gd05GavaneGoonny101],
        play: [{ card: host, damage: 6 }, firstPaidUnit, secondPaidUnit],
        resourceArea: activeResources(5),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [hostId, firstPaidUnitId, secondPaidUnitId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd05GavaneGoonny101, hostId!));
      expectSuccess(p1.activateAbility(firstPaidUnitId!, 0));
      expect(p1.getDamage(hostId!)).toBe(4);
      expectSuccess(p1.activateAbility(secondPaidUnitId!, 0));

      expect(p1.getDamage(hostId!)).toBe(4);
    });
  });
});

function createPaidEffectUnit(suffix: string) {
  return createMockUnit({
    cardNumber: `TEST-GAVANE-PAID-${suffix}`,
    effects: [
      {
        type: "activated",
        activation: { timing: ["activate:main"] },
        cost: { payResources: 1 },
        directives: [{ action: { action: "draw", count: 1 } }],
        sourceText: "【Activate·Main】①：Draw 1.",
      },
    ],
  });
}
