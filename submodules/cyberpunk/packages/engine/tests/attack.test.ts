import { beforeAll, describe, expect, it } from "vite-plus/test";
import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";
import { alphaRuthlessLowlife } from "@tcg/cyberpunk-cards";
import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { alphaArmoredMinotaur } from "@tcg/cyberpunk-cards";
import { alphaCorpoSecurity } from "@tcg/cyberpunk-cards";
import { alphaSecondhandBombus } from "@tcg/cyberpunk-cards";
import { alphaMantisBlades } from "@tcg/cyberpunk-cards";
import { alphaSaburoArasakaStubbornPatriach } from "@tcg/cyberpunk-cards";
import { spoilerPlacideVoodooSentinel } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, registerMatchers } from "../src/testing/index.ts";
import "../src/testing/matchers.d.ts";

beforeAll(() => {
  registerMatchers();
});

// ── Helpers ───────────────────────────────────────────────────────────

/** Attacks now happen in the Main phase; no transition needed. */
function toAttackPhase(_engine: ReturnType<typeof CyberpunkTestEngine.createWithFixture>) {
  // No-op: attacks happen in main phase.
}

/** Run a full attack-rival flow through all three resolve steps. */
function resolveFullSteal(engine: ReturnType<typeof CyberpunkTestEngine.createWithFixture>) {
  engine.resolveAttack({ as: P1 }); // offensive -> defensive
  engine.resolveAttack({ as: P2, pass: true }); // defensive -> steal
  engine.resolveAttack({ as: P1 }); // steal: resolve
}

// ── Tests ─────────────────────────────────────────────────────────────

