import { describe, expect, it } from "vitest";
import { buildInteractionSubmission } from "@tcg/protocol";
import { divineComedy, spiritOfFire, woodlandSquirrels } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";
import {
  GrandArchiveTestEngine,
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "@tcg/grand-archive-engine/testing";
import { GrandArchiveServerEngine } from "./server-engine.ts";

function setup() {
  if (spiritOfFire.layout.kind !== "single-faced") throw new Error("Expected champion face");
  const champion: GrandArchiveCard<GrandArchiveAbilityDefinition> = {
    ...spiritOfFire,
    canonicalId: "native-mastery-dante",
    slug: "native-mastery-dante",
    layout: {
      kind: "single-faced",
      face: {
        ...spiritOfFire.layout.face,
        id: "native-mastery-dante:face:default",
        catalogId: "native-mastery-dante",
        name: "Dante fixture",
        lineageName: "Dante",
        abilities: [],
      },
    },
  };
  const gain: GrandArchiveCard<GrandArchiveAbilityDefinition> = {
    canonicalId: "native-mastery-gain",
    slug: "native-mastery-gain",
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: "native-mastery-gain:face:default",
        catalogId: "native-mastery-gain",
        name: "Gain Divine Comedy",
        cost: { kind: "reserve", amount: 0 },
        elements: ["NORM"],
        typeLine: { types: ["ACTION"], subtypes: [], classes: [], supertypes: [] },
        speed: "fast",
        stats: {},
        rulesText: "Get Divine Comedy.",
        abilities: [
          {
            id: "native-mastery-gain-a1",
            kind: "card-resolution",
            text: "Get Divine Comedy.",
            effect: { kind: "gain-mastery", player: "controller", mastery: "Divine Comedy" },
          },
        ],
      },
    },
  };
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      id: "p1",
      champion,
      zones: {
        hand: [gain, ...Array.from({ length: 8 }, () => woodlandSquirrels)],
        "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      id: "p2",
      champion: spiritOfFire,
      zones: {
        field: [woodlandSquirrels],
        "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
      },
    },
    definitions: [divineComedy],
  });
  game.player("p1").activate(gain);
  drain(game);
  return game;
}
function pass(game: GrandArchiveTestEngine) {
  const wait = game.waitState();
  if (wait.kind !== "opportunity") throw new Error(`Expected Opportunity, got ${wait.kind}`);
  game.player(wait.playerId).pass();
}
function drain(game: GrandArchiveTestEngine) {
  for (let i = 0; game.state.stack.length && i < 30; i++) pass(game);
}
function nextMain(game: GrandArchiveTestEngine) {
  const turn = game.state.turn.number;
  for (let i = 0; i < 100; i++) {
    if (
      game.state.turn.playerId === "p1" &&
      game.state.turn.phase === "main" &&
      game.state.turn.number > turn
    )
      return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else pass(game);
  }
  throw new Error("Did not reach next main");
}
function serverFor(game: GrandArchiveTestEngine) {
  return new GrandArchiveServerEngine(
    game.program,
    new GrandArchiveMatchRuntime(game.program, game.state),
  );
}
const context = { gameId: "native-mastery", sourceAuthority: "server" as const };

describe("mastery interaction contract", () => {
  it("offers and accepts a non-object mastery action, then submits its paid targeted page after restoration", () => {
    let game = setup();
    let server = serverFor(game);
    let view = server.getInteractionView("p1");
    let action = view.actions.find((action) =>
      action.text.key.startsWith("Activate Divine Comedy"),
    );
    if (!action) throw new Error("Mastery activation missing from the player view");
    expect(action.source).toBeUndefined();
    expect(action.inputs).toEqual([]);
    expect(
      server.submitInteraction(
        "p1",
        buildInteractionSubmission({ view, action, values: {} }),
        context,
      ).success,
    ).toBe(true);
    expect(server.runtime.state.stack[0]?.masterySource).toEqual({
      playerId: "p1",
      name: "Divine Comedy",
    });
    game = GrandArchiveTestEngine.fromState(game.program, server.runtime.state);
    drain(game);
    nextMain(game);
    game = GrandArchiveTestEngine.fromState(
      game.program,
      restoreGrandArchiveMatchSnapshot(
        game.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(game.state))),
      ),
    );
    server = serverFor(game);
    view = server.getInteractionView("p1");
    action = view.actions.find((action) => action.text.key.startsWith("Activate Divine Comedy"));
    if (!action) throw new Error("Paid mastery activation missing after restoration");
    const target = game.player("p2").card(woodlandSquirrels, { zone: "field" }).objectId;
    const payment = game
      .player("p1")
      .zone("hand")
      .slice(-4)
      .map((card) => card.objectId);
    expect(action.inputs.find((input) => input.id === "reserve-payment")).toMatchObject({
      kind: "entity-selection",
      min: 4,
      max: 4,
    });
    expect(action.inputs.find((input) => input.id === "target:target-1")).toMatchObject({
      kind: "entity-selection",
      min: 1,
      max: 1,
    });
    const before = server.runtime.state;
    expect(
      server.submitInteraction(
        "p1",
        buildInteractionSubmission({
          view,
          action,
          values: { "target:target-1": [target], "reserve-payment": payment.slice(1) },
        }),
        context,
      ).success,
    ).toBe(false);
    expect(server.runtime.state).toBe(before);
    expect(
      server.submitInteraction(
        "p1",
        buildInteractionSubmission({
          view,
          action,
          values: { "target:target-1": [target], "reserve-payment": payment },
        }),
        context,
      ).success,
    ).toBe(true);
    expect(server.runtime.state.stack[0]?.selectedModeIds).toEqual(["cascade-2"]);
    expect(server.runtime.state.zones[game.player("p1").id].memory).toEqual(payment);
  });
});
