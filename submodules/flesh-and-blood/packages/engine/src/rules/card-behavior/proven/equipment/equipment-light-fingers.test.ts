/**
 * SEA184 Light Fingers — Generic Arms d1 Blade Break.
 *
 * Printed: When this defends, if you are a Thief, steal a Gold token the
 * attacking hero controls. Blade Break.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { gold } from "../../../../../../cards/src/cards/tokens/gold.ts";
import { lightFingers } from "../../../../../../cards/src/cards/equipment/light-fingers.ts";
import { scurvStowaway } from "../../../../../../cards/src/cards/heroes/scurv-stowaway.ts";

function resolveTargetAndCombat(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 32; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const target = decision.candidates[0];
      if (!target) throw new Error("Light Fingers should have a Gold target");
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [target.instanceId] },
        },
      });
      continue;
    }
    if (decision && game.answerForcedDecision()) continue;
    if (decision) throw new Error(`Unhandled ${decision.kind} decision`);
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const priorityPlayerId = game.getState().priority?.holderPlayerId;
    if (!priorityPlayerId) return;
    game.exec({ move: "pass", actorId: priorityPlayerId, payload: {} });
  }
  throw new Error("Light Fingers resolution did not settle");
}

describe("light-fingers (SEA184)", () => {
  it("AAA: a Thief defending steals the attacking hero's real Gold token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], arena: [gold], actionPoints: 1, deck: 6 },
      { hero: scurvStowaway, arms: [lightFingers], deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    const Scurv = game.as(scurvStowaway);

    Dash.attackWith(snatchRed);
    Scurv.defendWith(lightFingers);
    resolveTargetAndCombat(game);

    expect(Dash.zone("arena")).not.toContain(gold.canonicalId);
    expect(Scurv.zone("arena")).toContain(gold.canonicalId);
    expect(Scurv.zone("graveyard")).toContain(lightFingers.canonicalId);
  });

  it("boundary: a non-Thief defender does not steal the attacking hero's Gold", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], arena: [gold], actionPoints: 1, deck: 6 },
      { hero: bravo, arms: [lightFingers], deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    Bravo.defendWith(lightFingers);
    resolveTargetAndCombat(game);

    expect(Dash.zone("arena")).toContain(gold.canonicalId);
    expect(Bravo.zone("arena")).not.toContain(gold.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(lightFingers.canonicalId);
  });
});