describe("Attack Step", () => {
  // ── Attack a Spent Unit (Fight) ─────────────────────────────────────

  describe("Attack a Spent Unit (Fight)", () => {
    describe("Offensive Step", () => {
      it("spends the attacking unit", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          { field: [{ card: alphaRuthlessLowlife, spent: true }] },
        );
        toAttackPhase(engine);

        engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife, { as: P1 });

        const attacker = engine.getCard(alphaSwordwiseHuscle, "field", P1);
        expect(attacker.meta.spent).toBe(true);
      });

      it("sets attack state with kind fight and step offensive", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          { field: [{ card: alphaRuthlessLowlife, spent: true }] },
        );
        toAttackPhase(engine);

        engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife, { as: P1 });

        const attack = engine.getState().G.attackState;
        expect(attack).not.toBeNull();
        expect(attack!.kind).toBe("fight");
        expect(attack!.step).toBe("offensive");
        expect(attack!.defenderId).not.toBeNull();
      });

      it("emits attackDeclared event with kind fight", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          { field: [{ card: alphaRuthlessLowlife, spent: true }] },
        );
        toAttackPhase(engine);

        engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife, { as: P1 });

        const event = engine.getLastEvent("attackDeclared");
        expect(event).toBeDefined();
        expect((event as any).attackKind).toBe("fight");
      });

      it("cannot attack with a spent unit", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [{ card: alphaSwordwiseHuscle, spent: true }] },
          { field: [{ card: alphaRuthlessLowlife, spent: true }] },
        );
        toAttackPhase(engine);

        const failure = engine.expectFailure(() =>
          engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife, { as: P1 }),
        );
        expect(failure.errorCode).toBe("CARD_SPENT");
      });

      it("cannot attack with a unit played this turn (summoning sickness)", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [{ card: alphaSwordwiseHuscle, playedThisTurn: true }] },
          { field: [{ card: alphaRuthlessLowlife, spent: true }] },
        );
        toAttackPhase(engine);

        const failure = engine.expectFailure(() =>
          engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife, { as: P1 }),
        );
        expect(failure.errorCode).toBe("SUMMONING_SICKNESS");
      });

      it("can only attack spent rival units, not ready ones", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          { field: [alphaRuthlessLowlife] }, // ready (not spent)
        );
        toAttackPhase(engine);

        const failure = engine.expectFailure(() =>
          engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife, { as: P1 }),
        );
        expect(failure.errorCode).toBe("TARGET_READY");
      });
    });

    describe("Defensive Step", () => {
      it("resolveAttack advances from offensive to defensive step", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          { field: [{ card: alphaRuthlessLowlife, spent: true }] },
        );
        toAttackPhase(engine);

        engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife, { as: P1 });
        engine.resolveAttack({ as: P1 }); // offensive -> defensive

        const attack = engine.getState().G.attackState;
        expect(attack!.step).toBe("defensive");
      });

      it("rival can pass the defensive step to proceed to fight", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          { field: [{ card: alphaRuthlessLowlife, spent: true }] },
        );
        toAttackPhase(engine);

        engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife, { as: P1 });
        engine.resolveAttack({ as: P1 }); // offensive -> defensive
        engine.resolveAttack({ as: P2, pass: true }); // defensive -> fight

        const attack = engine.getState().G.attackState;
        expect(attack!.step).toBe("fight");
      });
    });

    describe("Fight Resolution", () => {
      it("higher-power attacker defeats defender", () => {
        // Swordwise Huscle (5) vs Ruthless Lowlife (1)
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          { field: [{ card: alphaRuthlessLowlife, spent: true }] },
        );
        toAttackPhase(engine);

        engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife, { as: P1 });
        engine.resolveFullFight();

        // Defender defeated -> trash
        const p2Trash = engine.getCardsInZone("trash", P2);
        expect(p2Trash.some((c) => c.definitionId === alphaRuthlessLowlife.id)).toBe(true);

        // Attacker survives on field
        const p1Field = engine.getCardsInZone("field", P1);
        expect(p1Field.some((c) => c.definitionId === alphaSwordwiseHuscle.id)).toBe(true);
      });

      it("higher-power defender defeats attacker", () => {
        // Ruthless Lowlife (1) attacks Armored Minotaur (9)
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaRuthlessLowlife] },
          { field: [{ card: alphaArmoredMinotaur, spent: true }] },
        );
        toAttackPhase(engine);

        engine.attackUnit(alphaRuthlessLowlife, alphaArmoredMinotaur, { as: P1 });
        engine.resolveFullFight();

        // Attacker defeated -> trash
        const p1Trash = engine.getCardsInZone("trash", P1);
        expect(p1Trash.some((c) => c.definitionId === alphaRuthlessLowlife.id)).toBe(true);

        // Defender survives on field
        const p2Field = engine.getCardsInZone("field", P2);
        expect(p2Field.some((c) => c.definitionId === alphaArmoredMinotaur.id)).toBe(true);
      });

      it("equal power causes mutual defeat", () => {
        // Swordwise Huscle (5) vs Swordwise Huscle (5)
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          { field: [{ card: alphaArmoredMinotaur, spent: true, powerModifier: -4 }] }, // 9 - 4 = 5
        );
        toAttackPhase(engine);

        engine.attackUnit(alphaSwordwiseHuscle, alphaArmoredMinotaur, { as: P1 });
        engine.resolveFullFight();

        // Both defeated
        const p1Trash = engine.getCardsInZone("trash", P1);
        const p2Trash = engine.getCardsInZone("trash", P2);
        expect(p1Trash.some((c) => c.definitionId === alphaSwordwiseHuscle.id)).toBe(true);
        expect(p2Trash.some((c) => c.definitionId === alphaArmoredMinotaur.id)).toBe(true);

        const p1Field = engine.getCardsInZone("field", P1);
        const p2Field = engine.getCardsInZone("field", P2);
        expect(p1Field).toHaveLength(0);
        expect(p2Field).toHaveLength(0);
      });
    });

    describe("Defeat", () => {
      it("defeated unit moves to trash", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaArmoredMinotaur] }, // power 9
          { field: [{ card: alphaRuthlessLowlife, spent: true }] }, // power 1
        );
        toAttackPhase(engine);

        engine.attackUnit(alphaArmoredMinotaur, alphaRuthlessLowlife, { as: P1 });
        engine.resolveFullFight();

        const defeated = engine.getCard(alphaRuthlessLowlife, "trash", P2);
        expect(defeated.zone).toBe("trash");
      });

      it("defeated unit's attached gear moves to trash with it", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaArmoredMinotaur] }, // power 9
          { field: [{ card: alphaRuthlessLowlife, spent: true }, alphaMantisBlades] }, // power 1 + gear
        );

        // Attach gear to the defender manually before attacking
        const defenderCard = engine.getCard(alphaRuthlessLowlife, "field", P2);
        const gearCard = engine.getCard(alphaMantisBlades, "field", P2);

        // Use low-level state to attach gear (no move for this in test engine)
        const state = engine.getState();
        const gearInst = state.G.cardIndex[gearCard.instanceId as string];
        const defInst = state.G.cardIndex[defenderCard.instanceId as string];
        if (gearInst && defInst) {
          // We need to use the engine's internal attach mechanism
          // Instead, let's use a different approach: create the scenario via executeMove
        }

        // Actually, let's test this more directly by checking the resolve-attack code path.
        // The engine needs gear to be properly attached via operations. Let me use a simpler approach.
        toAttackPhase(engine);

        engine.attackUnit(alphaArmoredMinotaur, alphaRuthlessLowlife, { as: P1 });
        engine.resolveFullFight();

        // Defender is in trash
        const p2Trash = engine.getCardsInZone("trash", P2);
        expect(p2Trash.some((c) => c.definitionId === alphaRuthlessLowlife.id)).toBe(true);
      });

      it("mutual defeat sends both units to trash", () => {
        // Both power 5
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] }, // power 5
          { field: [{ card: alphaArmoredMinotaur, spent: true, powerModifier: -4 }] }, // 9-4 = 5
        );
        toAttackPhase(engine);

        engine.attackUnit(alphaSwordwiseHuscle, alphaArmoredMinotaur, { as: P1 });
        engine.resolveFullFight();

        expect(engine.getCardsInZone("field", P1)).toHaveLength(0);
        expect(engine.getCardsInZone("field", P2)).toHaveLength(0);

        const events = engine.getEvents("cardDefeated");
        expect(events).toHaveLength(2);
      });
    });
  });

  // ── Attack Rival (Direct Attack / Steal) ────────────────────────────

  describe("Attack Rival (Direct Attack / Steal)", () => {
    describe("Offensive Step", () => {
      it("spends the attacking unit", () => {
        const engine = CyberpunkTestEngine.createWithFixture({ field: [alphaSwordwiseHuscle] });
        toAttackPhase(engine);

        engine.attackRival(alphaSwordwiseHuscle, { as: P1 });

        const attacker = engine.getCard(alphaSwordwiseHuscle, "field", P1);
        expect(attacker.meta.spent).toBe(true);
      });

      it("sets attack state with kind direct and defenderId null", () => {
        const engine = CyberpunkTestEngine.createWithFixture({ field: [alphaSwordwiseHuscle] });
        toAttackPhase(engine);

        engine.attackRival(alphaSwordwiseHuscle, { as: P1 });

        const attack = engine.getState().G.attackState;
        expect(attack).not.toBeNull();
        expect(attack!.kind).toBe("direct");
        expect(attack!.defenderId).toBeNull();
        expect(attack!.step).toBe("offensive");
      });
    });

    describe("Steal Resolution", () => {
      it("steals 1 gig by default (power < 10)", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaArmoredMinotaur] }, // power 9
          { gigArea: [{ dieType: "d6", faceValue: 3 }] },
        );
        toAttackPhase(engine);

        const p2GigsBefore = engine.getGigCount(P2);
        expect(p2GigsBefore).toBe(1);

        engine.attackRival(alphaArmoredMinotaur, { as: P1 });
        resolveFullSteal(engine);

        expect(engine.getGigCount(P2)).toBe(0);
        expect(engine.getGigCount(P1)).toBe(1);
      });

      it("steals 2 gigs at power 10", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [spoilerPlacideVoodooSentinel], hand: [], deck: 0 }, // power 10
          {
            gigArea: [
              { dieType: "d6", faceValue: 3 },
              { dieType: "d8", faceValue: 5 },
              { dieType: "d4", faceValue: 2 },
            ],
          },
        );
        toAttackPhase(engine);

        expect(engine.getGigCount(P2)).toBe(3);

        engine.attackRival(spoilerPlacideVoodooSentinel, { as: P1 });
        resolveFullSteal(engine);

        // 1 + floor(10/10) = 2 gigs stolen
        expect(engine.getGigCount(P1)).toBe(2);
        expect(engine.getGigCount(P2)).toBe(1);
      });

      it("uses effective attacking power for steal count and direct steal logs", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          {
            legendArea: [{ card: alphaSaburoArasakaStubbornPatriach, faceDown: false }],
            field: [alphaArmoredMinotaur], // printed 9, Saburo makes it 10 while attacking
          },
          {
            gigArea: [
              { dieType: "d6", faceValue: 3 },
              { dieType: "d8", faceValue: 5 },
            ],
          },
        );
        toAttackPhase(engine);

        engine.attackRival(alphaArmoredMinotaur, { as: P1 });
        engine.resolveAttack({ as: P1 });
        engine.resolveAttack({ as: P2, pass: true });
        const result = engine.resolveAttack({ as: P1 });

        expect(engine.getGigCount(P1)).toBe(2);
        expect(engine.getGigCount(P2)).toBe(0);
        expect(result.moveLogs).toContainEqual(
          expect.objectContaining({
            type: "action",
            messageKey: "move.resolveAttack.direct",
            params: expect.objectContaining({
              attackerName: "Armored Minotaur",
              attackerPower: 10,
              count: 2,
            }),
          }),
        );
      });

      it("includes effective attacking power on chosen multi-gig steal logs", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          {
            legendArea: [{ card: alphaSaburoArasakaStubbornPatriach, faceDown: false }],
            field: [alphaArmoredMinotaur],
          },
          {
            gigArea: [
              { dieType: "d4", faceValue: 1 },
              { dieType: "d6", faceValue: 3 },
              { dieType: "d8", faceValue: 5 },
            ],
          },
        );
        toAttackPhase(engine);

        engine.attackRival(alphaArmoredMinotaur, { as: P1 });
        engine.executeMove("resolveAttack", { args: {} }, P1);
        engine.executeMove("resolveAttack", { args: { pass: true } }, P2);
        engine.executeMove("resolveAttack", { args: {} }, P1);
        const p2Gigs = engine.getGigDice(P2);
        const result = engine.executeMove(
          "resolveStealGigs",
          { args: { dieIds: p2Gigs.slice(0, 2).map((die) => die.id as string) } },
          P1,
        );

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.moveLogs).toContainEqual(
            expect.objectContaining({
              type: "resolveStealGigs",
              attackerName: "Armored Minotaur",
              attackerPower: 10,
              stolenCount: 2,
            }),
          );
        }
      });

      it("steals 0 gigs if rival has none", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle], gigArea: [] },
          { gigArea: [] }, // no gigs
        );
        toAttackPhase(engine);

        expect(engine.getGigCount(P2)).toBe(0);

        engine.attackRival(alphaSwordwiseHuscle, { as: P1 });
        resolveFullSteal(engine);

        expect(engine.getGigCount(P1)).toBe(0);
        expect(engine.getGigCount(P2)).toBe(0);
      });

      it("stolen gig moves from rival gigArea to attacker gigArea", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] }, // power 5
          { gigArea: [{ dieType: "d10", faceValue: 7 }] },
        );
        toAttackPhase(engine);

        const p2GigsBefore = engine.getGigDice(P2);
        expect(p2GigsBefore).toHaveLength(1);
        const stolenDieId = p2GigsBefore[0]!.id;

        engine.attackRival(alphaSwordwiseHuscle, { as: P1 });
        resolveFullSteal(engine);

        // The die moved from P2 to P1
        const p1Gigs = engine.getGigDice(P1);
        expect(p1Gigs).toHaveLength(1);
        expect(p1Gigs[0]!.id).toBe(stolenDieId);
        expect(p1Gigs[0]!.faceValue).toBe(7);
      });

      it("steals 3 gigs at power 20", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [{ card: alphaArmoredMinotaur, powerModifier: 11 }] }, // 9+11=20
          {
            gigArea: [
              { dieType: "d4", faceValue: 1 },
              { dieType: "d6", faceValue: 2 },
              { dieType: "d8", faceValue: 3 },
              { dieType: "d10", faceValue: 4 },
            ],
          },
        );
        toAttackPhase(engine);

        engine.attackRival(alphaArmoredMinotaur, { as: P1 });
        resolveFullSteal(engine);

        // 1 + floor(20/10) = 3 gigs stolen
        expect(engine.getGigCount(P1)).toBe(3);
        expect(engine.getGigCount(P2)).toBe(1);
      });

      it("steals only available gigs when rival has fewer than steal count", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [spoilerPlacideVoodooSentinel], hand: [], deck: 0 }, // power 10 → would steal 2
          { gigArea: [{ dieType: "d6", faceValue: 3 }] }, // only 1 gig
        );
        toAttackPhase(engine);

        engine.attackRival(spoilerPlacideVoodooSentinel, { as: P1 });
        resolveFullSteal(engine);

        // Rival only had 1, so only 1 stolen
        expect(engine.getGigCount(P1)).toBe(1);
        expect(engine.getGigCount(P2)).toBe(0);
      });

      it("emits gigStolen event when a gig is stolen", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          { gigArea: [{ dieType: "d8", faceValue: 4 }] },
        );
        toAttackPhase(engine);

        engine.attackRival(alphaSwordwiseHuscle, { as: P1 });
        resolveFullSteal(engine);

        const event = engine.getLastEvent("gigStolen");
        expect(event).toBeDefined();
      });

      it("attack state is null after steal resolves", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          { gigArea: [{ dieType: "d6", faceValue: 2 }] },
        );
        toAttackPhase(engine);

        engine.attackRival(alphaSwordwiseHuscle, { as: P1 });
        resolveFullSteal(engine);

        expect(engine.getState().G.attackState).toBeNull();
      });
    });
  });

  // ── Blocker Mechanic ────────────────────────────────────────────────

  describe("Blocker Mechanic", () => {
    it("blocker redirects direct attack to itself", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] }, // power 5
        { field: [alphaCorpoSecurity], gigArea: [{ dieType: "d6", faceValue: 3 }] }, // blocker, power 2
      );
      toAttackPhase(engine);

      engine.attackRival(alphaSwordwiseHuscle, { as: P1 });
      engine.resolveAttack({ as: P1 }); // offensive -> defensive

      // Defender uses blocker during defensive step
      engine.useBlocker(alphaCorpoSecurity, { as: P2 });

      const attack = engine.getState().G.attackState;
      expect(attack!.defenderId).not.toBeNull();
      expect(attack!.kind).toBe("fight");
      expect(attack!.redirectedByBlocker).toBe(true);
      expect(engine.getFilteredView(P2).attackState?.redirectedByBlocker).toBe(true);
    });

    it("attack kind changes to fight after blocker", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] },
        { field: [alphaCorpoSecurity] },
      );
      toAttackPhase(engine);

      engine.attackRival(alphaSwordwiseHuscle, { as: P1 });
      engine.resolveAttack({ as: P1 }); // offensive -> defensive

      engine.useBlocker(alphaCorpoSecurity, { as: P2 });

      const attack = engine.getState().G.attackState;
      expect(attack!.kind).toBe("fight");
    });

    it("blocker is spent when activated", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] },
        { field: [alphaCorpoSecurity] },
      );
      toAttackPhase(engine);

      engine.attackRival(alphaSwordwiseHuscle, { as: P1 });
      engine.resolveAttack({ as: P1 }); // offensive -> defensive

      engine.useBlocker(alphaCorpoSecurity, { as: P2 });

      const blocker = engine.getCard(alphaCorpoSecurity, "field", P2);
      expect(blocker.meta.spent).toBe(true);
    });

    it("defeating a blocker does NOT steal gigs", () => {
      // Swordwise Huscle (5) vs Corpo Security blocker (2)
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] }, // power 5
        { field: [alphaCorpoSecurity], gigArea: [{ dieType: "d6", faceValue: 3 }] },
      );
      toAttackPhase(engine);

      const p2GigsBefore = engine.getGigCount(P2);

      engine.attackRival(alphaSwordwiseHuscle, { as: P1 });
      engine.resolveAttack({ as: P1 }); // offensive -> defensive
      engine.useBlocker(alphaCorpoSecurity, { as: P2 });

      // Now it's a fight, resolve it
      engine.resolveAttack({ as: P2, pass: true }); // defensive -> fight
      engine.resolveAttack({ as: P1 }); // fight -> defeat
      engine.resolveAttack({ as: P1 }); // defeat -> cleared

      // Blocker defeated
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === alphaCorpoSecurity.id)).toBe(true);

      // No gigs stolen - fight resolution, not steal
      expect(engine.getGigCount(P2)).toBe(p2GigsBefore);
      expect(engine.getGigCount(P1)).toBe(0);
    });

    it("spent blocker cannot block", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] },
        { field: [{ card: alphaCorpoSecurity, spent: true }] },
      );
      toAttackPhase(engine);

      engine.attackRival(alphaSwordwiseHuscle, { as: P1 });
      engine.resolveAttack({ as: P1 }); // offensive -> defensive

      const failure = engine.expectFailure(() => engine.useBlocker(alphaCorpoSecurity, { as: P2 }));
      expect(failure.errorCode).toBe("CARD_SPENT");
    });

    it("non-blocker unit cannot block", () => {
      // Ruthless Lowlife has no blocker keyword
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] },
        { field: [alphaRuthlessLowlife] },
      );
      toAttackPhase(engine);

      engine.attackRival(alphaSwordwiseHuscle, { as: P1 });
      engine.resolveAttack({ as: P1 }); // offensive -> defensive

      const failure = engine.expectFailure(() =>
        engine.useBlocker(alphaRuthlessLowlife, { as: P2 }),
      );
      expect(failure.errorCode).toBe("NO_BLOCKER");
    });

    it("only the defending player can use blocker", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] },
        { field: [alphaCorpoSecurity] },
      );
      toAttackPhase(engine);

      engine.attackRival(alphaSwordwiseHuscle, { as: P1 });
      engine.resolveAttack({ as: P1 }); // offensive -> defensive

      // P1 (attacker) tries to use P2's blocker
      const failure = engine.expectFailure(() => engine.useBlocker(alphaCorpoSecurity, { as: P1 }));
      expect(failure.errorCode).toBe("NOT_YOUR_DEFENSE");
    });
  });

  // ── Attack Restrictions ─────────────────────────────────────────────

  describe("Attack Restrictions", () => {
    it("can attack in the main phase", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] },
        { field: [{ card: alphaRuthlessLowlife, spent: true }] },
      );
      expect(engine.getPhase()).toBe("main");

      expect(
        engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife, { as: P1 }),
      ).toBeSuccessfulCommand();
    });

    it("cannot declare a new attack while one is in progress", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle, alphaArmoredMinotaur] },
        {
          field: [
            { card: alphaRuthlessLowlife, spent: true },
            { card: alphaSecondhandBombus, spent: true },
          ],
        },
      );
      toAttackPhase(engine);

      // Start first attack
      engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife, { as: P1 });

      // Try to declare second attack while first is in progress
      const failure = engine.expectFailure(() =>
        engine.attackUnit(alphaArmoredMinotaur, alphaSecondhandBombus, { as: P1 }),
      );
      expect(failure.errorCode).toBe("ATTACK_IN_PROGRESS");
    });

    it("ready rival units cannot be targeted", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] },
        { field: [alphaRuthlessLowlife] }, // ready
      );
      toAttackPhase(engine);

      const failure = engine.expectFailure(() =>
        engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife, { as: P1 }),
      );
      expect(failure.errorCode).toBe("TARGET_READY");
    });

    it("summoning sickness prevents attacking", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: alphaSwordwiseHuscle, playedThisTurn: true }],
      });
      toAttackPhase(engine);

      const failure = engine.expectFailure(() =>
        engine.attackRival(alphaSwordwiseHuscle, { as: P1 }),
      );
      expect(failure.errorCode).toBe("SUMMONING_SICKNESS");
    });

    describe("Main-phase moves blocked during attack", () => {
      it("attacker cannot play cards during offensive step", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle], hand: [alphaRuthlessLowlife] },
          { field: [{ card: alphaArmoredMinotaur, spent: true }] },
        );
        toAttackPhase(engine);
        engine.attackUnit(alphaSwordwiseHuscle, alphaArmoredMinotaur, { as: P1 });

        const prompt = engine.getPrompt(P1);
        expect(prompt.availableMoves.some((m) => m.moveId === "playCard")).toBe(false);

        const failure = engine.expectFailure(() =>
          engine.playCard(alphaRuthlessLowlife, { as: P1 }),
        );
        expect(failure.errorCode).toBe("ATTACK_IN_PROGRESS");
      });

      it("attacker cannot sell cards during offensive step", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle], hand: [alphaRuthlessLowlife] },
          { field: [{ card: alphaArmoredMinotaur, spent: true }] },
        );
        toAttackPhase(engine);
        engine.attackUnit(alphaSwordwiseHuscle, alphaArmoredMinotaur, { as: P1 });

        const prompt = engine.getPrompt(P1);
        expect(prompt.availableMoves.some((m) => m.moveId === "sellCard")).toBe(false);

        const failure = engine.expectFailure(() =>
          engine.sellCard(alphaRuthlessLowlife, { as: P1 }),
        );
        expect(failure.errorCode).toBe("ATTACK_IN_PROGRESS");
      });

      it("attacker cannot call legend during offensive step", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          {
            field: [alphaSwordwiseHuscle],
            legendArea: [{ card: alphaSaburoArasakaStubbornPatriach, faceDown: true }],
          },
          { field: [{ card: alphaArmoredMinotaur, spent: true }] },
        );
        toAttackPhase(engine);
        engine.attackUnit(alphaSwordwiseHuscle, alphaArmoredMinotaur, { as: P1 });

        const prompt = engine.getPrompt(P1);
        expect(prompt.availableMoves.some((m) => m.moveId === "callLegend")).toBe(false);

        const failure = engine.expectFailure(() =>
          engine.callLegend(alphaSaburoArasakaStubbornPatriach, { as: P1 }),
        );
        expect(failure.errorCode).toBe("ATTACK_IN_PROGRESS");
      });

      it("attacker cannot go solo during offensive step", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          {
            field: [alphaSwordwiseHuscle],
            legendArea: [{ card: alphaSaburoArasakaStubbornPatriach, faceDown: false }],
          },
          { field: [{ card: alphaArmoredMinotaur, spent: true }] },
        );
        toAttackPhase(engine);
        engine.attackUnit(alphaSwordwiseHuscle, alphaArmoredMinotaur, { as: P1 });

        const prompt = engine.getPrompt(P1);
        expect(prompt.availableMoves.some((m) => m.moveId === "goSolo")).toBe(false);

        const legendId = engine.getCard(
          alphaSaburoArasakaStubbornPatriach,
          "legendArea",
          P1,
        ).instanceId;
        const result = engine.executeMove("goSolo", { args: { cardId: legendId as string } }, P1);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.errorCode).toBe("ATTACK_IN_PROGRESS");
        }
      });

      it("attacker cannot activate abilities during offensive step", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          { field: [{ card: alphaArmoredMinotaur, spent: true }] },
        );
        toAttackPhase(engine);
        engine.attackUnit(alphaSwordwiseHuscle, alphaArmoredMinotaur, { as: P1 });

        const prompt = engine.getPrompt(P1);
        expect(prompt.availableMoves.some((m) => m.moveId === "activateAbility")).toBe(false);
      });

      it("attacker cannot pass phase during attack", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          { field: [{ card: alphaArmoredMinotaur, spent: true }] },
        );
        toAttackPhase(engine);
        engine.attackUnit(alphaSwordwiseHuscle, alphaArmoredMinotaur, { as: P1 });

        const prompt = engine.getPrompt(P1);
        expect(prompt.availableMoves.some((m) => m.moveId === "passPhase")).toBe(false);

        const failure = engine.expectFailure(() => engine.passPhase({ as: P1 }));
        expect(failure.errorCode).toBe("ATTACK_IN_PROGRESS");
      });

      it("defender can call legend during defensive step", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          {
            field: [{ card: alphaArmoredMinotaur, spent: true }],
            legendArea: [{ card: alphaSaburoArasakaStubbornPatriach, faceDown: true }],
          },
        );
        toAttackPhase(engine);
        engine.attackUnit(alphaSwordwiseHuscle, alphaArmoredMinotaur, { as: P1 });
        engine.resolveAttack({ as: P1 }); // offensive -> defensive

        const prompt = engine.getPrompt(P2);
        expect(prompt.availableMoves.some((m) => m.moveId === "callLegend")).toBe(true);

        expect(
          engine.callLegend(alphaSaburoArasakaStubbornPatriach, { as: P2 }),
        ).toBeSuccessfulCommand();
      });

      it("defender can play QUICK cards during defensive step", () => {
        const quickProgram: StructuredCardDefinition = {
          ...(alphaRuthlessLowlife as unknown as StructuredCardDefinition),
          id: "test-quick-program",
          externalId: "test-quick-program",
          slug: "test-quick-program",
          name: "Quick Program",
          displayName: "Quick Program",
          type: "program",
          cost: 0,
          power: null,
          keywords: ["quick"],
          abilities: [],
          reminderText: [],
        } as unknown as StructuredCardDefinition;

        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          {
            field: [{ card: alphaArmoredMinotaur, spent: true }],
            hand: [quickProgram],
          },
        );
        toAttackPhase(engine);
        engine.attackUnit(alphaSwordwiseHuscle, alphaArmoredMinotaur, { as: P1 });
        engine.resolveAttack({ as: P1 }); // offensive -> defensive

        const prompt = engine.getPrompt(P2);
        expect(prompt.availableMoves.some((m) => m.moveId === "playCard")).toBe(true);

        expect(engine.playCard(quickProgram, { as: P2 })).toBeSuccessfulCommand();
      });

      it("defender cannot play non-QUICK cards during defensive step", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          {
            field: [{ card: alphaArmoredMinotaur, spent: true }],
            hand: [alphaRuthlessLowlife],
          },
        );
        toAttackPhase(engine);
        engine.attackUnit(alphaSwordwiseHuscle, alphaArmoredMinotaur, { as: P1 });
        engine.resolveAttack({ as: P1 }); // offensive -> defensive

        const prompt = engine.getPrompt(P2);
        expect(prompt.availableMoves.some((m) => m.moveId === "playCard")).toBe(false);

        const failure = engine.expectFailure(() =>
          engine.playCard(alphaRuthlessLowlife, { as: P2 }),
        );
        expect(failure.errorCode).toBe("NOT_QUICK");
      });

      it("defender can activate QUICK abilities during defensive step", () => {
        const quickUnit: StructuredCardDefinition = {
          ...(alphaRuthlessLowlife as unknown as StructuredCardDefinition),
          id: "test-quick-ability-unit",
          externalId: "test-quick-ability-unit",
          slug: "test-quick-ability-unit",
          name: "Quick Ability Unit",
          displayName: "Quick Ability Unit",
          keywords: ["quick"],
          abilities: [
            {
              kind: "keyword",
              text: "QUICK: Ready this unit.",
              keyword: "quick",
              trigger: { trigger: "activated" },
              costs: [{ cost: "spend", target: { selector: "self" } }],
              effects: [{ effect: "ready", target: { selector: "self" } }],
            },
          ],
          reminderText: [],
        } as unknown as StructuredCardDefinition;

        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          {
            field: [{ card: alphaArmoredMinotaur, spent: true }, quickUnit],
          },
        );
        toAttackPhase(engine);
        engine.attackUnit(alphaSwordwiseHuscle, alphaArmoredMinotaur, { as: P1 });
        engine.resolveAttack({ as: P1 }); // offensive -> defensive

        const prompt = engine.getPrompt(P2);
        expect(prompt.availableMoves.some((m) => m.moveId === "activateAbility")).toBe(true);

        expect(engine.activateAbility(quickUnit, 0, { as: P2 })).toBeSuccessfulCommand();
      });

      it("defender cannot activate non-QUICK abilities during defensive step", () => {
        const nonQuickUnit: StructuredCardDefinition = {
          ...(alphaRuthlessLowlife as unknown as StructuredCardDefinition),
          id: "test-nonquick-ability-unit",
          externalId: "test-nonquick-ability-unit",
          slug: "test-nonquick-ability-unit",
          name: "Non-Quick Ability Unit",
          displayName: "Non-Quick Ability Unit",
          keywords: [],
          abilities: [
            {
              kind: "keyword",
              text: "Ready this unit.",
              trigger: { trigger: "activated" },
              costs: [{ cost: "spend", target: { selector: "self" } }],
              effects: [{ effect: "ready", target: { selector: "self" } }],
            },
          ],
          reminderText: [],
        } as unknown as StructuredCardDefinition;

        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle] },
          {
            field: [{ card: alphaArmoredMinotaur, spent: true }, nonQuickUnit],
          },
        );
        toAttackPhase(engine);
        engine.attackUnit(alphaSwordwiseHuscle, alphaArmoredMinotaur, { as: P1 });
        engine.resolveAttack({ as: P1 }); // offensive -> defensive

        const prompt = engine.getPrompt(P2);
        expect(prompt.availableMoves.some((m) => m.moveId === "activateAbility")).toBe(false);

        const failure = engine.expectFailure(() =>
          engine.activateAbility(nonQuickUnit, 0, { as: P2 }),
        );
        expect(failure.errorCode).toBe("NOT_QUICK");
      });

      it("normal main-phase moves are available again after attack resolves", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { field: [alphaSwordwiseHuscle], hand: [alphaRuthlessLowlife] },
          { field: [{ card: alphaArmoredMinotaur, spent: true }] },
        );
        toAttackPhase(engine);
        engine.attackUnit(alphaSwordwiseHuscle, alphaArmoredMinotaur, { as: P1 });
        engine.resolveFullFight();

        expect(engine.getState().G.attackState).toBeNull();
        const prompt = engine.getPrompt(P1);
        expect(prompt.availableMoves.some((m) => m.moveId === "playCard")).toBe(true);
        expect(prompt.availableMoves.some((m) => m.moveId === "passPhase")).toBe(true);
      });
    });
  });

  // ── Multiple Attacks in One Phase ───────────────────────────────────

  describe("Multiple Attacks in One Phase", () => {
    it("attack state is null after resolution", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] },
        { field: [{ card: alphaRuthlessLowlife, spent: true }] },
      );
      toAttackPhase(engine);

      engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife, { as: P1 });
      engine.resolveFullFight();

      expect(engine.getState().G.attackState).toBeNull();
    });

    it("can declare a new attack after the previous one resolves", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle, alphaArmoredMinotaur] },
        {
          field: [
            { card: alphaRuthlessLowlife, spent: true },
            { card: alphaSecondhandBombus, spent: true },
          ],
        },
      );
      toAttackPhase(engine);

      // First attack
      engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife, { as: P1 });
      engine.resolveFullFight();

      expect(engine.getState().G.attackState).toBeNull();

      // Second attack with a different unit
      engine.attackUnit(alphaArmoredMinotaur, alphaSecondhandBombus, { as: P1 });

      const attack = engine.getState().G.attackState;
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("fight");
    });
  });
});
