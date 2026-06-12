import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  registerMatchers,
  expectCardPlayable,
  expectAttackCandidate,
  expectNotAttackCandidate,
  expectAttackPair,
} from "@cyberpunk-engine/testing/index.ts";

registerMatchers();
import {
  spoilerRidingNomad,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";

describe("Riding Nomad", () => {
  describe("UI prompt", () => {
    it("shows the unit as playable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [spoilerRidingNomad],
        eddies: spoilerRidingNomad.cost,
      });
      expectCardPlayable(engine, spoilerRidingNomad);
    });

    it("shows the unit as an attack candidate when ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: spoilerRidingNomad, spent: false }],
      });
      expectAttackCandidate(engine, spoilerRidingNomad);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: spoilerRidingNomad, spent: true }],
      });
      expectNotAttackCandidate(engine, spoilerRidingNomad);
    });

    it("shows a spent rival unit as a valid attack target", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: spoilerRidingNomad, spent: false }],
        },
        { field: [{ card: alphaRuthlessLowlife, spent: true }] },
      );
      expectAttackPair(engine, spoilerRidingNomad, alphaRuthlessLowlife);
    });
  });

  describe("[Static] Can attack spent rival units on the turn played", () => {
    it("can attack a spent rival unit on the turn played", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [spoilerRidingNomad],
          eddies: spoilerRidingNomad.cost,
        },
        { field: [{ card: alphaRuthlessLowlife, spent: true }] },
      );

      engine.playCard(spoilerRidingNomad);

      engine.attackUnit(spoilerRidingNomad, alphaRuthlessLowlife);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("fight");
    });

    it("CANNOT attack the rival player directly on the turn played", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [spoilerRidingNomad],
        eddies: spoilerRidingNomad.cost,
      });

      engine.playCard(spoilerRidingNomad);

      const failure = engine.expectFailure(() => engine.attackRival(spoilerRidingNomad));
      expect(failure.errorCode).toBe("SUMMONING_SICKNESS");
    });

    it("CANNOT attack a ready rival unit on the turn played", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [spoilerRidingNomad],
          eddies: spoilerRidingNomad.cost,
        },
        { field: [alphaRuthlessLowlife] }, // ready (not spent)
      );

      engine.playCard(spoilerRidingNomad);

      const failure = engine.expectFailure(() =>
        engine.attackUnit(spoilerRidingNomad, alphaRuthlessLowlife),
      );
      expect(failure.errorCode).toBe("TARGET_READY");
    });

    it("normal summoning sickness applies on subsequent turns (needs to wait a turn)", () => {
      // Place Riding Nomad directly on field as if it was played on a previous turn
      // but mark it playedThisTurn: false (simulating it survived a turn).
      // Then play a NEW Riding Nomad — the old one is not played-this-turn.
      // We test that a freshly played unit without this rule still gets summoning sickness.
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: alphaSwordwiseHuscle, playedThisTurn: true }] },
        { field: [{ card: alphaRuthlessLowlife, spent: true }] },
      );

      // Swordwise Huscle still has summoning sickness (no special rule)
      const failure = engine.expectFailure(() =>
        engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife),
      );
      expect(failure.errorCode).toBe("SUMMONING_SICKNESS");
    });

    it("after surviving a turn, can attack normally (units and rival)", () => {
      // Riding Nomad on field, NOT played this turn — standard unit behavior
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: spoilerRidingNomad, spent: false }] },
        {},
      );

      // Should be able to attack rival directly on a subsequent turn
      engine.attackRival(spoilerRidingNomad);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("direct");
    });

    it("becomes spent after attacking", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [spoilerRidingNomad],
          eddies: spoilerRidingNomad.cost,
        },
        { field: [{ card: alphaRuthlessLowlife, spent: true }] },
      );

      engine.playCard(spoilerRidingNomad);

      engine.attackUnit(spoilerRidingNomad, alphaRuthlessLowlife);

      const card = engine.getCard(spoilerRidingNomad, "field", P1);
      expect(card.meta.spent).toBe(true);
    });

    it("effective power during attack equals base power (6)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [spoilerRidingNomad],
          eddies: spoilerRidingNomad.cost,
        },
        { field: [{ card: alphaRuthlessLowlife, spent: true }] },
      );

      engine.playCard(spoilerRidingNomad);

      engine.attackUnit(spoilerRidingNomad, alphaRuthlessLowlife);

      const nomad = engine.getCard(spoilerRidingNomad, "field", P1);
      expect(engine.getState()).toHaveEffectivePower({
        card: nomad.instanceId as string,
        value: 6,
      });
    });

    it("multiple Riding Nomads can each attack on play turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [spoilerRidingNomad, spoilerRidingNomad],
          eddies: spoilerRidingNomad.cost * 2,
        },
        {
          field: [
            { card: alphaRuthlessLowlife, spent: true },
            { card: alphaSwordwiseHuscle, spent: true },
          ],
        },
      );

      // Play both Nomads
      engine.playCard(spoilerRidingNomad);
      engine.playCard(spoilerRidingNomad);

      // Get both nomad instances by instance ID
      const p1Field = engine.getCardsInZone("field", P1);
      const nomads = p1Field.filter((c) => c.definitionId === spoilerRidingNomad.id);
      expect(nomads).toHaveLength(2);

      const nomad1 = nomads[0]!;
      const nomad2 = nomads[1]!;

      // Attack with first Riding Nomad using instance, resolve the fight
      engine.attackUnit(nomad1, alphaRuthlessLowlife);
      engine.resolveFullFight();

      // Second Riding Nomad attacks using instance
      engine.attackUnit(nomad2, alphaSwordwiseHuscle);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("fight");
    });

    it("rule only applies to self (other units still have summoning sickness)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [spoilerRidingNomad, alphaSwordwiseHuscle],
          eddies: spoilerRidingNomad.cost + (alphaSwordwiseHuscle.cost ?? 0),
        },
        { field: [{ card: alphaRuthlessLowlife, spent: true }] },
      );

      // Play both units
      engine.playCard(spoilerRidingNomad);
      engine.playCard(alphaSwordwiseHuscle);

      // Swordwise Huscle (played this turn) still has summoning sickness
      const failure = engine.expectFailure(() =>
        engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife),
      );
      expect(failure.errorCode).toBe("SUMMONING_SICKNESS");

      // But Riding Nomad can attack
      engine.attackUnit(spoilerRidingNomad, alphaRuthlessLowlife);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
    });

    it("defeats a weaker rival unit in combat on the turn played", () => {
      // Riding Nomad (power 6) vs Ruthless Lowlife (power 1)
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [spoilerRidingNomad],
          eddies: spoilerRidingNomad.cost,
        },
        { field: [{ card: alphaRuthlessLowlife, spent: true }] },
      );

      engine.playCard(spoilerRidingNomad);

      engine.attackUnit(spoilerRidingNomad, alphaRuthlessLowlife);
      engine.resolveFullFight();

      // Defender defeated -> trash
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === alphaRuthlessLowlife.id)).toBe(true);

      // Attacker survives on field
      const p1Field = engine.getCardsInZone("field", P1);
      expect(p1Field.some((c) => c.definitionId === spoilerRidingNomad.id)).toBe(true);
    });
  });
});
