/** PEN139 Graven Gloves — start-phase Silver sacrifice and graveyard equip. */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { gravenGloves } from "../../../../../../cards/src/cards/equipment/graven-gloves.ts";
import { silver } from "../../../../../../cards/src/cards/tokens/silver.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    if (game.answerForcedDecision()) continue;
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: true },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const picks = decision.candidates.slice(0, decision.min ?? 1).map((c) => c.instanceId);
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: picks },
        },
      });
      continue;
    }
    if (decision) return;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const priority = game.getState().priority?.holderPlayerId;
    if (priority) {
      game.exec({ move: "pass", actorId: priority, payload: {} });
      continue;
    }
    return;
  }
}

describe("graven-gloves (PEN139)", () => {
  it("start phase destroys two real Silver permanents and equips Gloves from graveyard", () => {
    const s1 = fabToken("silver");
    const s2 = { ...fabToken("silver"), canonicalId: silver.canonicalId };
    const game = FabTestEngine.start(
      { hero: bravo, deck: 6 },
      { hero: dash, graveyard: [gravenGloves], arena: [s1, s2], deck: 6 },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    game.as(bravo).endTurn();
    drain(game);

    expect(Defender.zone("arms")).toContain(gravenGloves.canonicalId);
    expect(Defender.zone("graveyard")).not.toContain(gravenGloves.canonicalId);
    expect(
      Defender.zone("arena").filter((id) => /silver/i.test(id) || id === silver.canonicalId),
    ).toHaveLength(0);
  });

  it("boundary: startup equip from a non-graveyard zone puts a −1 defense counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: dash, arms: [gravenGloves], deck: 4 },
      { autoPassPriority: false },
    );
    const glovesId = game.as(dash).findCardInZone("arms", gravenGloves);
    const state = game.getState();
    const defense = buildFabRulesView(state).object({
      instanceId: glovesId,
      incarnation: state.objects[glovesId]!.incarnation,
    })?.current.numeric.defense;

    expect(game.objectState(glovesId)?.defenseCounterTotal).toBe(-1);
    expect(defense).toBe(1);
  });
});
