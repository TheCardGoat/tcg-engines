import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { backHeelKickRed } from "../../../../../../cards/src/cards/actions/back-heel-kick.ts";
import { breezeRiderBoots } from "../../../../../../cards/src/cards/equipment/breeze-rider-boots.ts";

function resolveCombatWithOptional(
  game: ReturnType<typeof FabTestEngine.start>,
  accept: boolean,
): void {
  let answered = false;
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean" && !answered) {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      answered = true;
      continue;
    }
    if (decision) throw new Error(`unexpected decision kind: ${decision.kind}`);
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    if (game.declareNoDefenseIfPending()) continue;
    const priority = game.getPriorityPlayerId();
    if (!priority) return;
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
  throw new Error("combat resolution exceeded safety limit");
}

describe("breeze-rider-boots (CRU053)", () => {
  it("AAA: a Ninja combo hit may destroy the boots and refund go again", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [breezeRiderBoots], hand: [backHeelKickRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(backHeelKickRed);
    resolveCombatWithOptional(game, true);

    expect(Bravo.zone("legs")).not.toContain(breezeRiderBoots.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(breezeRiderBoots.canonicalId);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundary: declining the hit trigger keeps the boots and spends the action", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [breezeRiderBoots], hand: [backHeelKickRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(backHeelKickRed);
    resolveCombatWithOptional(game, false);

    expect(Bravo.zone("legs")).toContain(breezeRiderBoots.canonicalId);
    expect(Bravo.actionPoints()).toBe(0);
  });
});
