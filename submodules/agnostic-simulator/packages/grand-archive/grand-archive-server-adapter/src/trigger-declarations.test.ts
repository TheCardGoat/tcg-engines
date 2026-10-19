import { describe, expect, it } from "vitest";
import { buildInteractionSubmission } from "@tcg/protocol";
import { spiritOfFire, woodlandSquirrels } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveCard,
  GrandArchiveTriggeredAbility,
  GrandArchiveModeEffect,
  GrandArchiveModeDeclaration,
} from "@tcg/grand-archive-types";
import {
  GrandArchiveMatchRuntime,
  listGrandArchiveDecisionAnswerCandidates,
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveServerEngine } from "./server-engine.ts";

function setup(
  kind: "number" | "targets" | "empty" | "modes" | "empty-modes",
  spell = false,
  extraField: readonly GrandArchiveCard<GrandArchiveAbilityDefinition>[] = [],
) {
  if (woodlandSquirrels.layout.kind !== "single-faced") throw new Error("Expected fixture face");
  const hasModes = kind === "modes" || kind === "empty-modes";
  const mode = (index: number): GrandArchiveModeEffect => ({
    id: `mode-${index}`,
    text: `Add counter ${index + 1}`,
    ...(kind === "empty-modes"
      ? {
          condition: {
            kind: "compare" as const,
            comparison: { left: 1, operator: "eq" as const, right: 0 },
          },
        }
      : {}),
    effect: {
      kind: "add-counter",
      subject: { kind: "source" },
      counter: { named: "selected" },
      amount: 1,
    },
  });
  const modes: GrandArchiveModeDeclaration = {
    declared: "stack-entry",
    choose: { kind: kind === "empty-modes" ? "up-to" : "exactly", amount: 8 },
    modes: [mode(0), mode(1), ...Array.from({ length: 14 }, (_, index) => mode(index + 2))],
  };
  const ability: GrandArchiveTriggeredAbility = {
    id: "trigger-declaration-a1",
    kind: "triggered",
    text: "On Enter: Choose a number or targets.",
    trigger: {
      kind: "event",
      event: { name: "object-entered-field", subject: { kind: "source" } },
    },
    ...(hasModes
      ? { modes }
      : kind === "number"
        ? {
            variables: [
              { kind: "chosen" as const, symbol: "X" as const, minimum: 30, maximum: 40 },
            ],
          }
        : {
            targets: [
              {
                id: "allies",
                kind: "target" as const,
                declared: "announcement" as const,
                chooser: "controller" as const,
                count: {
                  kind: kind === "empty" ? ("up-to" as const) : ("exactly" as const),
                  amount: 3,
                },
                unique: true as const,
                candidates: {
                  kind: "object" as const,
                  zones: ["field" as const],
                  player: "each-opponent" as const,
                  filter: { kind: "type" as const, oneOf: ["ALLY" as const] },
                },
              },
            ],
          }),
    effect: hasModes
      ? { kind: "no-op" }
      : {
          kind: "add-counter",
          subject: kind === "number" ? { kind: "source" } : { kind: "bound", binding: "allies" },
          counter: { named: "selected" },
          amount: kind === "number" ? { kind: "variable", symbol: "X" } : 1,
        },
  };
  const ally: GrandArchiveCard<GrandArchiveAbilityDefinition> = {
    ...woodlandSquirrels,
    canonicalId: "trigger-declaration-ally",
    slug: "trigger-declaration-ally",
    layout: {
      kind: "single-faced",
      face: {
        ...woodlandSquirrels.layout.face,
        id: "trigger-declaration-ally:face:default",
        catalogId: "trigger-declaration-ally",
        name: "Trigger declaration fixture",
        typeLine: {
          ...woodlandSquirrels.layout.face.typeLine,
          subtypes: [
            ...woodlandSquirrels.layout.face.typeLine.subtypes,
            ...(spell ? ["SPELL"] : []),
          ],
        },
        abilities: [ability],
      },
    },
  };
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: { id: "p1", champion: spiritOfFire, zones: { hand: [ally] } },
    playerTwo: {
      id: "p2",
      champion: spiritOfFire,
      zones: {
        field: [
          ...Array.from({ length: kind === "targets" ? 35 : 0 }, () => woodlandSquirrels),
          ...extraField,
        ],
      },
    },
  });
  const sourceId = game.player("p1").card(ally).objectId;
  game.player("p1").execute({ move: "activate-card", cardId: sourceId });
  for (let index = 0; index < 4 && !game.state.decision; index++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error("Expected opportunity before trigger");
    game.player(wait.playerId).pass();
  }
  if (game.state.decision?.kind !== "announce-triggered-ability")
    throw new Error("Expected trigger declaration");
  const chosen = game
    .player("p2")
    .cards(woodlandSquirrels, { zone: "field" })
    .slice(-3)
    .map((card) => card.objectId);
  const answer = hasModes
    ? { modeIds: Array.from({ length: 8 }, (_, index) => `mode-${index + 8}`) }
    : kind === "number"
      ? { variables: { X: 37 } }
      : { targets: { allies: chosen } };
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
  return { game, server, sourceId, chosen, answer, decision: game.state.decision };
}
const context = { gameId: "trigger-declarations", sourceAuthority: "server" as const };

