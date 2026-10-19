import { describe, expect, it } from "vitest";
import { spiritOfFire, woodlandSquirrels } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveActivatedAbility,
  GrandArchiveAbilityCost,
  GrandArchiveCard,
  GrandArchiveExecutableAbility,
} from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "../testing/test-engine.ts";
import {
  listGrandArchiveAbilityActivationOrigins,
  previewGrandArchiveAbilityActivation,
} from "./ability-activation-preview.ts";
import { listGrandArchiveLegalCommands } from "./legal-commands.ts";
import type { GrandArchiveCommand } from "./commands.ts";

type Command = Extract<GrandArchiveCommand, { move: "activate-ability" }>;
function fixture(
  reserve: number | GrandArchiveAbilityCost = 0,
  sourceZone: "field" | "hand" | "main-deck" = "field",
  handCount = 1,
) {
  const ability: GrandArchiveActivatedAbility = {
    id: "preview-trigger-a1",
    kind: "activated",
    activation: "ability",
    functionalZones: [sourceZone],
    text: "On Enter: Choose a number, a mode and targets.",
    cost: typeof reserve === "number" ? { kind: "pay-reserve", amount: reserve } : reserve,
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
              candidates: {
                kind: "object",
                zones: ["field"],
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
  if (woodlandSquirrels.layout.kind !== "single-faced") throw new Error("Expected a single face");
  const card: GrandArchiveCard<GrandArchiveExecutableAbility> = {
    ...woodlandSquirrels,
    canonicalId: "activation-preview",
    slug: "activation-preview",
    layout: {
      kind: "single-faced",
      face: {
        ...woodlandSquirrels.layout.face,
        id: "activation-preview:face:default",
        catalogId: "activation-preview",
        abilities: [ability],
      },
    },
  };
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      id: "p1",
      champion: spiritOfFire,
      zones: {
        hand: Array.from({ length: handCount }, () => woodlandSquirrels),
        "main-deck": [woodlandSquirrels],
        [sourceZone]: sourceZone === "hand" ? [card, woodlandSquirrels] : [card],
      },
    },
    playerTwo: {
      id: "p2",
      champion: spiritOfFire,
      zones: { field: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
    },
  });
  const sourceId = game.player("p1").card(card, { zone: sourceZone }).objectId;
  const command: Command = { move: "activate-ability", sourceId, abilityId: ability.id };
  const ids = game
    .player("p2")
    .cards(woodlandSquirrels, { zone: "field" })
    .map((card) => card.objectId);
  const full: Command = {
    ...command,
    variables: { X: 32, Y: 33 },
    modeIds: ["dependent"],
    targets: { first: ids.slice(1), second: [ids[2]!] },
  };
  const preview = (draft: Command = command) =>
    previewGrandArchiveAbilityActivation(game.program, game.state, {
      playerId: game.player("p1").id,
      expectedStateVersion: game.state.stateVersion,
      command: draft,
    });
  return { game, command, full, preview, ids, sourceId };
}

