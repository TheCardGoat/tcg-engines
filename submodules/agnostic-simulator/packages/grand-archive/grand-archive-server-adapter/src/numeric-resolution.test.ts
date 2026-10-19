import { describe, expect, it } from "vitest";
import { buildInteractionSubmission } from "@tcg/protocol";
import { spiritOfFire } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import {
  GrandArchiveMatchRuntime,
  listGrandArchiveDecisionAnswerCandidates,
  projectGrandArchiveViewerState,
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveServerEngine } from "./server-engine.ts";

function setup(minimum: number, maximum?: number) {
  if (spiritOfFire.layout.kind !== "single-faced") throw new Error("Expected fixture face");
  const champion: GrandArchiveCard<GrandArchiveAbilityDefinition> = {
    ...spiritOfFire,
    canonicalId: "number-choice-champion",
    slug: "number-choice-champion",
    layout: {
      kind: "single-faced",
      face: {
        ...spiritOfFire.layout.face,
        id: "number-choice-champion:face:default",
        catalogId: "number-choice-champion",
        name: "Number choice fixture",
        abilities: [
          {
            id: "number-choice-a1",
            kind: "activated",
            activation: "ability",
            cost: { kind: "pay-reserve", amount: 0 },
            text: "Choose a number.",
            effect: {
              kind: "choose",
              selection: {
                id: "chosen-number",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: { kind: "exactly", amount: 1 },
                candidates: {
                  kind: "number",
                  minimum,
                  ...(maximum === undefined ? {} : { maximum }),
                },
              },
              effect: {
                kind: "add-counter",
                subject: { kind: "source" },
                counter: { named: "chosen" },
                amount: { kind: "binding", binding: "chosen-number" },
              },
            },
          },
        ],
      },
    },
  };
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: { id: "p1", champion },
    playerTwo: { id: "p2", champion: spiritOfFire },
  });
  const sourceId = game.player("p1").card(champion).objectId;
  game.player("p1").execute({ move: "activate-ability", sourceId, abilityId: "number-choice-a1" });
  for (let index = 0; index < 4 && !game.state.decision; index++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error("Expected opportunity");
    game.player(wait.playerId).pass();
  }
  if (game.state.decision?.kind !== "resolve-effect-choice")
    throw new Error("Expected number decision");
  return { game, sourceId, decision: game.state.decision };
}

function serverView(game: GrandArchiveTestEngine) {
  const server = new GrandArchiveServerEngine(
    game.program,
    new GrandArchiveMatchRuntime(
      game.program,
      restoreGrandArchiveMatchSnapshot(
        game.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(game.state))),
      ),
    ),
  );
  const view = server.getInteractionView("p1");
  const action = view.actions.find((action) =>
    action.inputs.some((input) => input.kind === "number"),
  );
  if (!action) throw new Error("Expected number input even when no bot answer is available");
  const input = action.inputs.find((input) => input.kind === "number");
  if (input?.kind !== "number") throw new Error("Expected number input");
  return { server, view, action, input };
}
const context = { gameId: "numeric-resolution", sourceAuthority: "server" as const };

describe("native numeric resolution choices", () => {
  it.each([
    { minimum: 0, maximum: undefined, chosen: 21 },
    { minimum: 30, maximum: 40, chosen: 37 },
  ])(
    "submits $chosen with native bounds beyond the bot ceiling",
    ({ minimum, maximum, chosen }) => {
      const { game, sourceId, decision } = setup(minimum, maximum);
      expect(
        listGrandArchiveDecisionAnswerCandidates(game.program, game.state, decision).some(
          (candidate) => candidate.answer === chosen,
        ),
      ).toBe(false);
      const control = GrandArchiveTestEngine.fromState(game.program, game.state);
      expect(
        control.player("p1").tryExecute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: chosen,
        }),
      ).toMatchObject({ ok: true });
      const { server, view, action, input } = serverView(game);
      expect(input.min).toBe(minimum);
      expect(input.max).toBe(maximum);
      expect(input.required).toBe(true);
      expect(
        server.submitInteraction(
          "p1",
          buildInteractionSubmission({ view, action, values: { [input.id]: chosen } }),
          context,
        ).success,
      ).toBe(true);
      expect(server.runtime.state.objects[sourceId]?.counters["named:chosen"]).toBe(chosen);
      expect(server.runtime.state.decision).toBeNull();
    },
  );

  it("rejects non-integers and out-of-range values atomically", () => {
    const { game } = setup(30, 40);
    const { server, view, action, input } = serverView(game);
    const valid = buildInteractionSubmission({ view, action, values: { [input.id]: 35 } });
    const before = server.runtime.state;
    expect(server.submitInteraction("p1", { ...valid, values: {} }, context).success).toBe(false);
    expect(server.runtime.state).toBe(before);
    for (const value of [29, 41, 35.5, Number.MAX_SAFE_INTEGER + 1, "35"]) {
      expect(
        server.submitInteraction("p1", { ...valid, values: { [input.id]: value } }, context)
          .success,
      ).toBe(false);
      expect(server.runtime.state).toBe(before);
    }
  });

  it("enforces an explicit maximum of zero through native validation and the adapter", () => {
    const { game, decision } = setup(0, 0);
    expect(
      listGrandArchiveDecisionAnswerCandidates(game.program, game.state, decision).map(
        (candidate) => candidate.answer,
      ),
    ).toEqual([0]);
    expect(
      game.player("p1").tryExecute({
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: 1,
      }).ok,
    ).toBe(false);
    const { server, view, action, input } = serverView(game);
    expect(input).toMatchObject({ min: 0, max: 0, required: true });
    expect(
      projectGrandArchiveViewerState(game.program, game.state, game.player("p1").id).stackResolution
        ?.decision?.optionality,
    ).toBe("required");
    expect(
      server.submitInteraction(
        "p1",
        buildInteractionSubmission({ view, action, values: { [input.id]: 0 } }),
        context,
      ).success,
    ).toBe(true);
  });
});
