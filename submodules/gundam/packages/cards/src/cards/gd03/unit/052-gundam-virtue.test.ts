import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03GundamVirtue052 } from "./052-gundam-virtue.ts";

describe("Gundam Virtue (GD03-052)", () => {
  it("Support 2 rests Virtue and gives another friendly Unit AP+2 for the turn", () => {
    const ally = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({ play: [gd03GundamVirtue052, ally] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [virtueId, allyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.useSupport(virtueId!, allyId!));

    expect(p1.isExhausted(virtueId!)).toBe(true);
    expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(4);
  });

  describe("When this Unit deals battle damage to an enemy Unit that is Lv.5 or lower, if you have a (CB) Pilot in play, destroy that enemy Unit.", () => {
    function setup({
      enemyLevel = 5,
      pilotTraits = ["cb"],
      includeOtherFriendly = false,
    }: { enemyLevel?: number; pilotTraits?: string[]; includeOtherFriendly?: boolean } = {}) {
      const pilot = createMockPilot({
        traits: pilotTraits,
        level: 1,
        cost: 1,
        apBonus: 0,
        hpBonus: 0,
      });
      const otherFriendly = createMockUnit({ name: "Other Friendly", ap: 3, hp: 6 });
      const enemy = createMockUnit({ level: enemyLevel, ap: 0, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: includeOtherFriendly ? [gd03GundamVirtue052, otherFriendly] : [gd03GundamVirtue052],
          resourceArea: activeResources(5),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [virtueId, otherFriendlyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, virtueId!));

      return { p1, p2, virtueId: virtueId!, otherFriendlyId, enemyId };
    }

    function battle(
      p1: ReturnType<GundamTestEngine["asPlayer"]>,
      p2: ReturnType<GundamTestEngine["asPlayer"]>,
      attackerId: string,
      enemyId: string,
    ) {
      expectSuccess(p1.enterBattle(attackerId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
    }

    it("destroys the damaged enemy Lv.5 or lower Unit while a CB Pilot is in play", () => {
      const { p1, p2, virtueId, enemyId } = setup();

      battle(p1, p2, virtueId, enemyId);

      expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("does not destroy a Lv.6 enemy Unit", () => {
      const { p1, p2, virtueId, enemyId } = setup({ enemyLevel: 6 });

      battle(p1, p2, virtueId, enemyId);

      expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
      expect(p2.getDamage(enemyId)).toBe(3);
    });

    it("does not destroy without a CB Pilot in play", () => {
      const { p1, p2, virtueId, enemyId } = setup({ pilotTraits: ["earth federation"] });

      battle(p1, p2, virtueId, enemyId);

      expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
      expect(p2.getDamage(enemyId)).toBe(3);
    });

    it("does not trigger from a different friendly Unit's battle damage", () => {
      const { p1, p2, otherFriendlyId, enemyId } = setup({ includeOtherFriendly: true });

      battle(p1, p2, otherFriendlyId!, enemyId);

      expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
      expect(p2.getDamage(enemyId)).toBe(3);
    });
  });
});
