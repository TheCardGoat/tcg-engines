import { describe, expect, it } from "vitest";
import { buildInteractionSubmission } from "@tcg/protocol";
import {
  creativeShock,
  fireball,
  protectiveFractal,
  spiritOfFire,
  woodlandSquirrels,
} from "@tcg/grand-archive-cards";
import {
  GrandArchiveMatchRuntime,
  listGrandArchiveLegalCommands,
} from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveServerEngine } from "./server-engine.ts";

function setup(withReservable = false) {
  const fixture = GrandArchiveTestEngine.startFixture({
    playerOne: {
      id: "p1",
      champion: spiritOfFire,
      zones: {
        hand: [fireball, ...Array.from({ length: 10 }, () => woodlandSquirrels)],
        field: withReservable ? [protectiveFractal, protectiveFractal, woodlandSquirrels] : [],
      },
    },
    playerTwo: {
      id: "p2",
      champion: spiritOfFire,
      zones: {
        hand: [woodlandSquirrels],
        field: withReservable ? [protectiveFractal] : [],
      },
    },
  });
  const rested = fixture.player("p1").cards(protectiveFractal, { zone: "field" })[1]?.objectId;
  const state = rested
    ? {
        ...fixture.state,
        objects: {
          ...fixture.state.objects,
          [rested]: { ...fixture.state.objects[rested]!, states: new Set(["rested"] as const) },
        },
      }
    : fixture.state;
  const runtime = new GrandArchiveMatchRuntime(fixture.program, state);
  const server = new GrandArchiveServerEngine(fixture.program, runtime);
  const player = fixture.player("p1");
  const payment = player
    .cards(woodlandSquirrels, { zone: "hand" })
    .slice(-4)
    .map((card) => card.objectId);
  const target = fixture.player("p2").card(spiritOfFire).objectId;
  return { fixture, server, player, payment, target };
}