describe("native triggered-ability declarations", () => {
  it("can confirm zero modes when every optional mode is unavailable", () => {
    const { server, decision } = setup("empty-modes");
    const view = server.getInteractionView("p1");
    const action = view.actions.find((action) => action.id.includes(decision.id));
    if (!action) throw new Error("Expected an announcement confirmation");
    expect(
      server.submitInteraction(
        "p1",
        buildInteractionSubmission({ view, action, values: {} }),
        context,
      ).success,
    ).toBe(true);
    expect(server.runtime.state.stack.at(-1)?.selectedModeIds).toEqual([]);
  });

  it("accepts a legal mode combination beyond the bot answer budget", () => {
    const { game, server, sourceId, answer, decision } = setup("modes");
    expect(
      listGrandArchiveDecisionAnswerCandidates(game.program, game.state, decision).some(
        (candidate) => JSON.stringify(candidate.answer) === JSON.stringify(answer),
      ),
    ).toBe(false);
    expect(
      GrandArchiveTestEngine.fromState(game.program, game.state).player("p1").tryExecute({
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer,
      }),
    ).toMatchObject({ ok: true });
    const view = server.getInteractionView("p1");
    const action = view.actions.find((action) =>
      action.inputs.some((input) => input.id === "modes" || input.id === "modeIds"),
    );
    if (!action || !answer.modeIds) throw new Error("Expected mode selection");
    const input = action.inputs.find((input) => input.id === "modes" || input.id === "modeIds");
    if (!input) throw new Error("Expected mode input");
    expect(input).toMatchObject({ kind: "option-selection", min: 8, max: 8 });
    const submission = buildInteractionSubmission({
      view,
      action,
      values: { [input.id]: answer.modeIds },
    });
    const before = server.runtime.state;
    for (const modes of [
      [],
      [...answer.modeIds.slice(0, 7), "forged"],
      [...answer.modeIds.slice(0, 7), answer.modeIds[0]!],
    ]) {
      expect(
        server.submitInteraction("p1", { ...submission, values: { [input.id]: modes } }, context)
          .success,
      ).toBe(false);
      expect(server.runtime.state).toBe(before);
    }
    expect(server.submitInteraction("p1", submission, context).success).toBe(true);
    expect(server.runtime.state.stack.at(-1)?.selectedModeIds).toEqual(answer.modeIds);
    for (let index = 0; index < 4 && server.runtime.state.stack.length; index++) {
      const wait = server.runtime.waitState();
      if (wait.kind !== "opportunity") throw new Error("Expected Opportunity");
      expect(server.runtime.execute({ move: "pass" }, { playerId: wait.playerId })).toMatchObject({
        ok: true,
      });
    }
    expect(server.runtime.state.objects[sourceId]?.counters["named:selected"]).toBe(8);
  });

  it.each([false, true])(
    "preserves source Spell classification when projecting Spellshroud (Spell=%s)",
    (spell) => {
      if (woodlandSquirrels.layout.kind !== "single-faced")
        throw new Error("Expected fixture face");
      const protectedAlly: GrandArchiveCard<GrandArchiveAbilityDefinition> = {
        ...woodlandSquirrels,
        canonicalId: "trigger-protected-ally",
        slug: "trigger-protected-ally",
        layout: {
          kind: "single-faced",
          face: {
            ...woodlandSquirrels.layout.face,
            id: "trigger-protected-ally:face:default",
            catalogId: "trigger-protected-ally",
            name: "Protected ally",
            abilities: [
              {
                id: "trigger-protected-a1",
                kind: "static",
                staticKind: "intrinsic",
                text: "Spellshroud",
                keyword: { name: "spellshroud" },
              },
            ],
          },
        },
      };
      const { game, server, chosen, decision } = setup("targets", spell, [protectedAlly]);
      const protectedId = game.player("p2").card(protectedAlly).objectId;
      const targets = [chosen[0]!, chosen[1]!, protectedId];
      const control = GrandArchiveTestEngine.fromState(game.program, game.state);
      expect(
        control.player("p1").tryExecute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: { targets: { allies: targets } },
        }).ok,
      ).toBe(!spell);
      const view = server.getInteractionView("p1");
      const action = view.actions.find((action) =>
        action.inputs.some((input) => input.id === "target:allies"),
      );
      if (!action) throw new Error("Expected target input");
      const input = action.inputs.find((input) => input.id === "target:allies");
      if (input?.kind !== "entity-selection") throw new Error("Expected entity selection");
      expect(
        input.candidates.some((candidate) => candidate.entity.instanceId === protectedId),
      ).toBe(!spell);
      const submission = buildInteractionSubmission({
        view,
        action,
        values: { "target:allies": chosen },
      });
      expect(
        server.submitInteraction(
          "p1",
          { ...submission, values: { "target:allies": targets } },
          context,
        ).success,
      ).toBe(!spell);
    },
  );

  it("offers a valid optional target input when no candidates exist", () => {
    const { server } = setup("empty");
    const view = server.getInteractionView("p1");
    const action = view.actions.find((action) =>
      action.inputs.some((input) => input.id === "target:allies"),
    );
    if (!action) throw new Error("Expected empty optional target input");
    expect(action.inputs.find((input) => input.id === "target:allies")).toMatchObject({
      kind: "entity-selection",
      min: 0,
      max: 0,
      required: false,
      candidates: [],
    });
    expect(
      server.submitInteraction(
        "p1",
        buildInteractionSubmission({ view, action, values: {} }),
        context,
      ).success,
    ).toBe(true);
    expect(
      server.runtime.state.stack.at(-1)?.targets.flatMap((target) => target.targetIds),
    ).toEqual([]);
  });

  it.each(["number", "targets"] as const)("rejects invalid %s announcements atomically", (kind) => {
    const { server, chosen, sourceId } = setup(kind);
    const view = server.getInteractionView("p1");
    const inputId = kind === "number" ? "variable:X" : "target:allies";
    const action = view.actions.find((action) =>
      action.inputs.some((input) => input.id === inputId),
    );
    if (!action) throw new Error("Expected trigger input");
    const valid = buildInteractionSubmission({
      view,
      action,
      values: { [inputId]: kind === "number" ? 37 : chosen },
    });
    const invalid =
      kind === "number"
        ? [29, 41, 35.5, "37"]
        : [
            [chosen[0]!, chosen[0]!, chosen[1]!],
            [chosen[0]!, chosen[1]!, sourceId],
            [chosen[0]!, chosen[1]!, "forged"],
          ];
    const before = server.runtime.state;
    for (const value of invalid) {
      expect(
        server.submitInteraction("p1", { ...valid, values: { [inputId]: value } }, context).success,
      ).toBe(false);
      expect(server.runtime.state).toBe(before);
    }
    expect(server.submitInteraction("p1", { ...valid, values: {} }, context).success).toBe(false);
    expect(server.runtime.state).toBe(before);
  });

  it.each(["number", "targets"] as const)(
    "accepts a legal %s announcement absent from bot answers",
    (kind) => {
      const { game, server, sourceId, chosen, answer, decision } = setup(kind);
      expect(
        listGrandArchiveDecisionAnswerCandidates(game.program, game.state, decision).some(
          (candidate) => JSON.stringify(candidate.answer) === JSON.stringify(answer),
        ),
      ).toBe(false);
      const control = GrandArchiveTestEngine.fromState(game.program, game.state);
      expect(
        control.player("p1").tryExecute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer,
        }),
      ).toMatchObject({ ok: true });
      const view = server.getInteractionView("p1");
      const action = view.actions.find((action) =>
        action.inputs.some(
          (input) => input.id === (kind === "number" ? "variable:X" : "target:allies"),
        ),
      );
      if (!action) throw new Error("Expected native trigger declaration inputs");
      const values: Record<string, number | string[]> =
        kind === "number" ? { "variable:X": 37 } : { "target:allies": chosen };
      expect(
        server.submitInteraction(
          "p1",
          buildInteractionSubmission({ view, action, values }),
          context,
        ).success,
      ).toBe(true);
      const stack = server.runtime.state.stack.at(-1);
      expect(stack?.sourceId).toBe(sourceId);
      if (kind === "number") expect(stack?.variables.X).toBe(37);
      else expect(stack?.targets.flatMap((target) => target.targetIds)).toEqual(chosen);
      for (let index = 0; index < 4 && server.runtime.state.stack.length; index++) {
        const wait = server.runtime.waitState();
        if (wait.kind !== "opportunity") throw new Error("Expected opportunity after announcement");
        expect(server.runtime.execute({ move: "pass" }, { playerId: wait.playerId })).toMatchObject(
          { ok: true },
        );
      }
      for (const id of kind === "number" ? [sourceId] : chosen)
        expect(server.runtime.state.objects[id]?.counters["named:selected"]).toBe(
          kind === "number" ? 37 : 1,
        );
    },
  );
});
