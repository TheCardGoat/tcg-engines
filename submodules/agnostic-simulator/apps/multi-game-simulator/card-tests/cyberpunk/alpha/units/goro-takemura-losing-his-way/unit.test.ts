import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  registerMatchers,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaGoroTakemuraLosingHisWay,
  alphaGoroTakemuraHandsUnclean,
  alphaJackieWellesPourOneOutForMe,
  alphaSaburoArasakaStubbornPatriach,
  alphaCorpoSecurity,
} from "@tcg/cyberpunk-cards";

registerMatchers();

const goro = alphaGoroTakemuraLosingHisWay; // cost 4, power 5
const legend1 = alphaGoroTakemuraHandsUnclean;
const legend2 = alphaJackieWellesPourOneOutForMe;
const legend3 = alphaSaburoArasakaStubbornPatriach;
const corpoSec = alphaCorpoSecurity; // cost 2, power 2

const CALL_COST = 1;

/** Force recomputation of static active effects after fixture setup. */
function recompute(engine: CyberpunkTestEngine): void {
  engine.judgeRecomputeActiveEffects();
}

describe("Goro Takemura - Losing His Way", () => {
  describe("UI prompt", () => {
    it("shows the unit as an attack candidate when ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: goro, spent: false }],
      });
      expectAttackCandidate(engine, goro);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: goro, spent: true }],
      });
      expectNotAttackCandidate(engine, goro);
    });
  });

  describe("[Static] +1 power per face-up friendly Legend (your turn only)", () => {
    it("has base power with 0 face-up legends", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: goro, spent: false }],
      });
      recompute(engine);
      const goroId = engine.getCard(goro, "field", P1).instanceId as string;
      // All legends face-down by default => +0
      expect(engine.getState()).toHaveEffectivePower({ card: goroId, value: 5 });
    });

    it("gains +1 per face-up legend", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: goro, spent: false }],
        legendArea: [{ card: legend1, faceDown: false }],
      });
      recompute(engine);
      const goroId = engine.getCard(goro, "field", P1).instanceId as string;
      // base 5 + 1 face-up legend = 6
      expect(engine.getState()).toHaveEffectivePower({ card: goroId, value: 6 });
    });

    it("gains +3 with all 3 legends face-up", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: goro, spent: false }],
        legendArea: [
          { card: legend1, faceDown: false },
          { card: legend2, faceDown: false },
          { card: legend3, faceDown: false },
        ],
      });
      recompute(engine);
      const goroId = engine.getCard(goro, "field", P1).instanceId as string;
      // base 5 + 3 face-up legends = 8
      expect(engine.getState()).toHaveEffectivePower({ card: goroId, value: 8 });
    });

    it("does NOT gain power during rival's turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: goro, spent: false }],
          legendArea: [
            { card: legend1, faceDown: false },
            { card: legend2, faceDown: false },
          ],
        },
        { deck: 40 },
      );
      recompute(engine);
      const goroId = engine.getCard(goro, "field", P1).instanceId as string;
      // During P1's turn: base 5 + 2 = 7
      expect(engine.getState()).toHaveEffectivePower({ card: goroId, value: 7 });

      engine.completeTurn();
      // Now P2's turn — static condition "friendly turn" fails
      expect(engine.getState()).toHaveEffectivePower({ card: goroId, value: 5 });
    });

    it("power returns on next friendly turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: goro, spent: false }],
          legendArea: [{ card: legend1, faceDown: false }],
        },
        { deck: 40 },
      );
      recompute(engine);
      const goroId = engine.getCard(goro, "field", P1).instanceId as string;
      // P1 turn: base 5 + 1 = 6
      expect(engine.getState()).toHaveEffectivePower({ card: goroId, value: 6 });

      engine.completeTurn();
      // P2 turn: base 5
      expect(engine.getState()).toHaveEffectivePower({ card: goroId, value: 5 });

      engine.completeTurn({ as: P2 });
      // P1 turn again: base 5 + 1 = 6
      expect(engine.getState()).toHaveEffectivePower({ card: goroId, value: 6 });
    });

    it("calling a legend mid-turn updates power immediately", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: goro, spent: false }],
        legendArea: [legend1], // face-down by default
        eddies: CALL_COST,
      });
      recompute(engine);
      const goroId = engine.getCard(goro, "field", P1).instanceId as string;
      // Before calling: 0 face-up legends => base 5
      expect(engine.getState()).toHaveEffectivePower({ card: goroId, value: 5 });

      engine.callLegend(legend1);
      // After calling: 1 face-up legend => base 5 + 1 = 6
      expect(engine.getState()).toHaveEffectivePower({ card: goroId, value: 6 });
    });

    it("does NOT count rival's face-up legends", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: goro, spent: false }],
        },
        {
          legendArea: [
            { card: legend1, faceDown: false },
            { card: legend2, faceDown: false },
            { card: legend3, faceDown: false },
          ],
          deck: 40,
        },
      );
      recompute(engine);
      const goroId = engine.getCard(goro, "field", P1).instanceId as string;
      // P2 has 3 face-up legends, but only friendly legends count
      expect(engine.getState()).toHaveEffectivePower({ card: goroId, value: 5 });
    });

    it("idle units on same field are NOT buffed", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [
          { card: goro, spent: false },
          { card: corpoSec, spent: false },
        ],
        legendArea: [
          { card: legend1, faceDown: false },
          { card: legend2, faceDown: false },
        ],
      });
      recompute(engine);
      const corpoSecId = engine.getCard(corpoSec, "field", P1).instanceId as string;
      // corpoSec should keep its base power — Goro's static targets "self" only
      expect(engine.getState()).toHaveEffectivePower({ card: corpoSecId, value: 2 });
    });

    it("effective power during attack", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: goro, spent: false }],
        legendArea: [
          { card: legend1, faceDown: false },
          { card: legend2, faceDown: false },
        ],
      });
      recompute(engine);
      const goroId = engine.getCard(goro, "field", P1).instanceId as string;
      // base 5 + 2 face-up legends = 7
      expect(engine.getState()).toHaveEffectivePower({ card: goroId, value: 7 });

      engine.attackRival(goro);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("direct");
      // Power should still be 7 during attack
      expect(engine.getState()).toHaveEffectivePower({ card: goroId, value: 7 });
    });
  });
});
