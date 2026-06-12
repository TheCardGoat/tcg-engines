import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  registerMatchers,
  expectCallableLegend,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaSaburoArasakaStubbornPatriach,
  alphaSwordwiseHuscle,
  alphaMt0d12Flathead,
  alphaRuthlessLowlife,
} from "@tcg/cyberpunk-cards";

registerMatchers();

describe("Saburo Arasaka - Stubborn Patriarch", () => {
  describe("UI prompt", () => {
    it("shows the legend as callable when face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: alphaSaburoArasakaStubbornPatriach, faceDown: true }],
        eddies: 2,
      });
      expectCallableLegend(engine, alphaSaburoArasakaStubbornPatriach);
    });
  });

  describe(`Your Arasaka units have +1 power when attacking.`, () => {
    it(`Arasaka unit attacking with Saburo face-up gets +1 effective power`, () => {
      // Swordwise Huscle base power = 5; Saburo grants +1 when attacking → 6
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: alphaSaburoArasakaStubbornPatriach, faceDown: false }],
          field: [alphaSwordwiseHuscle],
        },
        { field: [{ card: alphaRuthlessLowlife, spent: true }] },
      );

      engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife);

      // Attack is declared — check effective power during the attack
      const state = engine.getState();
      const huscle = engine.getCard(alphaSwordwiseHuscle);
      expect(state).toHaveEffectivePower({ card: huscle.instanceId as string, value: 6 });
    });

    it(`Arasaka unit has base power when not attacking (no attack state)`, () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: alphaSaburoArasakaStubbornPatriach, faceDown: false }],
        field: [alphaSwordwiseHuscle],
      });

      // Play phase — no attack declared
      const state = engine.getState();
      expect(engine.getAttackState()).toBeNull();
      const huscle = engine.getCard(alphaSwordwiseHuscle);
      expect(state).toHaveEffectivePower({ card: huscle.instanceId as string, value: 5 });
    });

    it(`Saburo's buff lets an Arasaka unit defeat an equal-power opponent it would normally tie`, () => {
      // Without Saburo: Swordwise Huscle (5) vs MT0D12 Flathead (5) → mutual
      // With Saburo face-up: 5 + 1 = 6 vs 5 → attacker wins
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: alphaSaburoArasakaStubbornPatriach, faceDown: false }],
          field: [alphaSwordwiseHuscle],
        },
        { field: [{ card: alphaMt0d12Flathead, spent: true }] },
      );

      engine.attackUnit(alphaSwordwiseHuscle, alphaMt0d12Flathead);
      engine.resolveFullFight();

      // Swordwise Huscle survives on P1's field
      const p1Field = engine.getCardsInZone("field", P1);
      expect(p1Field.some((c) => c.definitionId === alphaSwordwiseHuscle.id)).toBe(true);

      // MT0D12 Flathead is defeated to P2's trash
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === alphaMt0d12Flathead.id)).toBe(true);
    });

    it(`Non-Arasaka unit does not receive the +1 power bonus when attacking`, () => {
      // MT0D12 Flathead is NOT Arasaka (Militech, Drone). Even with Saburo face-up
      // it gets no bonus, so 5 vs 5 → mutual destruction.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: alphaSaburoArasakaStubbornPatriach, faceDown: false }],
          field: [alphaMt0d12Flathead],
        },
        { field: [{ card: alphaSwordwiseHuscle, spent: true }] },
      );

      // Verify no bonus before resolution
      engine.attackUnit(alphaMt0d12Flathead, alphaSwordwiseHuscle);
      const state = engine.getState();
      const flathead = engine.getCard(alphaMt0d12Flathead);
      expect(state).toHaveEffectivePower({ card: flathead.instanceId as string, value: 5 });

      engine.resolveFullFight();

      // Both units tie and destroy each other
      expect(engine.getCardsInZone("field", P1)).toHaveLength(0);
      expect(engine.getCardsInZone("field", P2)).toHaveLength(0);
    });

    it(`Saburo face-down (not yet called) does not grant the +1 power bonus`, () => {
      // Saburo starts face-down (default fixture state) — ability is inactive.
      // Swordwise Huscle (5) vs MT0D12 Flathead (5) → mutual without the bonus.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [alphaSaburoArasakaStubbornPatriach], // faceDown: true (default)
          field: [alphaSwordwiseHuscle],
        },
        { field: [{ card: alphaMt0d12Flathead, spent: true }] },
      );

      // Confirm Saburo is face-down
      const saburo = engine.getCard(alphaSaburoArasakaStubbornPatriach, "legendArea", P1);
      expect(saburo.meta.faceDown).toBe(true);

      engine.attackUnit(alphaSwordwiseHuscle, alphaMt0d12Flathead);

      // No bonus: effective power stays at 5
      const state = engine.getState();
      const huscle = engine.getCard(alphaSwordwiseHuscle);
      expect(state).toHaveEffectivePower({ card: huscle.instanceId as string, value: 5 });

      engine.resolveFullFight();

      // Mutual destruction (5 vs 5, no Saburo bonus)
      expect(engine.getCardsInZone("field", P1)).toHaveLength(0);
      expect(engine.getCardsInZone("field", P2)).toHaveLength(0);
    });

    it(`Only the actively attacking Arasaka unit benefits; idle Arasaka units are unaffected`, () => {
      // Two Arasaka units on P1's field. One attacks; only the attacker gets +1.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: alphaSaburoArasakaStubbornPatriach, faceDown: false }],
          field: [alphaSwordwiseHuscle, alphaRuthlessLowlife],
        },
        { field: [{ card: alphaMt0d12Flathead, spent: true }] },
      );

      engine.attackUnit(alphaSwordwiseHuscle, alphaMt0d12Flathead);

      const state = engine.getState();
      const huscle = engine.getCard(alphaSwordwiseHuscle);
      const lowlife = engine.getCard(alphaRuthlessLowlife);

      // Attacker gets bonus
      expect(state).toHaveEffectivePower({ card: huscle.instanceId as string, value: 6 });
      // Idle unit does NOT get bonus
      expect(state).toHaveEffectivePower({ card: lowlife.instanceId as string, value: 1 });
    });
  });
});
