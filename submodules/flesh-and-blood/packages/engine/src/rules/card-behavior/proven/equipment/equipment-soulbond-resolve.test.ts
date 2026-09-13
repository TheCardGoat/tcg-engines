/**
 * DTD047 Soulbond Resolve — Light Warrior Chest d2 Temper.
 *
 * Printed:
 *   When this defends, you may charge your hero's soul.
 *   The first time you would be dealt damage each turn, if you've charged
 *   this turn, prevent 1 of that damage.
 *   Temper
 *
 * Reasoning (hand-authored):
 * 1. Defend subject:self + optional charge hand card (Halo's Grace family).
 * 2. Prevention was conditional-wrapped — static replacement collector only
 *    accepts direct prevention/replacement; remodel to ability.condition +
 *    prevention leaf with shielded controller and times:1.
 * 3. times:1 needs turn-scoped consumption stamp (static candidates re-collect).
 * 4. Core: defend → charge → combat damage (snatch 4 − d2 − prevent 1 = 1).
 * 5. No charge → no prevent (take 2 after d2). Temper −1 after defend.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { soulbondResolve } from "../../../../../../cards/src/cards/equipment/soulbond-resolve.ts";

const SNATCH = 4;
const LIFE = 20;
const DEFENSE = 2;

function drainDefendCharge(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptCharge: boolean; chargeCanonicalId?: string },
): void {
  for (let safety = 0; safety < 50; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: opts.acceptCharge },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick =
        (opts.chargeCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === opts.chargeCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
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

describe("soulbond-resolve (DTD047)", () => {
  it("core mechanic: defend → charge → first damage prevent 1", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        chest: [soulbondResolve],
        hand: [nimblismBlue],
        life: LIFE,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const plateId = Bravo.findCardInZone("chest", soulbondResolve);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(soulbondResolve);
    drainDefendCharge(game, {
      acceptCharge: true,
      chargeCanonicalId: nimblismBlue.canonicalId,
    });
    game.helpers.resolveRestOfCombat();

    // Charged into soul; charged-this-turn arming prevention.
    expect(Bravo.zone("soul")).toContain(nimblismBlue.canonicalId);
    expect(game.getState().players[Bravo.id]!.history.turn.charged).toBe(true);
    // Snatch 4 − d2 − prevent 1 = 1 damage.
    expect(Bravo.life()).toBe(LIFE - (SNATCH - DEFENSE - 1));
    // Temper: still equipped with −1 defense counter.
    expect(Bravo.zone("chest")).toContain(soulbondResolve.canonicalId);
    expect(game.objectState(plateId)?.defenseCounterTotal).toBe(-1);
  });

  it("boundaries: no charge → full remaining damage; model shapes", () => {
    const noCharge = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        chest: [soulbondResolve],
        hand: [nimblismBlue],
        life: LIFE,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = noCharge.as(bravo);

    noCharge.as(dash).attackWith(snatchRed);
    Bravo.defendWith(soulbondResolve);
    drainDefendCharge(noCharge, { acceptCharge: false });
    noCharge.helpers.resolveRestOfCombat();

    expect(Bravo.zone("soul")).not.toContain(nimblismBlue.canonicalId);
    expect(noCharge.getState().players[Bravo.id]!.history.turn.charged).toBe(false);
    // Snatch 4 − d2 = 2, no prevent.
    expect(Bravo.life()).toBe(LIFE - (SNATCH - DEFENSE));

    const a1 = soulbondResolve.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static") {
      expect(a1.trigger).toMatchObject({
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      });
      expect(a1.resolution?.effect).toMatchObject({
        type: "optional",
        effect: {
          type: "charge",
          target: {
            selector: "object",
            declared: "at-resolution",
            zones: ["hand"],
            count: 1,
          },
        },
      });
    }

    const a2 = soulbondResolve.base.abilities?.[1];
    expect(a2?.kind).toBe("static");
    if (a2?.kind === "static") {
      expect(a2.condition).toMatchObject({
        type: "performed-this-turn",
        event: "charge",
        player: "controller",
      });
      expect(a2.effect).toMatchObject({
        type: "prevention",
        preventionKind: "fixed",
        amount: 1,
        times: 1,
        shielded: { selector: "controller" },
      });
    }
  });
});
