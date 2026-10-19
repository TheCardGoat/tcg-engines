import { describe, expect, it } from "vitest";
import { buildInteractionSubmission } from "@tcg/protocol";
import {
  cruxSight,
  hiddenSecrets,
  lorraineCruxKnight,
  spiritOfFire,
  woodlandSquirrels,
} from "@tcg/grand-archive-cards";
import {
  GrandArchiveMatchRuntime,
  listGrandArchiveLegalCommands,
} from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveServerEngine } from "./server-engine.ts";

describe("correlated declaration payments", () => {
  it.each([false, true])("preserves the optional-cost quote when paying=%s", (pay) => {
    const fixture = GrandArchiveTestEngine.startFixture({
      playerOne: {
        id: "p1",
        champion: spiritOfFire,
        lineage: [lorraineCruxKnight],
        zones: {
          hand: [cruxSight, ...Array.from({ length: 10 }, () => woodlandSquirrels)],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { id: "p2", champion: spiritOfFire },
    });
    const player = fixture.player("p1");
    const payment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(-2)
      .map((card) => card.objectId);
    const server = new GrandArchiveServerEngine(
      fixture.program,
      new GrandArchiveMatchRuntime(fixture.program, fixture.state),
    );
    const view = server.getInteractionView("p1");
    const action = view.actions.find(
      (action) => action.source?.instanceId === player.card(cruxSight).objectId,
    )!;
    const declaration = action.inputs.find((input) => input.id === "legal-declaration");
    if (declaration?.kind !== "option-selection") throw new Error("Missing correlated declaration");
    // Each cost choice retains both native component payment orders.
    expect(declaration.options).toHaveLength(4);
    const chosen = declaration.options.find((option) =>
      option.text.key.includes(`Pay ${pay ? 2 : 0} reserve`),
    )!;
    expect(chosen.text.key).toContain(`Pay ${pay ? 2 : 0} reserve`);
    const reserve = action.inputs.find((input) => input.id === "reserve-payment");
    expect(reserve).toMatchObject({ kind: "entity-selection", min: 0, max: 2 });
    const invalid = buildInteractionSubmission({
      view,
      action,
      values: {
        "legal-declaration": [chosen.id],
        "reserve-payment": pay ? [] : payment,
      },
    });
    const context = { gameId: "optional-payment", sourceAuthority: "server" as const };
    const before = server.runtime.state;
    expect(server.submitInteraction("p1", invalid, context).success).toBe(false);
    expect(server.runtime.state).toBe(before);
    if (pay) {
      const omitted = buildInteractionSubmission({
        view,
        action,
        values: { "legal-declaration": [chosen.id] },
      });
      expect(server.submitInteraction("p1", omitted, context).success).toBe(false);
      expect(server.runtime.state).toBe(before);
    }
    const valid = buildInteractionSubmission({
      view,
      action,
      values: {
        "legal-declaration": [chosen.id],
        ...(pay ? { "reserve-payment": payment } : {}),
      },
    });
    expect(server.submitInteraction("p1", valid, context).success).toBe(true);
    expect(server.runtime.state.zones[player.id].memory).toEqual(pay ? payment : []);
    expect(server.runtime.state.stack.at(-1)?.bindings["paid-crux-sight"]).toBe(pay);
  });

  it.each(["draw", "stealth"] as const)(
    "accepts an unenumerated payment without changing the %s declaration",
    (mode) => {
      const fixture = GrandArchiveTestEngine.startFixture({
        playerOne: {
          id: "p1",
          champion: spiritOfFire,
          zones: {
            hand: [hiddenSecrets, ...Array.from({ length: 30 }, () => woodlandSquirrels)],
            field: [woodlandSquirrels],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { id: "p2", champion: spiritOfFire },
      });
      const player = fixture.player("p1");
      const cardId = player.card(hiddenSecrets).objectId;
      const allyId = player.card(woodlandSquirrels, { zone: "field" }).objectId;
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(-2)
        .map((card) => card.objectId);
      const enumerated = listGrandArchiveLegalCommands(
        fixture.program,
        fixture.state,
        player.id,
      ).filter(({ command }) => command.move === "activate-card" && command.cardId === cardId);
      expect(
        enumerated.some(
          ({ command }) =>
            "reservePayment" in command &&
            command.reservePayment?.length === 2 &&
            command.reservePayment.every(
              (source) => source.kind === "card" && payment.includes(source.cardId),
            ),
        ),
      ).toBe(false);
      const server = new GrandArchiveServerEngine(
        fixture.program,
        new GrandArchiveMatchRuntime(fixture.program, fixture.state),
      );
      const view = server.getInteractionView("p1");
      const action = view.actions.find((action) => action.source?.instanceId === cardId)!;
      const declaration = action.inputs.find((input) => input.id === "legal-declaration");
      if (declaration?.kind !== "option-selection")
        throw new Error("Missing correlated declaration");
      const reserve = action.inputs.find((input) => input.id === "reserve-payment");
      if (reserve?.kind !== "entity-selection")
        throw new Error("Missing independent reserve payment");
      expect(reserve.candidates).toHaveLength(30);
      expect(reserve.min).toBe(2);
      expect(reserve.max).toBe(2);
      const chosen = declaration.options.find((option) =>
        mode === "draw"
          ? option.text.key.includes("Draw a card into your memory")
          : option.text.key.includes("Target your Woodland Squirrels"),
      );
      if (!chosen) throw new Error("Missing printed declaration");
      expect(chosen.text.key).toContain("Pay 2 reserve");
      const result = server.submitInteraction(
        "p1",
        buildInteractionSubmission({
          view,
          action,
          values: {
            "legal-declaration": [chosen.id],
            "reserve-payment": payment,
          },
        }),
        { gameId: "correlated-payment", sourceAuthority: "server" },
      );
      expect(result.success).toBe(true);
      expect(server.runtime.state.zones[player.id].memory).toEqual(payment);
      const item = server.runtime.state.stack.at(-1)!;
      expect(item.selectedModeIds).toEqual(mode === "draw" ? ["mode-2"] : ["mode-1"]);
      expect(item.targets).toMatchObject(
        mode === "draw" ? [] : [{ binding: "target-1", targetIds: [allyId] }],
      );
    },
  );
});
