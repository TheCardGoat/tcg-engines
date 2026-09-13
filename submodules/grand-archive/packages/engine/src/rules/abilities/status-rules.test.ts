import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["WARRIOR"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "ALLY"
              ? { power: 2, life: 3 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("status-rules-champion", "CHAMPION");
const ally = card("status-rules-ally", "ALLY");
const filler = card("status-rules-filler", "ACTION");
const targetedAction = card("status-rules-targeted-action", "ACTION", [
  {
    id: "statusRulesTargetedAction-a1",
    kind: "card-resolution",
    text: "Target unit.",
    targets: [
      {
        id: "target-unit",
        kind: "target",
        declared: "announcement",
        chooser: "controller",
        count: { kind: "exactly", amount: 1 },
        unique: true,
        candidates: {
          kind: "object",
          zones: ["field"],
          filter: { kind: "type", oneOf: ["ALLY", "CHAMPION"] },
        },
      },
    ],
    effect: { kind: "no-op" },
  },
]);

function setup() {
  const program = createGrandArchiveMatchProgram([champion, ally, filler, targetedAction]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1" ? [{ definitionId: ally.canonicalId, count: 1 }] : []),
      ...(id === "p1" ? [{ definitionId: targetedAction.canonicalId, count: 1 }] : []),
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 211,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, state, p1: grandArchivePlayerId("p1"), p2: grandArchivePlayerId("p2") };
}

describe("Grand Archive status rules", () => {
  it("canonicalizes Crowd's Favor and transfers it away from opponents", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const withOpponentFavor = kernel.transact(fixture.state, [
      {
        type: "player-state-changed",
        playerId: fixture.p2,
        state: "crowds-favor",
        value: true,
      },
    ]).state;
    const gained = executeGrandArchiveEffect(
      {
        kind: "set-player-state",
        player: "controller",
        state: { named: "Crowd's Favor" },
        value: true,
      },
      {
        program: fixture.program,
        state: withOpponentFavor,
        controllerId: fixture.p1,
        bindings: {},
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(gained.state.players[fixture.p1]?.states["crowds-favor"]).toBe(true);
    expect(gained.state.players[fixture.p2]?.states["crowds-favor"]).toBe(false);

    const lost = executeGrandArchiveEffect(
      {
        kind: "set-player-state",
        player: "controller",
        state: { kind: "event-state" },
        value: false,
      },
      {
        program: fixture.program,
        state: gained.state,
        controllerId: fixture.p1,
        bindings: { eventState: "crowds-favor" },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(lost.state.players[fixture.p1]?.states["crowds-favor"]).toBe(false);
  });

  it("charges one reserve to attack an object controlled by a player with Crowd's Favor", () => {
    const fixture = setup();
    const attacker = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === fixture.p1 && object.definitionId === ally.canonicalId,
    )!;
    const payment = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === fixture.p1 && object.definitionId === filler.canonicalId,
    )!;
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: attacker.id, from: attacker.zone, to: "field" },
      { type: "object-moved", objectId: payment.id, from: payment.zone, to: "hand" },
      {
        type: "player-state-changed",
        playerId: fixture.p2,
        state: "crowds-favor",
        value: true,
      },
      {
        type: "player-first-turn-completed",
        playerId: fixture.p1,
      },
    ]).state;
    const targetId = prepared.zones[fixture.p2].field[0]!;
    const unpaid = new GrandArchiveMatchRuntime(fixture.program, prepared).execute(
      { move: "declare-attack", attackerId: attacker.id, targetIds: [targetId] },
      { playerId: fixture.p1 },
    );
    expect(unpaid.ok).toBe(false);
    if (unpaid.ok) throw new Error("Crowd's Favor attack unexpectedly skipped its cost");
    expect(unpaid.message).toContain("exactly 1");

    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);
    const paid = runtime.execute(
      {
        move: "declare-attack",
        attackerId: attacker.id,
        targetIds: [targetId],
        reservePayment: [{ kind: "card", cardId: payment.id }],
      },
      { playerId: fixture.p1 },
    );
    expect(paid).toMatchObject({ ok: true });
    expect(runtime.state.objects[payment.id]?.zone).toBe("memory");
  });

  it("lets Crowd's Favor negate a targeting stack item when its controller declines payment", () => {
    const fixture = setup();
    const action = Object.values(fixture.state.objects).find(
      (object) =>
        object.ownerId === fixture.p1 && object.definitionId === targetedAction.canonicalId,
    )!;
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: action.id, from: action.zone, to: "hand" },
      {
        type: "player-state-changed",
        playerId: fixture.p2,
        state: "crowds-favor",
        value: true,
      },
    ]).state;
    const targetId = prepared.zones[fixture.p2].field[0]!;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);
    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: action.id,
        targets: { "target-unit": [targetId] },
      },
      { playerId: fixture.p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    const targetStackItemId = runtime.state.stack.find(
      (item) => item.kind === "card-activation" && item.cardId === action.id,
    )?.id;
    expect(targetStackItemId).toBeDefined();
    expect(
      runtime.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "crowds-favor-status-a3",
      ),
    ).toBe(true);

    for (let index = 0; index < 2; index += 1) {
      const holderId = runtime.state.opportunity?.holderId;
      if (!holderId) throw new Error("Crowd's Favor response has no Opportunity holder");
      const passed = runtime.execute({ move: "pass" }, { playerId: holderId });
      if (!passed.ok) throw new Error(passed.message);
    }
    const optional = runtime.state.decision;
    expect(optional).toMatchObject({ kind: "resolve-optional-effect", playerId: fixture.p2 });
    if (!optional) throw new Error("Missing Crowd's Favor optional decision");
    const accepted = runtime.execute(
      {
        move: "answer-decision",
        decisionId: optional.id,
        stateVersion: optional.stateVersion,
        answer: true,
      },
      { playerId: fixture.p2 },
    );
    if (!accepted.ok) throw new Error(accepted.message);

    const payment = runtime.state.decision;
    expect(payment).toMatchObject({ kind: "resolve-effect-payment", playerId: fixture.p1 });
    if (!payment) throw new Error("Missing Crowd's Favor payment decision");
    const declined = runtime.execute(
      {
        move: "answer-decision",
        decisionId: payment.id,
        stateVersion: payment.stateVersion,
        answer: false,
      },
      { playerId: fixture.p1 },
    );
    if (!declined.ok) throw new Error(declined.message);
    expect(declined.events).toContainEqual(
      expect.objectContaining({
        type: "stack-item-negated",
        item: expect.objectContaining({ id: targetStackItemId, negated: true }),
      }),
    );
  });
});
