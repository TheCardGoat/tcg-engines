import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  registerMatchers,
  expectCardPlayable,
  expectCardNotPlayable,
  expectAttachTarget,
  expectAttackPair,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import { alphaSandevistan, alphaRuthlessLowlife, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

registerMatchers();

const gear = alphaSandevistan; // cost 3, power 3, play: grantRule canAttackOnPlayedTurnAgainstUnits (turn)
const lowlife = alphaRuthlessLowlife; // cost 2, power 1, unit
const huscle = alphaSwordwiseHuscle; // cost 3, power 5, unit

describe("Sandevistan", () => {
  describe("UI prompt", () => {
    it("shows the gear as playable with a valid attach target", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: lowlife, spent: false }],
      });
      expectCardPlayable(engine, gear);
      expectAttachTarget(engine, gear, lowlife);
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

  describe(`PLAY This unit can attack spent units this turn.`, () => {
    it("can equip to a friendly unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: lowlife, spent: false }],
      });

      engine.attachGear(gear, lowlife);

      const gearCard = engine.getCard(gear);
      const hostId = engine.getCard(lowlife, "field", P1).instanceId;
      expect(gearCard.meta.attachedToId).toBe(hostId);
    });

    it("host gains +3 power from gear", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: lowlife, spent: false }],
      });

      engine.attachGear(gear, lowlife);
      engine.judgeRecomputeActiveEffects(); // recompute

      const instance = engine.getCard(lowlife, "field", P1);
      // Lowlife base 1 + gear 3 = 4
      expect(engine.getState()).toHaveEffectivePower({
        card: instance.instanceId as string,
        value: 4,
      });
    });

    it("grants canAttackOnPlayedTurnAgainstUnits active effect on equip", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: lowlife, spent: false }],
      });

      engine.attachGear(gear, lowlife);

      const state = engine.getState();
      const hostId = engine.getCard(lowlife, "field", P1).instanceId;
      const hasRule = state.G.activeEffects.some(
        (e) =>
          e.targetCardId === hostId &&
          e.kind === "grantRule" &&
          e.rule === "canAttackOnPlayedTurnAgainstUnits" &&
          e.origin === "imperative",
      );
      expect(hasRule).toBe(true);
    });

    it("canAttackOnPlayedTurnAgainstUnits rule is turn-scoped (expires at end of turn)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: lowlife, spent: false }],
      });

      engine.attachGear(gear, lowlife);

      // Rule exists after equip
      const stateBefore = engine.getState();
      const hostId = engine.getCard(lowlife, "field", P1).instanceId;
      expect(
        stateBefore.G.activeEffects.some(
          (e) => e.targetCardId === hostId && e.rule === "canAttackOnPlayedTurnAgainstUnits",
        ),
      ).toBe(true);

      // End P1's turn
      engine.completeTurn();

      // Rule should be cleaned up
      const stateAfter = engine.getState();
      expect(
        stateAfter.G.activeEffects.some(
          (e) => e.targetCardId === hostId && e.rule === "canAttackOnPlayedTurnAgainstUnits",
        ),
      ).toBe(false);
    });

    it("host with gear can attack a spent rival unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [gear],
          eddies: gear.cost,
          field: [{ card: lowlife, spent: false }],
        },
        { field: [{ card: huscle, spent: true }] },
      );

      engine.attachGear(gear, lowlife);

      engine.attackUnit(lowlife, huscle);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("fight");
    });

    it("lets a unit played this turn attack a spent rival unit in the prompt", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [gear],
          eddies: gear.cost,
          field: [{ card: lowlife, spent: false, playedThisTurn: true }],
        },
        { field: [{ card: huscle, spent: true }] },
      );

      engine.attachGear(gear, lowlife);

      expectAttackPair(engine, lowlife, huscle);
    });

    it("does not let that played-this-turn unit attack the rival directly", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: lowlife, spent: false, playedThisTurn: true }],
      });

      engine.attachGear(gear, lowlife);

      expectNotAttackCandidate(engine, lowlife);
    });

    it("deducts 3 eddies to equip", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: 5,
        field: [{ card: lowlife, spent: false }],
      });

      engine.attachGear(gear, lowlife);

      expect(engine.getEddies(P1)).toBe(2); // 5 - 3
    });

    it("fails to equip with insufficient eddies", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: 2,
        field: [{ card: lowlife, spent: false }],
      });
      engine.spendAllLegends();

      const failure = engine.expectFailure(() => engine.attachGear(gear, lowlife));
      expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    });

    it("emits an action log when gear is equipped", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: lowlife, spent: false }],
      });

      engine.attachGear(gear, lowlife);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.playCard.gear");
      expect(log!.params.cardName).toBe(gear.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(gear.displayName);
    });
  });
});
