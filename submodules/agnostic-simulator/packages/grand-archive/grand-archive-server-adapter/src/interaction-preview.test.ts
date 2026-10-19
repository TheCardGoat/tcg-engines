import { describe, expect, it } from "vitest";
import {
  INTERACTION_PROTOCOL_VERSION,
  InteractionPreviewResult,
  buildInteractionSubmission,
  type InteractionPreviewRequest,
  type InteractionSubmissionValue,
} from "@tcg/protocol";
import { spiritOfFire, woodlandSquirrels } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveCard,
  GrandArchiveExecutableAbility,
  GrandArchiveEffectTriggeredAbility,
} from "@tcg/grand-archive-types";
import {
  GrandArchiveMatchRuntime,
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveServerEngine } from "./server-engine.ts";
import { grandArchivePreviewView } from "./interaction-preview.ts";

function fixture(options: { privateTargets?: boolean; random?: boolean } = {}) {
  const ability: GrandArchiveEffectTriggeredAbility = {
    id: "preview-trigger-a1",
    kind: "triggered",
    text: "On Enter: Choose a number, a mode and targets.",
    trigger: {
      kind: "event",
      event: { name: "object-entered-field", subject: { kind: "source" } },
    },
    variables: [{ kind: "chosen", symbol: "X", minimum: 30, maximum: 40 }],
    modes: {
      declared: "stack-entry",
      choose: { kind: "exactly", amount: 1 },
      modes: [
        {
          id: "dependent",
          text: "Choose allies, then target one of those allies again.",
          variables: [
            {
              kind: "chosen",
              symbol: "Y",
              minimum: { kind: "variable", symbol: "X" },
              maximum: {
                kind: "calculate",
                operator: "add",
                operands: [{ kind: "variable", symbol: "X" }, 2],
              },
            },
          ],
          targets: [
            {
              id: "first",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: {
                  kind: "calculate",
                  operator: "subtract",
                  operands: [{ kind: "variable", symbol: "X" }, 30],
                },
              },
              ...(options.random ? { method: "random" as const } : {}),
              candidates: {
                ...(options.privateTargets
                  ? { kind: "card", zones: ["hand"] }
                  : { kind: "object", zones: ["field"] }),
                player: "each-opponent",
                filter: { kind: "type", oneOf: ["ALLY"] },
              },
            },
            {
              id: "second",
              allowRepeated: true,
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: { kind: "exactly", amount: 1 },
              candidates: { kind: "object", binding: "first" },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: { kind: "bound", binding: "second" },
            counter: { named: "preview" },
            amount: { kind: "variable", symbol: "Y" },
          },
        },
        {
          id: "alternate",
          text: "Choose your champion.",
          targets: [
            {
              id: "champion",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: { kind: "exactly", amount: 1 },
              candidates: {
                kind: "object",
                zones: ["field"],
                player: "controller",
                filter: { kind: "type", oneOf: ["CHAMPION"] },
              },
            },
          ],
          effect: { kind: "no-op" },
        },
      ],
    },
    effect: { kind: "no-op" },
  };
  if (woodlandSquirrels.layout.kind !== "single-faced") throw new Error("Expected fixture face");
  const card: GrandArchiveCard<GrandArchiveExecutableAbility> = {
    ...woodlandSquirrels,
    canonicalId: "preview-fixture",
    slug: "preview-fixture",
    layout: {
      kind: "single-faced",
      face: {
        ...woodlandSquirrels.layout.face,
        id: "preview-fixture:face:default",
        catalogId: "preview-fixture",
        name: "Preview fixture",
        abilities: [ability],
      },
    },
  };
  const zone = options.privateTargets ? "hand" : "field";
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: { id: "p1", champion: spiritOfFire, zones: { hand: [card] } },
    playerTwo: {
      id: "p2",
      champion: spiritOfFire,
      zones: { [zone]: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
    },
  });
  game
    .player("p1")
    .execute({ move: "activate-card", cardId: game.player("p1").card(card).objectId });
  for (let index = 0; index < 4 && !game.state.decision; index++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error("Expected Opportunity");
    game.player(wait.playerId).pass();
  }
  if (game.state.decision?.kind !== "announce-triggered-ability")
    throw new Error("Expected trigger decision");
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
  const request: InteractionPreviewRequest = {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    stateVersion: server.getStateID(),
    actionId: `grand-archive:decision:${game.state.decision.id}`,
    values: {},
  };
  const preview = (values: Record<string, InteractionSubmissionValue>) => {
    const result = server.previewInteraction("p1", { ...request, values });
    expect(InteractionPreviewResult.safeParse(result).success).toBe(true);
    return result;
  };
  const ids = game
    .player("p2")
    .cards(woodlandSquirrels, { zone })
    .map((card) => card.objectId);
  const values = {
    "variable:X": 32,
    modes: ["dependent"],
    "variable:Y": 33,
    "target:first": ids.slice(1),
    "target:second": [ids[2]!],
  };
  const submit = (values: Record<string, InteractionSubmissionValue>) => {
    const result = preview(values);
    if (result.status !== "ready") throw new Error(JSON.stringify(result));
    return buildInteractionSubmission({
      view: grandArchivePreviewView("p1", result),
      action: result.action,
      values: result.values,
      correlationId: "preview-commit",
    });
  };
  return { game, server, request, preview, ids, values, submit };
}
const context = { gameId: "trigger-preview", sourceAuthority: "server" as const };

