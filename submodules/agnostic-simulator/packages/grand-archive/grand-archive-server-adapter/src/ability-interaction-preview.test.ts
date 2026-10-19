import { describe, expect, it } from "vitest";
import { spiritOfFire, woodlandSquirrels } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveActivatedAbility,
  GrandArchiveCard,
  GrandArchiveExecutableAbility,
} from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  GrandArchiveMatchRuntime,
  listGrandArchiveLegalCommands,
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "@tcg/grand-archive-engine/simulator";
import {
  INTERACTION_PROTOCOL_VERSION,
  InteractionPreviewResult,
  buildInteractionSubmission,
  type InteractionPreviewRequest,
  type InteractionSubmissionValue,
} from "@tcg/protocol";
import { GrandArchiveServerEngine } from "./server-engine.ts";
import { grandArchiveAbilityActionId, grandArchivePreviewView } from "./interaction-preview.ts";
import { readGrandArchivePaymentDraft } from "./ability-payment-preview.ts";

function fixture(options: { foreign?: boolean; anyPlayer?: boolean } = {}) {
  const ability: GrandArchiveActivatedAbility = {
    id: "native-paid-a1",
    kind: "activated",
    activation: "ability",
    ...(options.anyPlayer ? { activationAuthority: "any-player" as const } : {}),
    text: "Discard a card and pay X reserve: Put X counters on target champion.",
    variables: [{ kind: "chosen", symbol: "X", minimum: 30, maximum: 40 }],
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
          player: "each-opponent",
          filter: { kind: "type", oneOf: ["CHAMPION"] },
        },
      },
    ],
    cost: {
      kind: "all",
      costs: [
        {
          kind: "select-and-move",
          player: "controller",
          from: "hand",
          to: "graveyard",
          count: { kind: "exactly", amount: 1 },
        },
        { kind: "pay-reserve", amount: { kind: "variable", symbol: "X" } },
      ],
    },
    effect: {
      kind: "add-counter",
      subject: { kind: "bound", binding: "champion" },
      counter: { named: "paid" },
      amount: { kind: "variable", symbol: "X" },
    },
  };
  if (woodlandSquirrels.layout.kind !== "single-faced") throw new Error("Expected single face");
  const card: GrandArchiveCard<GrandArchiveExecutableAbility> = {
    ...woodlandSquirrels,
    canonicalId: "native-payment",
    slug: "native-payment",
    layout: {
      kind: "single-faced",
      face: {
        ...woodlandSquirrels.layout.face,
        id: "native-payment:face:default",
        catalogId: "native-payment",
        abilities: [ability],
      },
    },
  };
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      id: "p1",
      champion: spiritOfFire,
      zones: {
        field: options.foreign ? [] : [card],
        hand: Array.from({ length: 35 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      id: "p2",
      champion: spiritOfFire,
      zones: { field: options.foreign ? [card] : [], hand: [woodlandSquirrels] },
    },
  });
  const command = {
    move: "activate-ability" as const,
    sourceId: game.player(options.foreign ? "p2" : "p1").card(card).objectId,
    abilityId: ability.id,
  };
  expect(
    listGrandArchiveLegalCommands(game.program, game.state, game.player("p1").id).some(
      (entry) =>
        entry.command.move === "activate-ability" && entry.command.abilityId === ability.id,
    ),
  ).toBe(false);
  const runtime = new GrandArchiveMatchRuntime(
    game.program,
    restoreGrandArchiveMatchSnapshot(
      game.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(game.state))),
    ),
  );
  const server = new GrandArchiveServerEngine(game.program, runtime);
  const actionId = grandArchiveAbilityActionId(command);
  const request: InteractionPreviewRequest = {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    stateVersion: server.getStateID(),
    actionId,
    values: {},
  };
  const preview = (values: Record<string, InteractionSubmissionValue>) => {
    const result = server.previewInteraction("p1", { ...request, values });
    expect(InteractionPreviewResult.safeParse(result).success, JSON.stringify(result)).toBe(true);
    return result;
  };
  const hand = game
    .player("p1")
    .cards(woodlandSquirrels, { zone: "hand" })
    .map((card) => card.objectId);
  const target = game.player("p2").card(spiritOfFire).objectId;
  const values = {
    "variable:X": 32,
    "target:champion": [target],
    "payment:order:": ["0", "1"],
    "payment:selection:0": [hand[0]!],
    "payment:reserve:0": hand.slice(3).map((id) => `card:${id}`),
  };
  const submission = () => {
    const result = preview(values);
    if (result.status !== "ready") throw new Error(JSON.stringify(result));
    return buildInteractionSubmission({
      view: grandArchivePreviewView("p1", result),
      action: result.action,
      values: result.values,
      correlationId: "native-paid",
    });
  };
  return { game, server, actionId, request, preview, hand, target, values, submission };
}
const context = { gameId: "native-payment", sourceAuthority: "server" as const };

