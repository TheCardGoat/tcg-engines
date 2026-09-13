/**
 * AKO004 Savage Sash — Brute Chest d2 Temper.
 *
 * Printed (i18n):
 *   Action - Destroy this: Attack action cards with 6 or more {p} cost you
 *   {r} less to play this turn. Go again
 *   Temper
 *
 * Model (after fix):
 *   Action destroy-self + go again → modify-numeric cost −1 this-turn
 *   appliesTo.next { types Action, subtypes Attack, power gte 6 } count 32
 *
 * Reasoning (hand-authored):
 * 1. Prior model scanned hand with count:star and locked those subjects only —
 *    wrong for "cost you less to play this turn" (future plays / multi AAC).
 * 2. Future-object appliesTo multi-fire (KSU006 family) with power≥6 filter.
 * 3. Brutal Assault (p6 cost 2) plays for 1{r}; without sash illegal at 1{r}.
 * 4. Snatch (p4 cost 0) is not a power≥6 target; cost-1 low-power AAC still
 *    pays full cost when seeded with 1 RP only for a non-qualifying card.
 * 5. Temper first defend d2 −1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { savageSash } from "../../../../../../cards/src/cards/equipment/savage-sash.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";

const SNATCH = 4;
const LIFE = 40;
const BRUTAL_POWER = 6;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("savage-sash (AKO004)", () => {
  it("core mechanic: destroy → p6+ AAC costs {r} less; multi-fire; go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [savageSash],
        // Two p6 cost-2 AACs — each should pay 1 after the sash.
        hand: [brutalAssaultRed, brutalAssaultRed],
        actionPoints: 3,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);
    const apBefore = Bravo.actionPoints();

    Bravo.activate(savageSash);
    drain(game);

    expect(Bravo.zone("chest")).not.toContain(savageSash.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(savageSash.canonicalId);
    // Go again refunds Action AP.
    expect(Bravo.actionPoints()).toBe(apBefore);
    expect(game.getState().continuousEffectInstances.length).toBeGreaterThanOrEqual(1);
    const costGrant = game
      .getState()
      .continuousEffectInstances.find((inst) =>
        inst.atoms.some((atom) => atom.kind === "numeric" && atom.property === "cost"),
      );
    expect(costGrant?.futureApplicability?.remaining).toBeGreaterThan(1);

    // First p6 AAC: cost 2 − 1 = 1.
    const lifeBefore = Opponent.life();
    const rpBeforeFirst = Bravo.resourcePoints();
    Bravo.attackWith(brutalAssaultRed);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);
    expect(Opponent.life()).toBe(lifeBefore - BRUTAL_POWER);
    expect(Bravo.resourcePoints()).toBe(rpBeforeFirst - 1);
    // Multi-fire still armed.
    expect(
      game
        .getState()
        .continuousEffectInstances.some((inst) => (inst.futureApplicability?.remaining ?? 0) > 0),
    ).toBe(true);

    // Second p6 AAC this turn also gets −1.
    const rpBeforeSecond = Bravo.resourcePoints();
    Bravo.attackWith(brutalAssaultRed);
    drain(game);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.resourcePoints()).toBe(rpBeforeSecond - 1);
  });

  it("boundaries: without sash cost-2 illegal at 1{r}; p4 snatch unaffected; Temper d2", () => {
    // Without sash: Brutal Assault cost 2 illegal at 1 RP.
    const noSash = FabTestEngine.start(
      {
        hero: bravo,
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => noSash.as(bravo).attackWith(brutalAssaultRed)).toThrow();

    // With sash, p4 snatch (cost 0) still plays — power filter excludes it from
    // being a required latch target; no over-reduction side effects expected.
    const snatchGame = FabTestEngine.start(
      {
        hero: bravo,
        chest: [savageSash],
        hand: [snatchRed],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    snatchGame.as(bravo).activate(savageSash);
    drain(snatchGame);
    snatchGame.as(bravo).attackWith(snatchRed);
    drain(snatchGame);
    snatchGame.helpers.resolveRestOfCombat();
    expect(snatchGame.as(dash).life()).toBe(LIFE - SNATCH);

    // Temper first defend.
    const temperGame = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        chest: [savageSash],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = temperGame.as(dash);
    const plateId = Defender.findCardInZone("chest", savageSash);
    temperGame.as(bravo).attackWith(snatchRed);
    Defender.defendWith(savageSash);
    drain(temperGame);
    temperGame.helpers.resolveRestOfCombat();
    expect(Defender.zone("chest")).toContain(savageSash.canonicalId);
    expect(temperGame.objectState(plateId)?.defenseCounterTotal).toBe(-1);
    expect(Defender.life()).toBe(20 - (SNATCH - 2));

    const a1 = savageSash.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("action");
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "cost",
      op: "subtract",
      amount: 1,
      duration: "this-turn",
      appliesTo: {
        next: {
          typeBox: {
            types: ["Action"],
            subtypes: ["Attack"],
          },
          power: { op: "gte", value: 6 },
        },
      },
    });
  });
});
