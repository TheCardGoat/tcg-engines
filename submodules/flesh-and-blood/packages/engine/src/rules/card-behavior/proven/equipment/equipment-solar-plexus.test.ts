/**
 * ASB004 Solar Plexus — Light Chest (no printed defense).
 *
 * Printed:
 *   Instant - Destroy this, banish a card from your soul: Yellow cards cost
 *   you {r} less to play this turn.
 *
 * Reasoning (hand-authored):
 * 1. Mixed Instant cost: destroy-self + banish 1 from soul (seed soul zone).
 * 2. Hand-star cost snapshot was wrong for "this turn" — remodel to appliesTo
 *    multi-fire yellow filter (Savage Sash family).
 * 3. Yellow cost-2 AAC plays for 1{r} after arm; multi-fire second yellow too.
 * 4. Empty soul → activate illegal; non-yellow cost-2 still pays full.
 * 5. Destroy → GY (not banished); soul card → banished.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue } from "../../../fixtures.ts";
import { solarPlexus } from "../../../../../../cards/src/cards/equipment/solar-plexus.ts";
import { risingSpeedYellow } from "../../../../../../cards/src/cards/actions/rising-speed.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";

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
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering",
            orderedIds: decision.entries.map((e) => e.id),
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

describe("solar-plexus (ASB004)", () => {
  it("core mechanic: destroy + soul banish → yellow cards cost {r} less this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [solarPlexus],
        soul: [nimblismBlue],
        // Two yellow cost-2 AACs for multi-fire (no random-discard extra cost).
        hand: [risingSpeedYellow, risingSpeedYellow],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(solarPlexus);
    drain(game);

    expect(Bravo.zone("chest")).not.toContain(solarPlexus.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(solarPlexus.canonicalId);
    expect(Bravo.zone("banished")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("soul")).not.toContain(nimblismBlue.canonicalId);
    expect(game.getState().continuousEffectInstances.length).toBeGreaterThanOrEqual(1);
    const costGrant = game
      .getState()
      .continuousEffectInstances.find((inst) =>
        inst.atoms.some((atom) => atom.kind === "numeric" && atom.property === "cost"),
      );
    expect(costGrant?.futureApplicability?.remaining).toBeGreaterThan(1);

    // First yellow: cost 2 − 1 = 1.
    const rpBeforeFirst = Bravo.resourcePoints();
    Bravo.attackWith(risingSpeedYellow);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);
    expect(Bravo.resourcePoints()).toBe(rpBeforeFirst - 1);

    // Second yellow this turn also −1.
    const rpBeforeSecond = Bravo.resourcePoints();
    Bravo.attackWith(risingSpeedYellow);
    drain(game);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.resourcePoints()).toBe(rpBeforeSecond - 1);
  });

  it("boundaries: empty soul illegal; non-yellow pays full; model appliesTo yellow", () => {
    const emptySoul = FabTestEngine.start(
      {
        hero: bravo,
        chest: [solarPlexus],
        soul: [],
        hand: [],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => emptySoul.as(bravo).activate(solarPlexus)).toThrow();
    expect(emptySoul.as(bravo).zone("chest")).toContain(solarPlexus.canonicalId);

    // Arm discount, then red cost-2 still illegal at 1{r}.
    const nonYellow = FabTestEngine.start(
      {
        hero: bravo,
        chest: [solarPlexus],
        soul: [nimblismBlue],
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const NY = nonYellow.as(bravo);
    NY.activate(solarPlexus);
    drain(nonYellow);
    expect(() => NY.attackWith(brutalAssaultRed)).toThrow();

    // Without solar plexus, yellow cost-2 illegal at 1{r}.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        hand: [risingSpeedYellow],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).attackWith(risingSpeedYellow)).toThrow();

    const a1 = solarPlexus.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "cost",
      op: "subtract",
      amount: 1,
      duration: "this-turn",
      appliesTo: {
        next: { color: ["yellow"] },
      },
    });
  });
});
