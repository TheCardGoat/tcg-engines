import { describe, expect, it } from "vitest";
import { spiritOfFire, woodlandSquirrels } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveCard,
  GrandArchiveExecutableAbility,
  GrandArchiveEffectTriggeredAbility,
} from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "../testing/test-engine.ts";
import { previewGrandArchiveTriggerAnnouncement } from "./trigger-announcement-preview.ts";
import type { GrandArchiveTriggerAnnouncement } from "../procedures/activation/trigger-announcement.ts";

function fixture(ability: GrandArchiveEffectTriggeredAbility, capturedX?: number) {
  if (woodlandSquirrels.layout.kind !== "single-faced") throw new Error("Expected single face");
  const abilities: GrandArchiveExecutableAbility[] = [ability];
  if (capturedX !== undefined)
    abilities.unshift({
      id: "preview-resolution-a1",
      kind: "card-resolution",
      text: "Choose X.",
      variables: [{ kind: "chosen", symbol: "X", minimum: 0, maximum: 5 }],
      effect: { kind: "no-op" },
    });
  const ally: GrandArchiveCard<GrandArchiveExecutableAbility> = {
    ...woodlandSquirrels,
    canonicalId: "preview-trigger-ally",
    slug: "preview-trigger-ally",
    layout: {
      kind: "single-faced",
      face: {
        ...woodlandSquirrels.layout.face,
        id: "preview-trigger-ally:face:default",
        catalogId: "preview-trigger-ally",
        name: "Preview trigger fixture",
        abilities,
      },
    },
  };
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: { id: "p1", champion: spiritOfFire, zones: { hand: [ally] } },
    playerTwo: {
      id: "p2",
      champion: spiritOfFire,
      zones: { field: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
    },
  });
  const sourceId = game.player("p1").card(ally).objectId;
  game.player("p1").execute({
    move: "activate-card",
    cardId: sourceId,
    ...(capturedX === undefined ? {} : { variables: { X: capturedX } }),
  });
  for (let index = 0; index < 4 && !game.state.decision; index++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error("Expected Opportunity");
    game.player(wait.playerId).pass();
  }
  if (game.state.decision?.kind !== "announce-triggered-ability")
    throw new Error("Expected trigger announcement");
  return { game, sourceId, decision: game.state.decision };
}

const capturedAbility: GrandArchiveEffectTriggeredAbility = {
  id: "preview-trigger-a1",
  kind: "triggered",
  text: "On Enter: Choose one. Put X counters on this ally.",
  trigger: { kind: "event", event: { name: "object-entered-field", subject: { kind: "source" } } },
  modes: {
    declared: "stack-entry",
    choose: { kind: "exactly", amount: 1 },
    modes: [
      {
        id: "first",
        text: "First mode",
        effect: {
          kind: "add-counter",
          subject: { kind: "source" },
          counter: { named: "selected" },
          amount: { kind: "variable", symbol: "X" },
        },
      },
      { id: "second", text: "Second mode", effect: { kind: "no-op" } },
    ],
  },
  effect: { kind: "no-op" },
};

describe("trigger announcement variable ownership", () => {
  it.each([{ X: 99 }, { Y: 99 }])(
    "rejects an unchosen variable override %j atomically",
    (variables) => {
      const { game, decision } = fixture(capturedAbility, 2);
      expect(game.state.pendingTriggers[0]?.variables.X).toBe(2);
      const before = game.state;
      expect(
        game.player("p1").tryExecute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: { modeIds: ["first"], variables },
        }).ok,
      ).toBe(false);
      expect(game.state).toBe(before);
    },
  );

  it("allows a newly declared chosen X to replace an inherited value", () => {
    const { game, sourceId, decision } = fixture(
      { ...capturedAbility, variables: [{ kind: "chosen", symbol: "X", minimum: 1, maximum: 5 }] },
      2,
    );
    game.player("p1").execute({
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: { modeIds: ["first"], variables: { X: 4 } },
    });
    for (let index = 0; index < 4 && game.state.stack.length; index++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error("Expected Opportunity");
      game.player(wait.playerId).pass();
    }
    expect(game.state.objects[sourceId]?.counters["named:selected"]).toBe(4);
  });

  it("omits forged captured values from a preview command", () => {
    const { game, decision } = fixture(capturedAbility, 2);
    const result = previewGrandArchiveTriggerAnnouncement(game.program, game.state, {
      playerId: game.player("p1").id,
      decisionId: decision.id,
      expectedStateVersion: game.state.stateVersion,
      draft: { modeIds: ["first"], variables: { X: 99, Y: 99 } },
    });
    expect(result.ignoredInputIds).toEqual(["variable:X", "variable:Y"]);
    if (result.status !== "ready") throw new Error(JSON.stringify(result));
    expect(result.command.answer.variables).toEqual({});
    game.player("p1").execute(result.command);
    expect(game.state.stack.at(-1)?.variables.X).toBe(2);
  });

  it.each([false, true])("retains captured X through resolution (echo=%s)", (echo) => {
    const { game, sourceId, decision } = fixture(capturedAbility, 2);
    game.player("p1").execute({
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: { modeIds: ["first"], ...(echo ? { variables: { X: 2 } } : {}) },
    });
    for (let index = 0; index < 4 && game.state.stack.length; index++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error("Expected Opportunity");
      game.player(wait.playerId).pass();
    }
    expect(game.state.objects[sourceId]?.counters["named:selected"]).toBe(2);
  });
});

