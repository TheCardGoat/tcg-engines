import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectCardInTrash,
  expectSuccess,
  findStatModifier,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd03GundamVirtue052 } from "./052-gundam-virtue.ts";

describe("Gundam Virtue (GD03-052)", () => {
  it("uses Support 2 to buff another friendly Unit", () => {
    const ally = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({ play: [gd03GundamVirtue052, ally] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [virtueId, allyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.useSupport(virtueId!, allyId!));

    expect(findStatModifier(engine, allyId!, "ap")?.modifier).toBe(2);
    expect(engine.getG().exhausted[virtueId!]).toBe(true);
  });

  describe("When this Unit deals battle damage to an enemy Unit that is Lv.5 or lower, if you have a (CB) Pilot in play, destroy that enemy Unit.", () => {
    function setup({
      enemyLevel = 5,
      pilotTraits = ["cb"],
      includeOtherFriendly = false,
    }: { enemyLevel?: number; pilotTraits?: string[]; includeOtherFriendly?: boolean } = {}) {
      const cbPilot = createMockPilot({
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
          hand: [cbPilot],
          play: includeOtherFriendly ? [gd03GundamVirtue052, otherFriendly] : [gd03GundamVirtue052],
          resourceArea: activeResources(5),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [virtueId, otherFriendlyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      if (pilotTraits.length > 0) {
        expectSuccess(p1.assignPilot(cbPilot, virtueId!));
      }

      return { engine, p1, virtueId: virtueId!, otherFriendlyId, enemyId };
    }

    it("destroys the damaged enemy Lv.5 or lower Unit while a CB Pilot is in play", () => {
      const { engine, virtueId, enemyId } = setup();

      expectSuccess(engine.resolveCombat({ attackerId: virtueId, target: enemyId }));

      expectCardInTrash(engine, enemyId, PLAYER_TWO);
    });

    it("does not destroy a Lv.6 enemy Unit", () => {
      const { engine, p1, virtueId, enemyId } = setup({ enemyLevel: 6 });

      expectSuccess(engine.resolveCombat({ attackerId: virtueId, target: enemyId }));

      expect(p1.getCardsInZone("trash")).toHaveLength(0);
      expect(engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")).toContain(enemyId);
      expect(getDamageCounter(engine, enemyId)).toBe(3);
    });

    it("does not destroy without a CB Pilot in play", () => {
      const { engine, virtueId, enemyId } = setup({ pilotTraits: ["earth federation"] });

      expectSuccess(engine.resolveCombat({ attackerId: virtueId, target: enemyId }));

      expect(engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")).toContain(enemyId);
      expect(getDamageCounter(engine, enemyId)).toBe(3);
    });

    it("does not trigger from a different friendly Unit's battle damage", () => {
      const { engine, otherFriendlyId, enemyId } = setup({ includeOtherFriendly: true });

      expectSuccess(engine.resolveCombat({ attackerId: otherFriendlyId!, target: enemyId }));

      expect(engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")).toContain(enemyId);
      expect(getDamageCounter(engine, enemyId)).toBe(3);
    });
  });
});