describe("server interaction draft preview", () => {
  it("returns a valid editable prefix when an earlier number requires too many targets", () => {
    const { preview, values } = fixture();
    const result = preview({ ...values, "variable:X": 40, "variable:Y": 40 });
    expect(result.status).toBe("invalid");
    if (result.status === "unavailable") throw new Error(result.message);
    expect(result.action.inputs.map((input) => input.id)).toEqual([
      "variable:X",
      "modes",
      "variable:Y",
    ]);
    expect(result.values).not.toHaveProperty("target:first");
    expect(result.message).toContain("too few legal candidates");
  });
  it("projects dependent forms after JSON restoration and commits a number above the bot cap", () => {
    const { server, preview, ids, values, submit } = fixture();
    const before = structuredClone(server.getState());
    const replayBefore = structuredClone(server.exportReplay());
    const number = preview({});
    expect(server.getInteractionView("p1").actions).toContainEqual(
      expect.objectContaining({
        id: number.status === "unavailable" ? "missing" : number.action.id,
        requiresPreview: true,
      }),
    );
    expect(number.status).toBe("incomplete");
    if (number.status === "unavailable") throw new Error(number.message);
    expect(number.action.inputs).toMatchObject([
      { id: "variable:X", kind: "number", min: 30, max: 40 },
    ]);
    const modes = preview({ "variable:X": 32 });
    if (modes.status === "unavailable") throw new Error(modes.message);
    expect(modes.action.inputs.at(-1)).toMatchObject({ id: "modes", kind: "option-selection" });
    const dependentNumber = preview({ "variable:X": 32, modes: ["dependent"] });
    if (dependentNumber.status === "unavailable") throw new Error(dependentNumber.message);
    expect(dependentNumber.action.inputs.at(-1)).toMatchObject({
      id: "variable:Y",
      min: 32,
      max: 34,
    });
    const dependentTarget = preview({ ...values, "target:second": [] });
    expect(dependentTarget.status).toBe("invalid");
    if (dependentTarget.status === "unavailable") throw new Error(dependentTarget.message);
    expect(dependentTarget.action.inputs.at(-1)).toMatchObject({
      id: "target:second",
      candidates: ids.slice(1).map((id) => ({ entity: { instanceId: id } })),
    });
    const submission = submit(values);
    expect(server.getState()).toEqual(before);
    expect(server.exportReplay()).toEqual(replayBefore);
    expect(server.submitInteraction("p1", submission, context).success).toBe(true);
    const stack = server.runtime.state.stack.at(-1);
    expect(stack?.variables.Y).toBe(33);
    expect(stack?.targets.find((target) => target.binding === "second")?.targetIds).toEqual([
      ids[2],
    ]);
    for (let index = 0; index < 4 && server.runtime.state.stack.length; index++) {
      const playerId = server.getActivePlayerId();
      if (!playerId) throw new Error("Expected active player");
      const view = server.getInteractionView(playerId);
      const pass = view.actions.find((action) => action.intent === "pass");
      if (!pass) throw new Error("Expected pass");
      expect(
        server.submitInteraction(
          playerId,
          buildInteractionSubmission({ view, action: pass }),
          context,
        ).success,
      ).toBe(true);
    }
    expect(server.runtime.state.objects[ids[2]!]!.counters["named:preview"]).toBe(33);
    expect(server.submitInteraction("p1", submission, context)).toMatchObject({
      success: false,
      errorCode: "duplicate_interaction",
    });
  });

  it("revalidates forged, stale, incomplete and changed submissions without mutation", () => {
    const { server, values, submit, ids } = fixture();
    const submission = submit(values);
    const before = structuredClone(server.getState());
    for (const invalid of [
      { ...submission, stateVersion: submission.stateVersion - 1 },
      { ...submission, requestId: `${submission.requestId}-forged` },
      { ...submission, values: { ...values, "variable:X": 33 } },
      { ...submission, values: { ...values, "variable:Y": 99 } },
      { ...submission, values: { ...values, "target:second": [ids[0]!] } },
      { ...submission, values: { ...values, "target:first": [ids[1]!, ids[1]!] } },
      { ...submission, values: { "variable:X": 32 } },
      { ...submission, values: { ...values, invented: true } },
    ]) {
      expect(server.submitInteraction("p1", invalid, context).success).toBe(false);
      expect(server.getState()).toEqual(before);
    }
    expect(server.submitInteraction("p2", submission, context).success).toBe(false);
    expect(server.getState()).toEqual(before);
  });

  it("normalizes obsolete mode inputs and rejects them if sent without normalization", () => {
    const { game, server, preview, values } = fixture();
    const changed = {
      ...values,
      modes: ["alternate"],
      "target:champion": [game.player("p1").card(spiritOfFire).objectId],
    };
    const result = preview(changed);
    if (result.status !== "ready") throw new Error(JSON.stringify(result));
    expect(result.ignoredInputIds).toEqual(
      expect.arrayContaining(["variable:Y", "target:first", "target:second"]),
    );
    expect(result.values).toEqual({
      "variable:X": 32,
      modes: ["alternate"],
      "target:champion": changed["target:champion"],
    });
    const view = grandArchivePreviewView("p1", result);
    expect(
      server.submitInteraction(
        "p1",
        buildInteractionSubmission({ view, action: result.action, values: changed }),
        context,
      ).success,
    ).toBe(false);
    expect(
      server.submitInteraction(
        "p1",
        buildInteractionSubmission({ view, action: result.action, values: result.values }),
        context,
      ).success,
    ).toBe(true);
  });

  it("rejects other players, unknown decisions and old versions without returning form data", () => {
    const { server, request } = fixture();
    for (const [actor, candidate] of [
      ["p2", request],
      ["spectator", request],
      ["p1", { ...request, stateVersion: request.stateVersion - 1 }],
      ["p1", { ...request, actionId: "forged" }],
    ] as const) {
      const result = server.previewInteraction(actor, candidate);
      expect(result.status).toBe("unavailable");
      expect(Object.keys(result).sort()).toEqual(["message", "stateVersion", "status"]);
    }
  });

  it("does not disclose identities from an opponent's private zone", () => {
    const { server, preview, ids, values } = fixture({ privateTargets: true });
    const before = structuredClone(server.getState());
    const result = preview({
      "variable:X": values["variable:X"],
      "variable:Y": values["variable:Y"],
      modes: values.modes,
    });
    expect(result.status).toBe("unavailable");
    const wire = JSON.stringify(result);
    for (const id of ids) expect(wire).not.toContain(id);
    expect(wire).not.toContain(woodlandSquirrels.canonicalId);
    expect(server.getState()).toEqual(before);
  });

  it("does not preview random outcomes or advance the RNG", () => {
    const { server, preview } = fixture({ random: true });
    const before = structuredClone(server.getState());
    const result = preview({ "variable:X": 32, "variable:Y": 33, modes: ["dependent"] });
    expect(result).toMatchObject({
      status: "unavailable",
      message: "Random targets cannot be previewed",
    });
    expect(server.getState()).toEqual(before);
  });
});
