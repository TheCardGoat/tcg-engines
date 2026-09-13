/**
 * AAA test for effect:optional.
 * Representative card: Vest of the First Fist (ARC152) — Generic Chest Equipment.
 * Static triggered ability: "When an attack action card you control hits, you
 * may destroy Vest of the First Fist. If you do, gain {r}{r}."
 *   → trigger: hit (action-attack by controller)
 *     → optional(effect: destroy self → then: gain-resources 2)
 *
 * Verifies both accepting and declining the optional prompt, and confirms the
 * `then` continuation fires exactly once (gain 2 resources, not 4 or 0).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, vestOfTheFirstFist } from "../../../fixtures.ts";

/**
 * Step through open combat, answering ordering and boolean decisions along the
 * way.  `acceptOptional` controls the value given to boolean (optional) prompts.
 */
function resolveCombatWithDecisions(game: FabTestEngine, acceptOptional: boolean): void {
  for (let safety = 0; safety < 48; safety += 1) {
    if (game.hasGameEnded()) return;
    if (!game.combat()?.open && game.getState().rulesStack.length === 0) return;
    const decision = game.getState().decision;
    if (decision) {
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
      if (decision.kind === "boolean") {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "boolean", value: acceptOptional },
          },
        });
        continue;
      }
      if (game.answerForcedDecision()) continue;
      throw new Error(
        `resolveCombatWithDecisions: unhandled ${decision.kind} decision ${decision.decisionId}.`,
      );
    }
    game.passBoth();
  }
}

describe("effect: optional", () => {
  it("AAA: accept optional destroy on hit → Vest moves to graveyard and controller gains 2 resources", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [vestOfTheFirstFist], hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const rpBefore = Bravo.resourcePoints();

    // Act — attack with Snatch Red (power 6, cost 0). Dash does not block → hit.
    Bravo.attackWith(snatchRed);
    resolveCombatWithDecisions(game, true);

    // Assert — Vest destroyed, exactly 2 resources gained (then fires once).
    expect(Bravo.zone("chest")).not.toContain(vestOfTheFirstFist.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(vestOfTheFirstFist.canonicalId);
    expect(Bravo.resourcePoints()).toBe(rpBefore + 2);
  });

  it("AAA boundary: declining the optional keeps the Vest and grants no resources", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [vestOfTheFirstFist], hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const rpBefore = Bravo.resourcePoints();

    Bravo.attackWith(snatchRed);
    resolveCombatWithDecisions(game, false);

    // Assert — Vest stays equipped, no resource change.
    expect(Bravo.zone("chest")).toContain(vestOfTheFirstFist.canonicalId);
    expect(Bravo.resourcePoints()).toBe(rpBefore);
  });
});
