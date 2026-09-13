/**
 * BEN004 Silken Gi — Generic Chest (no printed defense).
 *
 * Printed:
 *   Instant - Destroy Silken Gi: The next attack action card you play this
 *   turn has -1{p} and costs {r} less to play.
 *
 * Reasoning (hand-authored):
 * 1. Instant destroy-self → two appliesTo.next continuous grants (power −1
 *    and cost −1) for the next Action+Attack this turn (Savage Sash family).
 * 2. Brutal Assault (cost 2, p6) plays for 1{r} and deals 5 after −1{p}.
 * 3. Without gi: cost 2 illegal at 1{r}.
 * 4. Only the next AAC gets the discount (second AAC pays full cost).
 * 5. No battleworn/bladeBreak — no defend path required.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { silkenGi } from "../../../../../../cards/src/cards/equipment/silken-gi.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";

const LIFE = 40;
const BRUTAL_BASE = 6;

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

describe("silken-gi (BEN004)", () => {
  it("core mechanic: Instant destroy → next AAC −1{p} and cost −1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [silkenGi],
        hand: [brutalAssaultRed, brutalAssaultRed],
        actionPoints: 2,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    Bravo.activate(silkenGi);
    drain(game);

    expect(Bravo.zone("chest")).not.toContain(silkenGi.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(silkenGi.canonicalId);
    expect(game.getState().continuousEffectInstances.length).toBeGreaterThanOrEqual(2);

    // First AAC: cost 2 − 1 = 1; power 6 − 1 = 5.
    const lifeBefore = Opponent.life();
    const rpBefore = Bravo.resourcePoints();
    Bravo.attackWith(brutalAssaultRed);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);
    expect(Opponent.life()).toBe(lifeBefore - (BRUTAL_BASE - 1));
    expect(Bravo.resourcePoints()).toBe(rpBefore - 1);

    // Second AAC this turn: full cost 2 (only next one got the discount).
    const rpBeforeSecond = Bravo.resourcePoints();
    Bravo.attackWith(brutalAssaultRed);
    drain(game);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.resourcePoints()).toBe(rpBeforeSecond - 2);
  });

  it("boundaries: without gi cost-2 illegal at 1{r}; model appliesTo next AAC", () => {
    const bare = FabTestEngine.start(
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
    expect(() => bare.as(bravo).attackWith(brutalAssaultRed)).toThrow();

    const a1 = silkenGi.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect) return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.effect).toMatchObject({ type: "sequence" });
    const steps = (a1.effect as { steps: readonly unknown[] }).steps;
    expect(steps).toHaveLength(2);
    expect(steps[0]).toMatchObject({
      type: "modify-numeric",
      property: "power",
      op: "subtract",
      amount: 1,
      appliesTo: { next: { typeBox: { types: ["Action"], subtypes: ["Attack"] } } },
    });
    expect(steps[1]).toMatchObject({
      type: "modify-numeric",
      property: "cost",
      op: "subtract",
      amount: 1,
      appliesTo: { next: { typeBox: { types: ["Action"], subtypes: ["Attack"] } } },
    });
  });
});
