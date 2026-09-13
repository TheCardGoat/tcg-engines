/**
 * ASB003 Helm of Halo's Grace — Light Warrior Head d2 bladeBreak.
 *
 * Printed:
 *   When this defends, you may charge your hero's soul. If a yellow card is
 *   charged this way, draw a card. Blade Break
 *
 * Model (after fix):
 *   defend subject:self → optional charge at-resolution hand → conditional
 *   yellow-charged-this-way → draw 1
 *
 * Reasoning:
 * 1. subject:self required (same class as Ollin) so co-defenders do not arm it.
 * 2. Charge must select a hand card (not bare controller) so yellow vs red is
 *    player-visible.
 * 3. yellow-charged-this-way was fail-closed false; stamp + has-status from
 *    chargedCard / string flag after charge observation.
 * 4. Boundaries: decline optional, charge non-yellow (no draw), bladeBreak
 *    destroys helm at chain close after defend.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, tomeOfFyendalYellow } from "../../../fixtures.ts";
import { helmOfHaloSGrace } from "../../../../../../cards/src/cards/equipment/helm-of-halo-s-grace.ts";

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
      if (!pick) throw new Error("no charge candidate");
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [pick.instanceId] },
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

describe("helm-of-halo-s-grace (ASB003)", () => {
  it("core mechanic: defend → charge yellow → soul + draw", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [helmOfHaloSGrace],
        hand: [tomeOfFyendalYellow],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;
    const handBefore = Bravo.zone("hand").length;

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(helmOfHaloSGrace);
    drainDefendCharge(game, {
      acceptCharge: true,
      chargeCanonicalId: tomeOfFyendalYellow.canonicalId,
    });

    expect(Bravo.zone("soul")).toContain(tomeOfFyendalYellow.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(tomeOfFyendalYellow.canonicalId);
    // Charged yellow → draw 1; net hand: -1 charge +1 draw = same size, but
    // deck lost 1 and soul gained the yellow.
    expect(Bravo.zone("deck").length).toBe(deckBefore - 1);
    expect(Bravo.zone("hand").length).toBe(handBefore); // -1 charge +1 draw
    // bladeBreak: destroyed after defend.
    expect(Bravo.zone("head")).not.toContain(helmOfHaloSGrace.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(helmOfHaloSGrace.canonicalId);
  });

  it("boundaries: charge non-yellow → soul, no draw", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [helmOfHaloSGrace],
        hand: [nimblismBlue],
        deck: [tomeOfFyendalYellow, tomeOfFyendalYellow, tomeOfFyendalYellow],
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(helmOfHaloSGrace);
    drainDefendCharge(game, {
      acceptCharge: true,
      chargeCanonicalId: nimblismBlue.canonicalId,
    });

    expect(Bravo.zone("soul")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("deck").length).toBe(deckBefore);
  });

  it("boundaries: decline charge → no soul, no draw", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [helmOfHaloSGrace],
        hand: [tomeOfFyendalYellow],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(helmOfHaloSGrace);
    drainDefendCharge(game, { acceptCharge: false });

    expect(Bravo.zone("soul")).not.toContain(tomeOfFyendalYellow.canonicalId);
    expect(Bravo.zone("hand")).toContain(tomeOfFyendalYellow.canonicalId);
    expect(Bravo.zone("deck").length).toBe(deckBefore);
    // Still bladeBreak after defend.
    expect(Bravo.zone("graveyard")).toContain(helmOfHaloSGrace.canonicalId);
  });
});
