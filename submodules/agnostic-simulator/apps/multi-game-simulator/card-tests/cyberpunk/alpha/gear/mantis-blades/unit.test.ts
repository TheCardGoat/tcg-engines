import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  registerMatchers,
  expectCardPlayable,
  expectCardNotPlayable,
  expectAttachTarget,
} from "@cyberpunk-engine/testing/index.ts";
import { alphaMantisBlades, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";

registerMatchers();

const gear = alphaMantisBlades; // gear, cost 1, power 2, no abilities — vanilla equip
const huscle = alphaSwordwiseHuscle; // unit, power 5

describe("Mantis Blades", () => {
  describe("UI prompt", () => {
    it("shows the gear as playable with a valid attach target", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: huscle, spent: false }],
      });
      expectCardPlayable(engine, gear);
      expectAttachTarget(engine, gear, huscle);
    });

    it("does NOT show the gear as playable without a valid target", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [],
      });
      expectCardNotPlayable(engine, gear);
    });
  });

  it("definition matches expected stats", () => {
    expect(gear.type).toBe("gear");
    expect(gear.cost).toBe(1);
    expect(gear.power).toBe(2);
    expect(gear.abilities).toEqual([]);
    expect(gear.attachment).toBeDefined();
  });

  it("can be equipped to a friendly unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [gear],
      eddies: gear.cost,
      field: [{ card: huscle, spent: false }],
    });

    engine.attachGear(gear, huscle);

    const gearCard = engine.getCard(gear);
    const hostId = engine.getCard(huscle, "field", P1).instanceId;
    expect(gearCard.meta.attachedToId).toBe(hostId);
  });

  it("host gains +2 power from gear", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [gear],
      eddies: gear.cost,
      field: [{ card: huscle, spent: false }],
    });

    engine.attachGear(gear, huscle);
    engine.judgeRecomputeActiveEffects(); // recompute

    const instance = engine.getCard(huscle, "field", P1);
    // Huscle base 5 + gear 2 = 7
    expect(engine.getState()).toHaveEffectivePower({
      card: instance.instanceId as string,
      value: 7,
    });
  });
});
