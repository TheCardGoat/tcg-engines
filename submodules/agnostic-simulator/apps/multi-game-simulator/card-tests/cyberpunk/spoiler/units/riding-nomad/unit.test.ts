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
  welcomeToNightCityRetailRidingNomad,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";

describe("Riding Nomad", () => {
  describe("UI prompt", () => {
    it("shows the unit as playable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [welcomeToNightCityRetailRidingNomad],
        eddies: welcomeToNightCityRetailRidingNomad.cost,
      });
      expectCardPlayable(engine, welcomeToNightCityRetailRidingNomad);
    });

    it("shows the unit as an attack candidate when ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false }],
      });
      expectAttackCandidate(engine, welcomeToNightCityRetailRidingNomad);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: true }],
      });
      expectNotAttackCandidate(engine, welcomeToNightCityRetailRidingNomad);
    });

    it("shows a spent rival unit as a valid attack target", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false }],
        },
        { field: [{ card: welcomeToNightCityRetailMoxInciters, spent: true }] },
      );
      expectAttackPair(
        engine,
        welcomeToNightCityRetailRidingNomad,
        welcomeToNightCityRetailMoxInciters,
      );
    });
  });

  describe("[Static] Can attack spent rival units on the turn played", () => {
    it("can attack a spent rival unit on the turn played", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [welcomeToNightCityRetailRidingNomad],
          eddies: welcomeToNightCityRetailRidingNomad.cost,
        },
        { field: [{ card: welcomeToNightCityRetailMoxInciters, spent: true }] },
      );

      engine.playCard(welcomeToNightCityRetailRidingNomad);

      engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailMoxInciters);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("fight");
    });

    it("CANNOT attack the rival player directly on the turn played", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [welcomeToNightCityRetailRidingNomad],
        eddies: welcomeToNightCityRetailRidingNomad.cost,
      });

      engine.playCard(welcomeToNightCityRetailRidingNomad);

      const failure = engine.expectFailure(() =>
        engine.attackRival(welcomeToNightCityRetailRidingNomad),
      );
      expect(failure.errorCode).toBe("SUMMONING_SICKNESS");
    });

    it("CANNOT attack a ready rival unit on the turn played", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [welcomeToNightCityRetailRidingNomad],
          eddies: welcomeToNightCityRetailRidingNomad.cost,
        },
        { field: [welcomeToNightCityRetailMoxInciters] }, // ready (not spent)
      );

      engine.playCard(welcomeToNightCityRetailRidingNomad);

      const failure = engine.expectFailure(() =>
        engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailMoxInciters),
      );
      expect(failure.errorCode).toBe("TARGET_READY");
    });

    it("normal summoning sickness applies on subsequent turns (needs to wait a turn)", () => {
      // Place Riding Nomad directly on field as if it was played on a previous turn
      // but mark it playedThisTurn: false (simulating it survived a turn).
      // Then play a NEW Riding Nomad — the old one is not played-this-turn.
      // We test that a freshly played unit without this rule still gets summoning sickness.
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, playedThisTurn: true }] },
        { field: [{ card: welcomeToNightCityRetailMoxInciters, spent: true }] },
      );

      // Swordwise Huscle still has summoning sickness (no special rule)
      const failure = engine.expectFailure(() =>
        engine.attackUnit(
          welcomeToNightCityRetailSwordwiseHuscle,
          welcomeToNightCityRetailMoxInciters,
        ),
      );
      expect(failure.errorCode).toBe("SUMMONING_SICKNESS");
    });

    it("after surviving a turn, can attack normally (units and rival)", () => {
      // Riding Nomad on field, NOT played this turn — standard unit behavior
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false }] },
        {},
      );

      // Should be able to attack rival directly on a subsequent turn
      engine.attackRival(welcomeToNightCityRetailRidingNomad);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("direct");
    });

    it("becomes spent after attacking", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [welcomeToNightCityRetailRidingNomad],
          eddies: welcomeToNightCityRetailRidingNomad.cost,
        },
        { field: [{ card: welcomeToNightCityRetailMoxInciters, spent: true }] },
      );

      engine.playCard(welcomeToNightCityRetailRidingNomad);

      engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailMoxInciters);

      const card = engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P1);
      expect(card.meta.spent).toBe(true);
    });

    it("effective power during attack equals base power (6)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [welcomeToNightCityRetailRidingNomad],
          eddies: welcomeToNightCityRetailRidingNomad.cost,
        },
        { field: [{ card: welcomeToNightCityRetailMoxInciters, spent: true }] },
      );

      engine.playCard(welcomeToNightCityRetailRidingNomad);

      engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailMoxInciters);

      const nomad = engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P1);
      expect(engine.getState()).toHaveEffectivePower({
        card: nomad.instanceId as string,
        value: 6,
      });
    });

    it("multiple Riding Nomads can each attack on play turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailRidingNomad],
          eddies: welcomeToNightCityRetailRidingNomad.cost * 2,
        },
        {
          field: [
            { card: welcomeToNightCityRetailMoxInciters, spent: true },
            { card: welcomeToNightCityRetailSwordwiseHuscle, spent: true },
          ],
        },
      );

      // Play both Nomads
      engine.playCard(welcomeToNightCityRetailRidingNomad);
      engine.playCard(welcomeToNightCityRetailRidingNomad);

      // Get both nomad instances by instance ID
      const p1Field = engine.getCardsInZone("field", P1);
      const nomads = p1Field.filter(
        (c) => c.definitionId === welcomeToNightCityRetailRidingNomad.id,
      );
      expect(nomads).toHaveLength(2);

      const nomad1 = nomads[0]!;
      const nomad2 = nomads[1]!;

      // Attack with first Riding Nomad using instance, resolve the fight
      engine.attackUnit(nomad1, welcomeToNightCityRetailMoxInciters);
      engine.resolveFullFight();

      // Second Riding Nomad attacks using instance
      engine.attackUnit(nomad2, welcomeToNightCityRetailSwordwiseHuscle);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("fight");
    });

    it("rule only applies to self (other units still have summoning sickness)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailSwordwiseHuscle],
          eddies:
            welcomeToNightCityRetailRidingNomad.cost +
            (welcomeToNightCityRetailSwordwiseHuscle.cost ?? 0),
        },
        { field: [{ card: welcomeToNightCityRetailMoxInciters, spent: true }] },
      );

      // Play both units
      engine.playCard(welcomeToNightCityRetailRidingNomad);
      engine.playCard(welcomeToNightCityRetailSwordwiseHuscle);

      // Swordwise Huscle (played this turn) still has summoning sickness
      const failure = engine.expectFailure(() =>
        engine.attackUnit(
          welcomeToNightCityRetailSwordwiseHuscle,
          welcomeToNightCityRetailMoxInciters,
        ),
      );
      expect(failure.errorCode).toBe("SUMMONING_SICKNESS");

      // But Riding Nomad can attack
      engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailMoxInciters);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
    });

    it("defeats a weaker rival unit in combat on the turn played", () => {
      // Riding Nomad (power 6) vs Ruthless Lowlife (power 1)
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [welcomeToNightCityRetailRidingNomad],
          eddies: welcomeToNightCityRetailRidingNomad.cost,
        },
        { field: [{ card: welcomeToNightCityRetailMoxInciters, spent: true }] },
      );

      engine.playCard(welcomeToNightCityRetailRidingNomad);

      engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailMoxInciters);
      engine.resolveFullFight();

      // Defender defeated -> trash
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === welcomeToNightCityRetailMoxInciters.id)).toBe(
        true,
      );

      // Attacker survives on field
      const p1Field = engine.getCardsInZone("field", P1);
      expect(p1Field.some((c) => c.definitionId === welcomeToNightCityRetailRidingNomad.id)).toBe(
        true,
      );
    });
  });
});
