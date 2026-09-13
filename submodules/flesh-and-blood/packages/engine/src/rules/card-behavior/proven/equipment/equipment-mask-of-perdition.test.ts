import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { infectRed } from "../../../../../../cards/src/cards/actions/infect.ts";
import { maskOfPerdition } from "../../../../../../cards/src/cards/equipment/mask-of-perdition.ts";
import { silver } from "../../../../../../cards/src/cards/tokens/silver.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>, accept = true): void {
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
          answer: { kind: "boolean", value: accept },
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
          answer: { kind: "ordering", orderedIds: decision.entries.map((entry) => entry.id) },
        },
      });
      continue;
    }
    if (decision) return;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const priority = game.getState().priority?.holderPlayerId;
    if (!priority) return;
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
}

function toReaction(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 16 && game.combat()?.step !== "reaction"; safety += 1) {
    if (game.declareNoDefenseIfPending()) continue;
    const priority = game.getPriorityPlayerId();
    if (!priority) return;
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
}

describe("mask-of-perdition (DYN118)", () => {
  it("at start of turn destroys two Silver to equip itself from the graveyard", () => {
    const s1 = fabToken("silver");
    const s2 = { ...fabToken("silver"), canonicalId: silver.canonicalId };
    const game = FabTestEngine.start(
      { hero: bravo, deck: 6 },
      { hero: dash, graveyard: [maskOfPerdition], arena: [s1, s2], deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);

    game.as(bravo).endTurn();
    drain(game);

    expect(Dash.zone("head")).toContain(maskOfPerdition.canonicalId);
    expect(Dash.zone("graveyard")).not.toContain(maskOfPerdition.canonicalId);
    expect(
      Dash.zone("arena").filter((id) => /silver/i.test(id) || id === silver.canonicalId),
    ).toHaveLength(0);
  });

  it("Attack Reaction destroys itself and grants an Assassin attack hit banish", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [maskOfPerdition], hand: [infectRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed] },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(infectRed);
    toReaction(game);
    expect(game.combat()?.step).toBe("reaction");
    Bravo.activate(maskOfPerdition);
    drain(game);

    expect(Bravo.zone("head")).not.toContain(maskOfPerdition.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(maskOfPerdition.canonicalId);
    drain(game);
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("banished")).toContain(snatchRed.canonicalId);
  });

  it("cannot re-equip with fewer than two Silver", () => {
    const game = FabTestEngine.start(
      { hero: bravo, deck: 6 },
      { hero: dash, graveyard: [maskOfPerdition], arena: [fabToken("silver")], deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).endTurn();
    drain(game);
    expect(game.as(dash).zone("graveyard")).toContain(maskOfPerdition.canonicalId);
    expect(game.as(dash).zone("head")).not.toContain(maskOfPerdition.canonicalId);
  });
});
