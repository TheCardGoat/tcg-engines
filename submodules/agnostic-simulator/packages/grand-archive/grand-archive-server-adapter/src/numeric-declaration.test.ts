import { describe, expect, it } from "vitest";
import { buildInteractionSubmission } from "@tcg/protocol";
import {
  diamondRibbon,
  lostInThought,
  spiritOfWater,
  woodlandSquirrels,
} from "@tcg/grand-archive-cards";
import {
  GrandArchiveMatchRuntime,
  listGrandArchiveLegalCommands,
} from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveServerEngine } from "./server-engine.ts";

describe("native numeric declarations", () => {
  it("accepts X=21 and its payment outside automation's search ceiling", () => {
    const fixture = GrandArchiveTestEngine.startFixture({
      playerOne: {
        id: "p1",
        champion: spiritOfWater,
        zones: {
          hand: [lostInThought, ...Array.from({ length: 24 }, () => woodlandSquirrels)],
        },
      },
      playerTwo: { id: "p2", champion: spiritOfWater },
    });
    const player = fixture.player("p1");
    const cardId = player.card(lostInThought).objectId;
    const payment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(-21)
      .map((card) => card.objectId);
    const legal = listGrandArchiveLegalCommands(fixture.program, fixture.state, player.id);
    expect(
      legal.some(
        ({ command }) =>
          command.move === "activate-card" &&
          command.cardId === cardId &&
          command.variables?.X === 21,
      ),
    ).toBe(false);
    const server = new GrandArchiveServerEngine(
      fixture.program,
      new GrandArchiveMatchRuntime(fixture.program, fixture.state),
    );
    const view = server.getInteractionView("p1");
    const action = view.actions.find((action) => action.source?.instanceId === cardId)!;
    const number = action.inputs.find((input) => input.id === "variable:X");
    expect(number).toMatchObject({ kind: "number", min: 0, step: 1 });
    expect(number).not.toHaveProperty("max");
    const declaration = action.inputs.find((input) => input.id === "legal-declaration");
    if (declaration?.kind !== "option-selection") throw new Error("Missing declaration");
    expect(declaration.options).toHaveLength(1);
    const values = {
      "legal-declaration": [declaration.options[0]!.id],
      "variable:X": 21,
      "reserve-payment": payment,
    };
    const context = { gameId: "numeric-declaration", sourceAuthority: "server" as const };
    const before = server.runtime.state;
    for (const value of [-1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
      const submission = {
        ...buildInteractionSubmission({ view, action, values }),
        values: { ...values, "variable:X": value },
      };
      expect(server.submitInteraction("p1", submission, context).success).toBe(false);
      expect(server.runtime.state).toBe(before);
    }
    expect(
      server.submitInteraction(
        "p1",
        buildInteractionSubmission({
          view,
          action,
          values: {
            ...values,
            "reserve-payment": payment.slice(1),
          },
        }),
        context,
      ).success,
    ).toBe(false);
    expect(server.runtime.state).toBe(before);
    expect(
      server.submitInteraction("p1", buildInteractionSubmission({ view, action, values }), context)
        .success,
    ).toBe(true);
    expect(server.runtime.state.stack.at(-1)?.variables.X).toBe(21);
    expect(server.runtime.state.zones[player.id].memory).toEqual(payment);
  });

  it("retains a printed maximum on an activated ability", () => {
    const fixture = GrandArchiveTestEngine.startFixture({
      playerOne: {
        id: "p1",
        champion: spiritOfWater,
        zones: {
          field: [diamondRibbon],
          hand: Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: { id: "p2", champion: spiritOfWater },
    });
    const server = new GrandArchiveServerEngine(
      fixture.program,
      new GrandArchiveMatchRuntime(fixture.program, fixture.state),
    );
    const view = server.getInteractionView("p1");
    const action = view.actions.find(
      (action) => action.source?.instanceId === fixture.player("p1").card(diamondRibbon).objectId,
    )!;
    expect(action.inputs.find((input) => input.id === "variable:X")).toMatchObject({
      kind: "number",
      min: 0,
      max: 2,
    });
    const declaration = action.inputs.find((input) => input.id === "legal-declaration");
    if (declaration?.kind !== "option-selection") throw new Error("Missing declaration");
    const payment = fixture
      .player("p1")
      .cards(woodlandSquirrels)
      .map((card) => card.objectId);
    const submission = buildInteractionSubmission({
      view,
      action,
      values: {
        "legal-declaration": [declaration.options[0]!.id],
        "variable:X": 2,
        "reserve-payment": payment,
      },
    });
    const before = server.runtime.state;
    expect(
      server.submitInteraction(
        "p1",
        { ...submission, values: { ...submission.values, "variable:X": 3 } },
        { gameId: "bounded-declaration", sourceAuthority: "server" },
      ).success,
    ).toBe(false);
    expect(server.runtime.state).toBe(before);
    expect(
      server.submitInteraction("p1", submission, {
        gameId: "bounded-declaration",
        sourceAuthority: "server",
      }).success,
    ).toBe(true);
    expect(server.runtime.state.stack.at(-1)?.variables.X).toBe(2);
  });
});
