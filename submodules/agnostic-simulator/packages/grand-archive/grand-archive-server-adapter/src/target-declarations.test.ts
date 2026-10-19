import { describe, expect, it } from "vitest";
import { buildInteractionSubmission } from "@tcg/protocol";
import { fireball, spiritOfFire, woodlandSquirrels } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveCard,
  GrandArchiveTargetDeclaration,
} from "@tcg/grand-archive-types";
import {
  GrandArchiveMatchRuntime,
  listGrandArchiveLegalCommands,
  describeGrandArchiveIndependentDeclarationTargets,
} from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveServerEngine } from "./server-engine.ts";

function setup(
  twoBindings: boolean,
  adjust: (
    targets: readonly GrandArchiveTargetDeclaration[],
  ) => readonly GrandArchiveTargetDeclaration[] = (targets) => targets,
  extraField: readonly GrandArchiveCard<GrandArchiveAbilityDefinition>[] = [],
) {
  if (fireball.layout.kind !== "single-faced") throw new Error("Expected fixture face");
  const targets: readonly GrandArchiveTargetDeclaration[] = adjust(
    (twoBindings ? ["first", "second"] : ["pair"]).map((id) => ({
      id,
      kind: "target",
      declared: "announcement",
      chooser: "controller",
      count: { kind: "exactly", amount: twoBindings ? 1 : 2 },
      unique: true,
      candidates: {
        kind: "object",
        zones: ["field"],
        player: "each-opponent",
        filter: { kind: "type", oneOf: ["ALLY"] },
      },
    })),
  );
  const spell: GrandArchiveCard<GrandArchiveAbilityDefinition> = {
    ...fireball,
    canonicalId: "complete-targets-spell",
    slug: "complete-targets-spell",
    layout: {
      kind: "single-faced",
      face: {
        ...fireball.layout.face,
        id: "complete-targets-spell:face:default",
        catalogId: "complete-targets-spell",
        name: "Target selection fixture",
        elements: ["NORM"],
        cost: { kind: "reserve", amount: 0 },
        abilities: [
          {
            id: "complete-targets-spell-a1",
            kind: "card-resolution",
            text: "Mark the selected allies.",
            targets,
            effect: {
              kind: "sequence",
              effects: targets.map((target) => ({
                kind: "add-counter",
                subject: { kind: "bound", binding: target.id },
                counter: { named: "selected" },
                amount: 1,
              })),
            },
          },
        ],
      },
    },
  };
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: { id: "p1", champion: spiritOfFire, zones: { hand: [spell] } },
    playerTwo: {
      id: "p2",
      champion: spiritOfFire,
      zones: {
        field: [...Array.from({ length: 25 }, () => woodlandSquirrels), ...extraField],
        hand: [woodlandSquirrels],
      },
    },
  });
  const ids = game
    .player("p2")
    .cards(woodlandSquirrels, { zone: "field" })
    .map((card) => card.objectId);
  const chosen = ids.slice(-2);
  const declarations = twoBindings
    ? { first: [chosen[0]!], second: [chosen[1]!] }
    : { pair: chosen };
  const cardId = game.player("p1").card(spell).objectId;
  return { game, cardId, chosen, declarations };
}

function serverView(game: GrandArchiveTestEngine, cardId: string) {
  const server = new GrandArchiveServerEngine(
    game.program,
    new GrandArchiveMatchRuntime(game.program, game.state),
  );
  const view = server.getInteractionView("p1");
  const action = view.actions.find((action) => action.source?.instanceId === cardId);
  if (!action) throw new Error("Expected target action");
  return { server, view, action };
}
const context = { gameId: "native-target-validation", sourceAuthority: "server" as const };

