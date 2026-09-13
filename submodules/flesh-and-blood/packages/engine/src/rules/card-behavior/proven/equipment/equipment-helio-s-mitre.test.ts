/**
 * UPR183 Helio's Mitre — Generic Head d0 (limited-format card pool note).
 *
 * Printed:
 *   Instant - {r}{r}: Prevent the next 1 damage that would be dealt to your
 *   hero this turn by a source of your choice. Destroy Helio's Mitre at the
 *   beginning of the end phase.
 *
 * Reasoning (hand-authored):
 * 1. Instant 2{r} arms fixed prevention 1 on controller hero this-turn.
 * 2. "Source of your choice" — model arms generic next-damage prevention
 *    (source-specific choice is a refinement; any source still matches the
 *    printed protective outcome in 1v1).
 * 3. delay:end-phase destroy rewritten in proposal to delayed-trigger
 *    end-phase destroy (was unsupported leaf).
 * 4. 0 RP illegal; second activate after destroy illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { helioSMitre } from "../../../../../../cards/src/cards/equipment/helio-s-mitre.ts";

const SNATCH = 4;
const LIFE = 20;

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
      const pick =
        decision.candidates.find((candidate) => {
          const record = game.getState().objects[candidate.instanceId];
          return record?.canonicalId === snatchRed.canonicalId;
        }) ?? decision.candidates[0];
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("helio-s-mitre (UPR183)", () => {
  it("core mechanic: Instant 2{r} prevent 1 next damage; destroy at end phase", () => {
    // Arm during defend priority so this-turn prevention still covers the hit.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [helioSMitre],
        resourcePoints: 2,
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    // Instant while combat open.
    Defender.defendWith([]);
    game.as(bravo).pass();
    Defender.activate(helioSMitre);
    drain(game);
    // Mitre still equipped until end phase.
    expect(Defender.zone("head")).toContain(helioSMitre.canonicalId);
    expect(Defender.resourcePoints()).toBe(0);

    // No defend — snatch 4 − prevent 1 = 3.
    game.helpers.resolveRestOfCombat();
    drain(game);
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));

    // End phase destroys mitre via delayed-trigger.
    game.as(bravo).endTurn();
    drain(game);
    // After end turn, mitre should be in GY (end-phase destroy fired).
    // Active seat may have flipped; check dash zones.
    expect(Defender.zone("graveyard")).toContain(helioSMitre.canonicalId);
    expect(Defender.zone("head")).not.toContain(helioSMitre.canonicalId);
  });

  it("boundaries: low RP illegal; model prevention + end-phase destroy delay", () => {
    const poor = FabTestEngine.start(
      {
        hero: bravo,
        head: [helioSMitre],
        resourcePoints: 1,
        hand: [],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    const rejected = poor.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: poor.as(bravo).card(helioSMitre) },
    });
    expect(rejected.accepted).toBe(false);

    const a1 = helioSMitre.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect) return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({
      class: "asset",
      type: "resources",
      amount: 2,
    });
    expect(a1.effect).toMatchObject({
      type: "sequence",
      steps: [
        {
          type: "prevention",
          preventionKind: "shielding",
          amount: 1,
          shielded: { selector: "controller" },
          source: {
            selector: "object",
            declared: "on-stack",
            count: 1,
          },
          duration: "this-turn",
        },
        {
          type: "destroy",
          target: { selector: "self" },
          delay: "end-phase",
        },
      ],
    });
    expect(helioSMitre.base.numeric.defense).toBe(0);
  });
});