describe("native ability activation discovery and preview", () => {
  it("uses viewer visibility instead of revealing the owner's unknown deck sources", () => {
    const hidden = fixture(0, "main-deck");
    expect(
      listGrandArchiveAbilityActivationOrigins(
        hidden.game.program,
        hidden.game.state,
        hidden.game.player("p1").id,
      ),
    ).not.toContainEqual(expect.objectContaining({ command: hidden.command }));
    expect(hidden.preview(hidden.full).status).toBe("unavailable");
    const visible = fixture(0, "hand");
    expect(
      listGrandArchiveAbilityActivationOrigins(
        visible.game.program,
        visible.game.state,
        visible.game.player("p1").id,
      ),
    ).toContainEqual(expect.objectContaining({ command: visible.command }));
    expect(visible.preview(visible.full).status).toBe("ready");
  });

  it("discovers a live ability beyond the bot number cap and resolves its dependent declaration", () => {
    const { game, command, full, preview, ids } = fixture();
    const before = structuredClone(game.state);
    expect(
      listGrandArchiveLegalCommands(game.program, game.state, game.player("p1").id).some(
        (entry) =>
          entry.command.move === "activate-ability" &&
          entry.command.abilityId === command.abilityId,
      ),
    ).toBe(false);
    expect(
      listGrandArchiveAbilityActivationOrigins(game.program, game.state, game.player("p1").id),
    ).toContainEqual(expect.objectContaining({ command }));
    expect(preview()).toMatchObject({
      status: "incomplete",
      steps: [{ kind: "number", minimum: 30, maximum: 40 }],
    });
    expect(
      preview({ ...command, variables: { X: 32 }, modeIds: ["dependent"] }).steps.at(-1),
    ).toMatchObject({ id: "variable:Y", minimum: 32, maximum: 34 });
    expect(preview({ ...full, targets: { first: ids.slice(1) } }).steps.at(-1)).toMatchObject({
      id: "target:second",
      candidateIds: ids.slice(1),
    });
    const ready = preview(full);
    expect(ready.status, JSON.stringify(ready)).toBe("ready");
    if (ready.status !== "ready") throw new Error(JSON.stringify(ready));
    expect(game.state).toEqual(before);
    game.player("p1").execute(ready.command);
    for (let step = 0; step < 4 && game.state.stack.length; step++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error("Expected Opportunity");
      game.player(wait.playerId).pass();
    }
    expect(game.state.objects[ids[2]!]!.counters["named:preview"]).toBe(33);
  });

  it("does not report ready until the canonical runtime accepts payment", () => {
    const { game, full, preview } = fixture(1);
    const before = structuredClone(game.state);
    expect(preview(full)).toMatchObject({
      status: "incomplete",
      paymentSteps: [{ kind: "reserve-payment", amount: 1, status: "missing" }],
    });
    const paid: Command = {
      ...full,
      reservePayment: [
        {
          kind: "card",
          cardId: game.player("p1").card(woodlandSquirrels, { zone: "hand" }).objectId,
        },
      ],
    };
    const result = preview(paid);
    expect(result.status, JSON.stringify(result)).toBe("ready");
    expect(game.state).toEqual(before);
    if (result.status !== "ready") throw new Error(JSON.stringify(result));
    expect(game.player("p1").tryExecute(result.command).ok).toBe(true);
  });

  it("pays a chosen-variable reserve cost above the bot ceiling with late candidate identities", () => {
    const { game, command, full, preview } = fixture(
      { kind: "pay-reserve", amount: { kind: "variable", symbol: "X" } },
      "field",
      35,
    );
    const before = structuredClone(game.state);
    const hand = game
      .player("p1")
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((card) => card.objectId);
    expect(
      listGrandArchiveLegalCommands(game.program, game.state, game.player("p1").id).some(
        (entry) =>
          entry.command.move === "activate-ability" &&
          entry.command.abilityId === command.abilityId,
      ),
    ).toBe(false);
    const step = preview(full).paymentSteps.at(-1);
    expect(step).toMatchObject({
      kind: "reserve-payment",
      amount: 32,
      candidates: hand.map((cardId) => ({ kind: "card", cardId })),
    });
    const ready = preview({
      ...full,
      reservePayment: hand.slice(3).map((cardId) => ({ kind: "card", cardId })),
    });
    expect(ready.status, JSON.stringify(ready)).toBe("ready");
    expect(game.state).toEqual(before);
    if (ready.status !== "ready") throw new Error(JSON.stringify(ready));
    game.player("p1").execute(ready.command);
    expect(game.state.zones[game.player("p1").id].memory).toEqual(
      expect.arrayContaining(hand.slice(3)),
    );
    expect(game.state.zones[game.player("p1").id].hand).toEqual(hand.slice(0, 3));
  });

  it("projects cost order and later choices from the tentative payment state", () => {
    const discard: GrandArchiveAbilityCost = {
      kind: "select-and-move",
      from: "hand",
      to: "graveyard",
      player: "controller",
      count: { kind: "exactly", amount: 1 },
    };
    const { game, full, preview } = fixture(
      { kind: "all", costs: [discard, { kind: "pay-reserve", amount: 1 }] },
      "field",
      3,
    );
    const hand = game
      .player("p1")
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((card) => card.objectId);
    const before = structuredClone(game.state);
    expect(preview(full)).toMatchObject({
      status: "incomplete",
      paymentSteps: [{ kind: "cost-order", path: [], status: "missing" }],
    });
    const ordered: Command = { ...full, costPaymentOrders: [{ path: [], order: [0, 1] }] };
    expect(preview(ordered).paymentSteps.at(-1)).toMatchObject({
      kind: "cost-selection",
      selectionIndex: 0,
      candidateIds: hand,
      minimum: 1,
      maximum: 1,
    });
    const selected: Command = { ...ordered, costSelections: [[hand[0]!]] };
    expect(preview(selected).paymentSteps.at(-1)).toMatchObject({
      kind: "reserve-payment",
      candidates: hand.slice(1).map((cardId) => ({ kind: "card", cardId })),
    });
    const reused: Command = { ...selected, reservePayment: [{ kind: "card", cardId: hand[0]! }] };
    expect(preview(reused).status).toBe("invalid");
    expect(game.player("p1").tryExecute(reused).ok).toBe(false);
    expect(game.state).toEqual(before);
    const reversed: Command = {
      ...full,
      costPaymentOrders: [{ path: [], order: [1, 0] }],
      reservePayment: [{ kind: "card", cardId: hand[0]! }],
    };
    expect(preview(reversed).paymentSteps.at(-1)).toMatchObject({
      kind: "cost-selection",
      candidateIds: hand.slice(1),
    });
    const ready = preview({ ...selected, reservePayment: [{ kind: "card", cardId: hand[2]! }] });
    expect(ready.status, JSON.stringify(ready)).toBe("ready");
    expect(game.state).toEqual(before);
    if (ready.status !== "ready") throw new Error(JSON.stringify(ready));
    game.player("p1").execute(ready.command);
    expect(game.state.objects[hand[0]!]!.zone).toBe("graveyard");
    expect(game.state.objects[hand[2]!]!.zone).toBe("memory");
  });

  it("requires an explicit alternative and optional-cost decision before payment", () => {
    const { game, full, preview } = fixture({
      kind: "one-of",
      costs: [
        { kind: "pay-reserve", amount: 1 },
        { kind: "optional", bindPaidAs: "paid", cost: { kind: "pay-reserve", amount: 1 } },
      ],
    });
    const before = structuredClone(game.state);
    expect(preview(full).paymentSteps.at(-1)).toMatchObject({
      kind: "cost-option",
      status: "missing",
    });
    expect(preview({ ...full, costOptionIndex: 1 }).paymentSteps.at(-1)).toMatchObject({
      kind: "optional-cost",
      status: "missing",
    });
    expect(
      preview({ ...full, costOptionIndex: 1, payOptionalCost: true }).paymentSteps.at(-1),
    ).toMatchObject({ kind: "reserve-payment", status: "missing" });
    const declined = preview({ ...full, costOptionIndex: 1, payOptionalCost: false });
    expect(declined.status, JSON.stringify(declined)).toBe("ready");
    expect(preview({ ...full, costOptionIndex: 9 }).status).toBe("invalid");
    expect(game.state).toEqual(before);
    if (declined.status !== "ready") throw new Error(JSON.stringify(declined));
    expect(game.player("p1").tryExecute(declined.command).ok).toBe(true);
  });

  it("does not disclose random payment outcomes or hidden selection candidates", () => {
    for (const cost of [
      { kind: "pay-memory", amount: 1 },
      {
        kind: "select-and-move",
        from: "hand",
        to: "graveyard",
        player: "controller",
        random: true,
        count: { kind: "exactly", amount: 1 },
      },
      {
        kind: "select-and-move",
        from: "main-deck",
        to: "graveyard",
        player: "controller",
        count: { kind: "exactly", amount: 1 },
      },
    ] satisfies GrandArchiveAbilityCost[]) {
      const { game, full, preview } = fixture(cost);
      const before = structuredClone(game.state);
      // The source remains public; the draw-pile candidate must remain private.
      const result = preview(full);
      expect(result.status, JSON.stringify(result)).toBe("unavailable");
      expect(result.paymentSteps).toEqual([]);
      expect(game.state).toEqual(before);
    }
  });

  it("drops stale branch values and refuses stale versions and actors without Opportunity", () => {
    const { game, command, full, preview } = fixture();
    const alternate = preview({
      ...full,
      modeIds: ["alternate"],
      targets: { ...full.targets, champion: [game.player("p1").card(spiritOfFire).objectId] },
    });
    expect(alternate.status, JSON.stringify(alternate)).toBe("ready");
    if (alternate.status !== "ready") throw new Error(JSON.stringify(alternate));
    expect(alternate.command.variables).toEqual({ X: 32 });
    expect(alternate.command.targets).toEqual({
      champion: [game.player("p1").card(spiritOfFire).objectId],
    });
    expect(
      previewGrandArchiveAbilityActivation(game.program, game.state, {
        playerId: game.player("p1").id,
        expectedStateVersion: game.state.stateVersion - 1,
        command,
      }).status,
    ).toBe("unavailable");
    expect(
      previewGrandArchiveAbilityActivation(game.program, game.state, {
        playerId: game.player("p2").id,
        expectedStateVersion: game.state.stateVersion,
        command,
      }).status,
    ).toBe("unavailable");
    expect(
      listGrandArchiveAbilityActivationOrigins(game.program, game.state, game.player("p2").id),
    ).toEqual([]);
  });
});