describe("player reserve declarations", () => {
  it("requires a payment choice even when discovery returns only one declaration", () => {
    const fixture = GrandArchiveTestEngine.startFixture({
      playerOne: {
        id: "p1",
        champion: spiritOfFire,
        zones: {
          hand: [creativeShock, ...Array.from({ length: 30 }, () => woodlandSquirrels)],
        },
      },
      playerTwo: { id: "p2", champion: spiritOfFire },
    });
    const player = fixture.player("p1");
    const cardId = player.card(creativeShock).objectId;
    const declarations = listGrandArchiveLegalCommands(
      fixture.program,
      fixture.state,
      player.id,
    ).filter(({ command }) => command.move === "activate-card" && command.cardId === cardId);
    expect(declarations).toHaveLength(1);
    const server = new GrandArchiveServerEngine(
      fixture.program,
      new GrandArchiveMatchRuntime(fixture.program, fixture.state),
    );
    const view = server.getInteractionView("p1");
    const action = view.actions.find((action) => action.source?.instanceId === cardId)!;
    const payment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(-3)
      .map((card) => card.objectId);
    expect(action.inputs.some((input) => input.id === "reserve-payment")).toBe(true);
    expect(
      server.submitInteraction(
        "p1",
        buildInteractionSubmission({
          view,
          action,
          values: {
            "reserve-payment": payment,
          },
        }),
        { gameId: "single-declaration", sourceAuthority: "server" },
      ).success,
    ).toBe(true);
    expect(server.runtime.state.zones[player.id].memory).toEqual(expect.arrayContaining(payment));
  });

  it("offers only ready controlled Reservable objects and pays with the selected object", () => {
    const { fixture, server, player, payment, target } = setup(true);
    const view = server.getInteractionView("p1");
    const action = view.actions.find(
      (action) => action.source?.instanceId === player.card(fireball).objectId,
    )!;
    const reserve = action.inputs.find((input) => input.id === "reserve-payment");
    if (reserve?.kind !== "entity-selection") throw new Error("Missing reserve selection");
    const candidates = reserve.candidates.map((candidate) => candidate.entity.instanceId);
    const [ready, rested] = player.cards(protectiveFractal, { zone: "field" });
    expect(candidates).toContain(ready!.objectId);
    expect(candidates).not.toContain(rested!.objectId);
    expect(candidates).not.toContain(player.card(woodlandSquirrels, { zone: "field" }).objectId);
    expect(candidates).not.toContain(fixture.player("p2").card(protectiveFractal).objectId);
    const submission = buildInteractionSubmission({
      view,
      action,
      values: {
        "target:target-1": [target],
        "reserve-payment": [ready!.objectId, ...payment.slice(1)],
      },
    });
    expect(
      server.submitInteraction("p1", submission, {
        gameId: "reservable-payment",
        sourceAuthority: "server",
      }).success,
    ).toBe(true);
    expect(server.runtime.state.objects[ready!.objectId]?.states.has("rested")).toBe(true);
    expect(server.runtime.state.zones[player.id].memory).toEqual(
      expect.arrayContaining(payment.slice(1)),
    );
    expect(server.runtime.state.objects[payment[0]!]!.zone).toBe("hand");
  });

  it.each(["duplicate", "opponent", "source", "underpay", "overpay"] as const)(
    "rejects %s payment without changing the match",
    (kind) => {
      const { fixture, server, player, payment, target } = setup();
      const view = server.getInteractionView("p1");
      const action = view.actions.find(
        (action) => action.source?.instanceId === player.card(fireball).objectId,
      )!;
      const invalid =
        kind === "duplicate"
          ? [payment[0]!, payment[0]!, ...payment.slice(2)]
          : kind === "opponent"
            ? [fixture.player("p2").card(woodlandSquirrels).objectId, ...payment.slice(1)]
            : kind === "source"
              ? [player.card(fireball).objectId, ...payment.slice(1)]
              : kind === "underpay"
                ? payment.slice(1)
                : [...payment, player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId];
      const valid = buildInteractionSubmission({
        view,
        action,
        values: {
          "target:target-1": [target],
          "reserve-payment": payment,
        },
      });
      const before = server.runtime.state;
      const result = server.submitInteraction(
        "p1",
        { ...valid, values: { ...valid.values, "reserve-payment": invalid } },
        { gameId: "invalid-payment", sourceAuthority: "server" },
      );
      expect(result.success).toBe(false);
      expect(server.runtime.state).toBe(before);
    },
  );

  it("accepts a legal payment combination outside the bot enumeration", () => {
    const { fixture, server, player, payment, target } = setup();
    const enumerated = listGrandArchiveLegalCommands(fixture.program, fixture.state, player.id);
    expect(
      enumerated.some(
        ({ command }) =>
          command.move === "activate-card" &&
          command.cardId === player.card(fireball).objectId &&
          command.reservePayment?.length === 4 &&
          command.reservePayment.every(
            (source) => source.kind === "card" && payment.includes(source.cardId),
          ),
      ),
    ).toBe(false);
    const view = server.getInteractionView("p1");
    const action = view.actions.find(
      (action) => action.source?.instanceId === player.card(fireball).objectId,
    );
    if (!action) throw new Error("Missing Fireball activation");
    const reserve = action.inputs.find((input) => input.id === "reserve-payment");
    if (reserve?.kind !== "entity-selection")
      throw new Error("Missing independent reserve selection");
    expect(reserve.min).toBe(4);
    expect(reserve.max).toBe(4);
    expect(reserve.candidates.map((candidate) => candidate.entity.instanceId)).toEqual(
      expect.arrayContaining(
        player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => card.objectId),
      ),
    );
    const opposingHand = fixture.player("p2").card(woodlandSquirrels).objectId;
    expect(
      reserve.candidates.some((candidate) => candidate.entity.instanceId === opposingHand),
    ).toBe(false);
    expect(
      reserve.candidates.some(
        (candidate) => candidate.entity.instanceId === player.card(fireball).objectId,
      ),
    ).toBe(false);
    const submission = buildInteractionSubmission({
      view,
      action,
      values: {
        "target:target-1": [target],
        "reserve-payment": payment,
      },
    });
    const result = server.submitInteraction("p1", submission, {
      gameId: "unbounded-payment",
      sourceAuthority: "server",
    });
    expect(result.success).toBe(true);
    expect(server.runtime.state.zones[player.id].memory).toEqual(expect.arrayContaining(payment));
    expect(server.runtime.state.stack.at(-1)?.targets).toMatchObject([
      { binding: "target-1", targetIds: [target] },
    ]);
  });
});