describe("native ability player actions", () => {
  it("discovers, previews and executes a paid ability absent from bot enumeration", () => {
    const { server, actionId, preview, target, hand, submission } = fixture();
    const before = structuredClone(server.runtime.state);
    expect(
      server.getInteractionView("p1").actions.find((action) => action.id === actionId),
    ).toMatchObject({
      requiresPreview: true,
      intent: "activate",
      inputs: [{ id: "variable:X", kind: "number", min: 30, max: 40 }],
    });
    const targetStep = preview({ "variable:X": 32 });
    expect(targetStep.status).toBe("incomplete");
    if (targetStep.status === "unavailable") throw new Error(targetStep.message);
    expect(targetStep.action.inputs.at(-1)).toMatchObject({
      id: "target:champion",
      kind: "entity-selection",
    });
    const selected = { "variable:X": 32, "target:champion": [target] };
    const order = preview(selected);
    if (order.status === "unavailable") throw new Error(order.message);
    expect(order.action.inputs.at(-1)).toMatchObject({ id: "payment:order:", kind: "ordering" });
    const ordered = { ...selected, "payment:order:": ["0", "1"] };
    const discard = preview(ordered);
    if (discard.status === "unavailable") throw new Error(discard.message);
    expect(discard.action.inputs.at(-1)).toMatchObject({
      id: "payment:selection:0",
      kind: "entity-selection",
      role: "cost",
    });
    const reserve = preview({ ...ordered, "payment:selection:0": [hand[0]!] });
    if (reserve.status === "unavailable") throw new Error(reserve.message);
    const payment = reserve.action.inputs.at(-1);
    expect(payment).toMatchObject({
      id: "payment:reserve:0",
      kind: "option-selection",
      min: 32,
      max: 32,
    });
    if (payment?.kind !== "option-selection") throw new Error("Expected reserve options");
    expect(payment.options.map((option) => option.id)).toEqual(
      hand.slice(1).map((id) => `card:${id}`),
    );
    const commit = submission();
    expect(server.runtime.state).toEqual(before);
    expect(server.submitInteraction("p1", commit, context).success).toBe(true);
    for (let step = 0; step < 4 && server.runtime.state.stack.length; step++) {
      const actor = server.runtime.state.opportunity?.holderId;
      if (!actor) throw new Error("Expected Opportunity");
      const view = server.getInteractionView(actor);
      const pass = view.actions.find((action) => action.intent === "pass");
      if (!pass) throw new Error("Expected pass");
      expect(
        server.submitInteraction(
          actor,
          buildInteractionSubmission({ view, action: pass, values: {} }),
          context,
        ).success,
      ).toBe(true);
    }
    expect(server.runtime.state.objects[target]!.counters["named:paid"]).toBe(32);
    expect(server.runtime.state.objects[hand[0]!]!.zone).toBe("graveyard");
    expect(hand.slice(3).every((id) => server.runtime.state.objects[id]!.zone === "memory")).toBe(
      true,
    );
    expect(server.submitInteraction("p1", commit, context)).toMatchObject({
      success: false,
      errorCode: "duplicate_interaction",
    });
  });

  it("rejects forged payments, actors, versions and request identities atomically", () => {
    const { server, request, preview, hand, values, submission } = fixture();
    const before = structuredClone(server.runtime.state);
    const commit = submission();
    expect(
      preview({
        ...values,
        "payment:reserve:0": [`card:${hand[0]}`, ...values["payment:reserve:0"].slice(1)],
      }).status,
    ).toBe("invalid");
    expect(server.previewInteraction("p2", { ...request, values }).status).toBe("unavailable");
    expect(
      server.previewInteraction("p1", {
        ...request,
        stateVersion: request.stateVersion - 1,
        values,
      }).status,
    ).toBe("unavailable");
    for (const invalid of [
      { ...commit, requestId: `${commit.requestId}:forged` },
      { ...commit, values: { ...commit.values, "payment:unknown": true } },
      { ...commit, values: { ...commit.values, "payment:order:": ["0", "0"] } },
      { ...commit, values: { ...commit.values, "payment:reserve:0": [] } },
    ])
      expect(server.submitInteraction("p1", invalid, context).success).toBe(false);
    expect(server.runtime.state).toEqual(before);
  });

  it("does not offer another player's ability unless its authority permits it", () => {
    const forbidden = fixture({ foreign: true });
    expect(
      forbidden.server
        .getInteractionView("p1")
        .actions.some((action) => action.id === forbidden.actionId),
    ).toBe(false);
    expect(forbidden.preview({}).status).toBe("unavailable");
    const permitted = fixture({ foreign: true, anyPlayer: true });
    expect(
      permitted.server
        .getInteractionView("p1")
        .actions.some((action) => action.id === permitted.actionId),
    ).toBe(true);
    expect(permitted.preview({}).status).toBe("incomplete");
  });

  it("normalizes inactive payment fields when an earlier declaration changes", () => {
    const { preview, values } = fixture();
    const result = preview({ ...values, "variable:X": 41 });
    expect(result.status).toBe("invalid");
    if (result.status === "unavailable") throw new Error(result.message);
    expect(result.values).not.toHaveProperty("payment:reserve:0");
    expect(result.ignoredInputIds).toContain("payment:reserve:0");
  });

  it("parses payment choices without accepting sparse huge indices or malformed sources", () => {
    expect(
      readGrandArchivePaymentDraft({ "payment:option": ["1"], "payment:optional": false }),
    ).toEqual({ costOptionIndex: 1, payOptionalCost: false });
    const malformed: Record<string, InteractionSubmissionValue>[] = [
      { "payment:selection:999999999": ["forged"] },
      { "payment:reserve:1": ["card:forged"] },
      { "payment:reserve:0": ["forged"] },
      { "payment:option": ["-1"] },
      { "payment:optional": "false" },
    ];
    for (const values of malformed) expect(() => readGrandArchivePaymentDraft(values)).toThrow();
  });
});
