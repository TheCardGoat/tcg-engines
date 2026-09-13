/**
 * DTD217 Diadem of Dreamstate — Illusionist Head, Ward 2, no defense.
 *
 * Printed:
 *   Once per turn, when this or a non-token permanent you control with ward
 *   is destroyed, you may pay {r}. If you do, create a Ponder token.
 *   Ward 2
 *
 * Model (after fix):
 *   static triggered destroy subjectController:controller + hasKeyword ward
 *   + excludeMetatypes Token → optional pay 1{r} → create Ponder
 *   limit 1/turn; keywords ward(2)
 *
 * Reasoning:
 * 1. Ward 2 vs arcane (voltic bolt) is the public destroy path for "this".
 * 2. Optional pay needs available RP; decline / 0 RP → no Ponder.
 * 3. subjectController + excludeMetatypes pin "you control" / non-token.
 * 4. OPT limit is on the ability; second destroy same turn is out of scope
 *    for the first green AAA (needs two ward pieces destroyed same turn).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, volticBoltRed } from "../../../fixtures.ts";
import { diademOfDreamstate } from "../../../../../../cards/src/cards/equipment/diadem-of-dreamstate.ts";

function dealArcaneAndWalk(
  game: ReturnType<typeof FabTestEngine.start>,
  payOptional: boolean,
): void {
  const Bravo = game.as(bravo);
  Bravo.play(volticBoltRed, { target: game.as(dash).id });
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (!decision) {
      if (game.getState().rulesStack.length === 0 && !game.combat()) return;
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      return;
    }
    if (decision.kind === "boolean") {
      // Ward auto-path may not open a boolean (auto-apply). Optional pay does.
      // Accept first if payOptional and actor is the diadem controller.
      const actorIsDash = decision.actorId === game.as(dash).id;
      const value = actorIsDash ? payOptional : true;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value },
        },
      });
      continue;
    }
    if (decision.kind === "entity-target") {
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
    if (decision.kind === "ordering") {
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
    break;
  }
}

describe("diadem-of-dreamstate (DTD217)", () => {
  it("core mechanic: ward destroy → pay {r} → create Ponder", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [volticBoltRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        head: [diademOfDreamstate],
        // RP to pay the optional {r}.
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    dealArcaneAndWalk(game, true);

    // Diadem destroyed by Ward 2 vs arcane.
    expect(Dash.zone("head")).not.toContain(diademOfDreamstate.canonicalId);
    expect(Dash.zone("graveyard")).toContain(diademOfDreamstate.canonicalId);
    // Paid {r}.
    expect(Dash.resourcePoints()).toBe(0);
    // Ponder token under controller.
    expect(Dash.zone("arena").some((id) => /ponder/i.test(id))).toBe(true);
  });

  it("boundaries: decline optional pay → no Ponder, RP kept", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [volticBoltRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        head: [diademOfDreamstate],
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    dealArcaneAndWalk(game, false);

    expect(Dash.zone("graveyard")).toContain(diademOfDreamstate.canonicalId);
    expect(Dash.resourcePoints()).toBe(1);
    expect(Dash.zone("arena").some((id) => /ponder/i.test(id))).toBe(false);
  });

  it("boundaries: combat damage also fires ward (any damage) + optional pay path", () => {
    // CR 8.3.20 Ward is not arcane-only — physical combat also destroys the
    // ward piece to prevent N. Decline the post-destroy optional pay.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        head: [diademOfDreamstate],
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    // Walk combat + decline optional pay-for-Ponder boolean.
    for (let safety = 0; safety < 40; safety += 1) {
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
      if (decision) break;
      if (!game.combat() && game.getState().rulesStack.length === 0) break;
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      break;
    }

    // Ward 2 vs snatch 4 → destroy diadem, prevent 2 → life 18.
    expect(Dash.zone("head")).not.toContain(diademOfDreamstate.canonicalId);
    expect(Dash.zone("graveyard")).toContain(diademOfDreamstate.canonicalId);
    expect(Dash.life()).toBe(18);
    // Declined pay → no Ponder, RP kept.
    expect(Dash.resourcePoints()).toBe(1);
    expect(Dash.zone("arena").some((id) => /ponder/i.test(id))).toBe(false);
  });
});
