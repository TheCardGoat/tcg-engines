import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, createMockUnit } from "@tcg/gundam-engine";
import { st09ForceImpulseGundam002 } from "./002-force-impulse-gundam.ts";

describe("Force Impulse Gundam (ST09-002)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st09ForceImpulseGundam002] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st09ForceImpulseGundam002.type).toBe("unit");
    expect(st09ForceImpulseGundam002.level).toBe(5);
    expect(st09ForceImpulseGundam002.cost).toBe(4);
    expect(st09ForceImpulseGundam002.ap).toBe(5);
    expect(st09ForceImpulseGundam002.hp).toBe(4);
  });

  describe('【Destroyed】Choose 1 (Minerva Squad) Unit card without "Force Impulse Gundam" in its card name from your trash. Add it to your hand.', () => {
    it("adds a non-Force Minerva Squad Unit from your trash to your hand", () => {
      const sword = createMockUnit({
        name: "Sword Impulse Gundam",
        traits: ["minerva squad"],
      });
      const engine = GundamTestEngine.create(
        { play: [st09ForceImpulseGundam002], trash: [sword] },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const forceId = p1.getCardsInZone("battleArea")[0]!;
      const swordId = p1.getCardsInZone("trash")[0]!;

      engine.destroyUnit(forceId);

      expect(p1.getCardsInZone("hand")).toContain(swordId);
      expect(p1.getCardsInZone("trash")).toContain(forceId);
    });

    it("does not add a Force Impulse Gundam or a non-Minerva Unit", () => {
      const forceCopy = createMockUnit({
        name: "Force Impulse Gundam",
        traits: ["minerva squad"],
      });
      const wrongTrait = createMockUnit({
        name: "Sword Impulse Gundam",
        traits: ["zaft"],
      });
      const engine = GundamTestEngine.create(
        { play: [st09ForceImpulseGundam002], trash: [forceCopy, wrongTrait] },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const forceId = p1.getCardsInZone("battleArea")[0]!;
      const trashBefore = p1.getCardsInZone("trash");

      engine.destroyUnit(forceId);

      expect(p1.getCardsInZone("hand")).toHaveLength(0);
      expect(p1.getCardsInZone("trash")).toEqual([...trashBefore, forceId]);
    });
  });
});