function dependentAbility(
  options: { repeated?: boolean; random?: boolean; repeatSecond?: boolean } = {},
): GrandArchiveEffectTriggeredAbility {
  return {
    id: "dependent-trigger-a1",
    kind: "triggered",
    text: "Choose X, a mode, and its targets.",
    trigger: {
      kind: "event",
      event: { name: "object-entered-field", subject: { kind: "source" } },
    },
    variables: [{ kind: "chosen", symbol: "X", minimum: 1, maximum: 35 }],
    modes: {
      declared: "stack-entry",
      choose: { kind: "exactly", amount: 1 },
      modes: [
        {
          id: "dependent",
          text: "Choose X allies, then one of those allies.",
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
              count: { kind: "exactly", amount: { kind: "variable", symbol: "X" } },
              ...(options.repeated ? { allowRepeated: true } : {}),
              ...(options.random ? { method: "random" } : {}),
              candidates: {
                kind: "object",
                zones: ["field"],
                player: "each-opponent",
                filter: { kind: "type", oneOf: ["ALLY"] },
              },
            },
            {
              id: "second",
              ...(options.repeatSecond !== false ? { allowRepeated: true as const } : {}),
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
            counter: { named: "selected" },
            amount: { kind: "variable", symbol: "Y" },
          },
        },
        {
          id: "alternate",
          text: "Choose your champion.",
          targets: [
            {
              id: "alternate",
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
}

function previewFixture(
  options: { repeated?: boolean; random?: boolean; repeatSecond?: boolean } = {},
) {
  const result = fixture(dependentAbility(options));
  const { game, decision } = result;
  const preview = (draft: GrandArchiveTriggerAnnouncement) =>
    previewGrandArchiveTriggerAnnouncement(game.program, game.state, {
      playerId: game.player("p1").id,
      decisionId: decision.id,
      expectedStateVersion: game.state.stateVersion,
      draft,
    });
  const ids = game
    .player("p2")
    .cards(woodlandSquirrels, { zone: "field" })
    .map((card) => card.objectId);
  return { ...result, preview, ids };
}

describe("dependent trigger declaration preview", () => {
  it("rejects target reuse across declarations unless the ability expressly allows it", () => {
    const { game, decision, preview, ids } = previewFixture({ repeatSecond: false });
    const answer = {
      variables: { X: 2, Y: 3 },
      modeIds: ["dependent"],
      targets: { first: ids.slice(1), second: [ids[2]!] },
    };
    const before = structuredClone(game.state);
    expect(preview(answer).status).toBe("invalid");
    expect(
      game.player("p1").tryExecute({
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer,
      }),
    ).toMatchObject({ ok: false, message: "A target identity cannot be selected twice" });
    expect(game.state).toEqual(before);
  });
  it("walks number, mode, dependent number and bound targets without mutating the match", () => {
    const { game, preview, ids } = previewFixture();
    const before = structuredClone(game.state);
    expect(preview({})).toMatchObject({
      status: "incomplete",
      steps: [{ id: "variable:X", kind: "number", minimum: 1, maximum: 35, status: "missing" }],
    });
    expect(preview({ variables: { X: 2 } }).steps.at(-1)).toMatchObject({
      id: "modes",
      status: "missing",
      minimum: 1,
      maximum: 1,
    });
    expect(preview({ variables: { X: 2 }, modeIds: ["dependent"] }).steps.at(-1)).toMatchObject({
      id: "variable:Y",
      minimum: 2,
      maximum: 4,
      status: "missing",
    });
    const numbers = { variables: { X: 2, Y: 3 }, modeIds: ["dependent"] };
    expect(preview(numbers).steps.at(-1)).toMatchObject({
      id: "target:first",
      minimum: 2,
      maximum: 2,
      candidateIds: ids,
    });
    expect(preview({ ...numbers, targets: { first: ids.slice(0, 2) } }).steps.at(-1)).toMatchObject(
      { id: "target:second", candidateIds: ids.slice(0, 2), minimum: 1, maximum: 1 },
    );
    const invalid = preview({ ...numbers, targets: { first: ids.slice(0, 2), second: [ids[2]!] } });
    expect(invalid.status).toBe("invalid");
    expect(invalid.steps.at(-1)).toMatchObject({ id: "target:second", status: "invalid" });
    const ready = preview({ ...numbers, targets: { first: ids.slice(0, 2), second: [ids[1]!] } });
    expect(game.state).toEqual(before);
    if (ready.status !== "ready") throw new Error(JSON.stringify(ready));
    game.player("p1").execute(ready.command);
    for (let index = 0; index < 4 && game.state.stack.length; index++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error("Expected Opportunity");
      game.player(wait.playerId).pass();
    }
    expect(game.state.objects[ids[1]!]!.counters["named:selected"]).toBe(3);
  });

  it("recomputes dependent counts and rejects a stale target selection when X changes", () => {
    const { preview, ids } = previewFixture();
    const draft = {
      variables: { X: 3, Y: 3 },
      modeIds: ["dependent"],
      targets: { first: ids.slice(0, 2), second: [ids[0]!] },
    };
    const result = preview(draft);
    expect(result.status).toBe("invalid");
    expect(result.steps.at(-1)).toMatchObject({
      id: "target:first",
      minimum: 3,
      maximum: 3,
      status: "invalid",
    });
    expect(preview({ ...draft, targets: { ...draft.targets, first: ids } }).status).toBe("ready");
  });

  it("drops obsolete mode-specific declarations explicitly when the mode changes", () => {
    const { game, preview, ids } = previewFixture();
    const championId = game.player("p1").card(spiritOfFire).objectId;
    const result = preview({
      variables: { X: 2, Y: 3 },
      modeIds: ["alternate"],
      targets: { first: ids.slice(0, 2), second: [ids[0]!], alternate: [championId] },
    });
    expect(result.ignoredInputIds).toEqual(
      expect.arrayContaining(["variable:Y", "target:first", "target:second"]),
    );
    if (result.status !== "ready") throw new Error(JSON.stringify(result));
    expect(result.command.answer).toEqual({
      variables: { X: 2 },
      modeIds: ["alternate"],
      targets: { alternate: [championId] },
    });
    game.player("p1").execute(result.command);
  });

  it("supports repeated targets without clipping their count to distinct candidates", () => {
    const { game, preview, ids } = previewFixture({ repeated: true });
    const draft = { variables: { X: 35, Y: 35 }, modeIds: ["dependent"] };
    expect(preview(draft).steps.at(-1)).toMatchObject({
      id: "target:first",
      minimum: 35,
      maximum: 35,
      allowRepeated: true,
    });
    const result = preview({
      ...draft,
      targets: {
        first: Array.from({ length: 35 }, (_, index) => ids[index % ids.length]!),
        second: [ids[2]!],
      },
    });
    if (result.status !== "ready") throw new Error(JSON.stringify(result));
    game.player("p1").execute(result.command);
  });

  it("never samples or reveals a random target during preview", () => {
    const { game, preview } = previewFixture({ random: true });
    const before = structuredClone(game.state);
    const result = preview({ variables: { X: 2, Y: 2 }, modeIds: ["dependent"] });
    expect(result).toMatchObject({
      status: "unavailable",
      message: "Random targets cannot be previewed",
    });
    expect(result.steps.some((step) => step.kind === "targets")).toBe(false);
    expect(game.state).toEqual(before);
  });

  it("rejects stale, wrong-player and wrong-decision requests before describing choices", () => {
    const { game, decision } = previewFixture();
    const request = {
      playerId: game.player("p1").id,
      decisionId: decision.id,
      expectedStateVersion: game.state.stateVersion,
      draft: {},
    };
    for (const override of [
      { playerId: game.player("p2").id },
      { decisionId: "forged" },
      { expectedStateVersion: request.expectedStateVersion - 1 },
    ]) {
      expect(
        previewGrandArchiveTriggerAnnouncement(game.program, game.state, {
          ...request,
          ...override,
        }),
      ).toMatchObject({ status: "unavailable", steps: [] });
    }
  });
});