describe("native target declarations beyond bot enumeration", () => {
  it.each([false, true])(
    "submits a legal target combination omitted by the bot budget (two bindings=%s)",
    (twoBindings) => {
      const { game, cardId, chosen, declarations } = setup(twoBindings);
      const p1 = game.player("p1");
      const legal = listGrandArchiveLegalCommands(game.program, game.state, p1.id);
      expect(
        legal.some(
          ({ command }) =>
            command.move === "activate-card" &&
            command.cardId === cardId &&
            JSON.stringify(command.targets) === JSON.stringify(declarations),
        ),
      ).toBe(false);
      const control = GrandArchiveTestEngine.fromState(game.program, game.state);
      expect(
        control.player("p1").tryExecute({ move: "activate-card", cardId, targets: declarations })
          .ok,
      ).toBe(true);
      const server = new GrandArchiveServerEngine(
        game.program,
        new GrandArchiveMatchRuntime(game.program, game.state),
      );
      const view = server.getInteractionView("p1");
      const action = view.actions.find((action) => action.source?.instanceId === cardId);
      if (!action) throw new Error("Expected a discovered spell action");
      for (const [binding, ids] of Object.entries(declarations)) {
        const input = action.inputs.find((input) => input.id === `target:${binding}`);
        if (input?.kind !== "entity-selection") throw new Error(`Missing target input ${binding}`);
        expect(input.candidates.map((candidate) => candidate.entity.instanceId)).toEqual(
          expect.arrayContaining(ids),
        );
      }
      const values = Object.fromEntries(
        Object.entries(declarations).map(([binding, ids]) => [`target:${binding}`, ids]),
      );
      expect(
        server.submitInteraction("p1", buildInteractionSubmission({ view, action, values }), {
          gameId: "targets",
          sourceAuthority: "server",
        }).success,
      ).toBe(true);
      expect(
        server.runtime.state.stack.at(-1)?.targets.flatMap((target) => target.targetIds),
      ).toEqual(chosen);
    },
  );
  it("rejects duplicate, wrong-zone and forged targets without changing the match", () => {
    const { game, cardId, chosen } = setup(false);
    const { server, view, action } = serverView(game, cardId);
    const valid = buildInteractionSubmission({ view, action, values: { "target:pair": chosen } });
    const handId = game.player("p2").card(woodlandSquirrels, { zone: "hand" }).objectId;
    const before = server.runtime.state;
    for (const ids of [
      [chosen[0]!, chosen[0]!],
      [chosen[0]!, handId],
      [chosen[0]!, "forged"],
    ]) {
      expect(
        server.submitInteraction("p1", { ...valid, values: { "target:pair": ids } }, context)
          .success,
      ).toBe(false);
      expect(server.runtime.state).toBe(before);
    }
  });

  it("keeps aggregate target rules authoritative for a manually chosen combination", () => {
    if (woodlandSquirrels.layout.kind !== "single-faced") throw new Error("Expected fixture face");
    const powerful: GrandArchiveCard<GrandArchiveAbilityDefinition> = {
      ...woodlandSquirrels,
      canonicalId: "powerful-target",
      slug: "powerful-target",
      layout: {
        kind: "single-faced",
        face: {
          ...woodlandSquirrels.layout.face,
          id: "powerful-target:face:default",
          catalogId: "powerful-target",
          name: "Powerful target",
          stats: { ...woodlandSquirrels.layout.face.stats, power: 3 },
          abilities: [],
        },
      },
    };
    const { game, cardId, chosen } = setup(
      false,
      (targets) =>
        targets.map((target) => ({
          ...target,
          aggregateConstraint: {
            property: "power",
            operation: "sum",
            operator: "lte",
            value: 3,
            basis: "base",
          },
        })),
      [powerful],
    );
    const { server, view, action } = serverView(game, cardId);
    const powerfulId = game.player("p2").card(powerful).objectId;
    const input = action.inputs.find((input) => input.id === "target:pair");
    if (input?.kind !== "entity-selection") throw new Error("Expected native targets");
    expect(input.candidates.map((candidate) => candidate.entity.instanceId)).toContain(powerfulId);
    const before = server.runtime.state;
    expect(
      server.submitInteraction(
        "p1",
        buildInteractionSubmission({
          view,
          action,
          values: { "target:pair": [chosen[0]!, powerfulId] },
        }),
        context,
      ).success,
    ).toBe(false);
    expect(server.runtime.state).toBe(before);
    expect(
      server.submitInteraction(
        "p1",
        buildInteractionSubmission({ view, action, values: { "target:pair": chosen } }),
        context,
      ).success,
    ).toBe(true);
  });

  it("accepts an omitted optional target selection as empty", () => {
    const { game, cardId } = setup(false, (targets) =>
      targets.map((target) => ({ ...target, count: { kind: "up-to", amount: 2 } })),
    );
    const { server, view, action } = serverView(game, cardId);
    expect(action.inputs.find((input) => input.id === "target:pair")).toMatchObject({
      min: 0,
      max: 2,
      required: false,
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

  it("excludes Spellshroud from the native candidates of a Spell", () => {
    if (woodlandSquirrels.layout.kind !== "single-faced") throw new Error("Expected fixture face");
    const protectedAlly: GrandArchiveCard<GrandArchiveAbilityDefinition> = {
      ...woodlandSquirrels,
      canonicalId: "protected-target",
      slug: "protected-target",
      layout: {
        kind: "single-faced",
        face: {
          ...woodlandSquirrels.layout.face,
          id: "protected-target:face:default",
          catalogId: "protected-target",
          name: "Protected target",
          abilities: [
            {
              id: "protected-target-a1",
              kind: "static",
              staticKind: "intrinsic",
              text: "Spellshroud",
              keyword: { name: "spellshroud" },
            },
          ],
        },
      },
    };
    const { game, cardId } = setup(false, (targets) => targets, [protectedAlly]);
    const { action } = serverView(game, cardId);
    const input = action.inputs.find((input) => input.id === "target:pair");
    if (input?.kind !== "entity-selection") throw new Error("Expected native target candidates");
    expect(input.candidates.map((candidate) => candidate.entity.instanceId)).not.toContain(
      game.player("p2").card(protectedAlly).objectId,
    );
  });

  it("does not claim independent candidates for a target bound to another selection", () => {
    const { game, cardId, chosen } = setup(true, (targets) =>
      targets.map((target, index) =>
        index === 0 ? target : { ...target, candidates: { kind: "object", binding: "first" } },
      ),
    );
    expect(
      describeGrandArchiveIndependentDeclarationTargets(
        game.program,
        game.state,
        game.player("p1").id,
        { move: "activate-card", cardId, targets: { first: [chosen[0]!], second: [chosen[0]!] } },
      ),
    ).toBeNull();
  });
});
