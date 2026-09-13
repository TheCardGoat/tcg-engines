import { describe, expect, it } from "vitest";
import {
  createFabMatchContext,
  isFabMatchSnapshotV21,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../index.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, pummelRed, snatchRed } from "./fixtures.ts";
import { volticBoltRed } from "../../../cards/src/cards/actions/voltic-bolt.ts";
import { snapshotObject } from "./snapshots.ts";
import { executeFabEventTransaction } from "../kernel/transaction/index.ts";
import {
  commitFabReplacementCostTarget,
  resumeFabReplacementCostConsequence,
  resumeFabReplacementPlayerChoice,
} from "../kernel/process-runner/index.ts";
import type { FabEventTransactionOptions } from "../kernel/process-runner/index.ts";
import type { FabMatchState } from "../state.ts";

const LIFE = 20;
const transactionOptions: FabEventTransactionOptions = {
  triggerContext: { evaluateStateCondition: () => true },
  legalTargets: () => [],
  evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
  randomIndex: () => 0,
};

function setupBoundedOptionalPrevention() {
  const game = FabTestEngine.start(
    {
      hero: dash,
      hand: [volticBoltRed, nimblismBlue, snatchRed, pummelRed],
      arsenal: [snatchRed],
      deck: 8,
      actionPoints: 1,
    },
    { hero: bravo, hand: 4, arsenal: [nimblismBlue], deck: 8, life: LIFE },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
  const state = game.getState();
  const heroInstanceId = state.players[game.as(bravo).id]!.heroCardId!;
  state.replacementEffects.push({
    replacementId: "generic-next-optional-prevention",
    controllerId: game.as(bravo).id,
    source: snapshotObject(state, heroInstanceId, game.as(bravo).id, "heroZone"),
    effect: {
      type: "prevention",
      preventionKind: "fixed",
      amount: 1,
      shielded: { selector: "controller" },
      duration: "this-turn",
    },
    createdByEventId: null,
    expiresAt: { kind: "turn", turnNumber: state.turnNumber },
    consumptionPolicy: { kind: "on-opportunity" },
    applicationPolicy: { kind: "may-apply", followUps: [] },
  });
  return game;
}

function presentDamage(game: ReturnType<typeof setupBoundedOptionalPrevention>) {
  const attacker = game.as(dash);
  attacker.play(volticBoltRed, { target: game.as(bravo).id });
  game.passBoth();
  return game.as(bravo).expectDecision("option");
}

function setupNewlyActiveOptionalPrevention() {
  const game = FabTestEngine.start(
    { hero: dash, hand: 4, arsenal: [snatchRed], deck: 8 },
    { hero: bravo, hand: 4, arsenal: [nimblismBlue], deck: 8, life: LIFE },
    { autoPassPriority: false },
  );
  const state = game.getState();
  state.replacementEffects = [];
  const defenderId = game.as(bravo).id;
  const attackerId = game.as(dash).id;
  const defenderHeroId = state.players[defenderId]!.heroCardId!;
  const attackerHeroId = state.players[attackerId]!.heroCardId!;
  const defender = snapshotObject(state, defenderHeroId, defenderId, "heroZone");
  const source = snapshotObject(state, attackerHeroId, attackerId, "heroZone");
  state.replacementEffects.push(
    {
      replacementId: "mandatory-prevent-two",
      controllerId: defenderId,
      source: defender,
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 2,
        shielded: { selector: "controller" },
        duration: "this-turn",
      },
      createdByEventId: null,
      expiresAt: { kind: "turn", turnNumber: state.turnNumber },
      consumptionPolicy: { kind: "on-application" },
      applicationPolicy: { kind: "mandatory" },
    },
    {
      replacementId: "optional-prevent-one-less",
      controllerId: defenderId,
      source: defender,
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: { name: "prevent", damageType: "physical" },
        modification: {
          type: "modify-numeric",
          property: "power",
          op: "subtract",
          amount: 1,
          target: { selector: "self" },
          duration: "permanent",
        },
        duration: "this-turn",
      },
      createdByEventId: null,
      expiresAt: { kind: "turn", turnNumber: state.turnNumber },
      consumptionPolicy: { kind: "on-opportunity" },
      applicationPolicy: { kind: "may-apply", followUps: [] },
    },
  );
  const options = {
    triggerContext: { evaluateStateCondition: () => true },
    legalTargets: () => [],
    evaluateAmount: (_state: Readonly<FabMatchState>, amount: unknown) =>
      typeof amount === "number" ? amount : null,
    randomIndex: () => 0,
  } as const;
  const suspended = executeFabEventTransaction(
    state,
    (processId) => [
      {
        name: "deal-damage" as const,
        processId,
        cause: { kind: "rule" as const, rule: "newly-active-optional", controllerId: attackerId },
        controllerId: attackerId,
        source,
        affected: [],
        bindings: {},
        data: {
          source,
          target: { kind: "hero" as const, playerId: defenderId },
          amount: 3,
          damageType: "physical" as const,
        },
      },
    ],
    options,
  ).state;
  return { suspended, defenderId, options };
}

describe("bounded optional replacement opportunities", () => {
  it("persists the exact discard receipt before its conditional wager consequence", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimblismBlue, snatchRed, pummelRed, nimblismBlue], deck: 8 },
      { hero: dash, hand: 4, deck: 8 },
      { autoPassPriority: false },
    );
    let state = game.getState();
    const attackerId = game.as(bravo).id;
    const defenderId = game.as(dash).id;
    const source = snapshotObject(
      state,
      state.players[attackerId]!.heroCardId!,
      attackerId,
      "heroZone",
    );
    state.replacementEffects.push({
      replacementId: "generic-wager-if-you-do",
      controllerId: attackerId,
      source,
      effect: {
        type: "replacement",
        replacementKind: "outcome",
        replaces: { name: "wager-loss" },
        modification: {
          type: "optional",
          effect: {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
            },
            outputBinding: "it",
          },
          then: { type: "win-wager" },
        },
        duration: "this-turn",
      },
      createdByEventId: null,
      expiresAt: { kind: "turn", turnNumber: state.turnNumber },
      consumptionPolicy: { kind: "on-opportunity" },
      applicationPolicy: {
        kind: "may-apply",
        cost: { kind: "discard-hand-card" },
        followUps: [],
      },
    });
    state = executeFabEventTransaction(
      state,
      (processId) => [
        {
          name: "wager-loss",
          processId,
          cause: { kind: "rule", rule: "receipt-test", controllerId: defenderId },
          controllerId: defenderId,
          source,
          affected: [source],
          bindings: { winner: defenderId, loser: attackerId },
          data: {
            wagerId: "wager-process-receipt-test",
            attack: source,
            attackingPlayerId: attackerId,
            defendingPlayerId: defenderId,
            winnerId: defenderId,
            loserId: attackerId,
            prize: null,
          },
        },
      ],
      transactionOptions,
    ).state;
    const optional = state.decision;
    if (!optional || optional.continuation.kind !== "replacement-player") {
      throw new Error("expected optional wager replacement decision");
    }
    state = resumeFabReplacementPlayerChoice(
      state,
      optional.continuation,
      { kind: "option", optionIds: ["generic-wager-if-you-do"] },
      transactionOptions,
    );
    const target = state.decision;
    if (!target || target.continuation.kind !== "replacement-cost-target") {
      throw new Error("expected replacement discard target decision");
    }
    const discardId = state.containers.zonesByPlayerId[attackerId]!.hand[0]!;
    const beforeCost = restoreFabMatchSnapshot(
      serializeFabMatchSnapshot(state),
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    );
    const costOnly = commitFabReplacementCostTarget(
      state,
      target.continuation,
      { kind: "entity-target", instanceIds: [discardId] },
      transactionOptions,
    );
    expect(costOnly.deferred).toBe(false);
    expect(costOnly.state.containers.zonesByPlayerId[attackerId]!.graveyard).toContain(discardId);
    expect(Object.values(costOnly.state.rulesProcess?.replacementCostCommitReceipts ?? {})).toEqual(
      [expect.objectContaining({ status: "committed", eventId: expect.stringMatching(/^event-/) })],
    );
    const restored = restoreFabMatchSnapshot(
      serializeFabMatchSnapshot(costOnly.state),
      createFabMatchContext(costOnly.state.cardDefinitions, costOnly.state.publicCardIdentities),
    );
    const receipts: string[] = [];
    const finished = resumeFabReplacementCostConsequence(restored, target.continuation, {
      ...transactionOptions,
      onCommittedEvents: (events) => receipts.push(...events.map((event) => event.name)),
    });
    expect(receipts).toContain("wager-win");
    expect(finished.replacementEffects).toHaveLength(0);

    // A replacement that cancels the exact discard makes the cost fail. The
    // persisted failed receipt survives restore and the original wager winner
    // remains authoritative.
    beforeCost.replacementEffects.push({
      replacementId: "generic-cancel-discard-cost",
      controllerId: defenderId,
      source,
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: { name: "discard" },
        modification: { type: "cancel-event" },
        duration: "this-turn",
      },
      createdByEventId: null,
      expiresAt: { kind: "turn", turnNumber: beforeCost.turnNumber },
      consumptionPolicy: { kind: "on-application" },
      applicationPolicy: { kind: "mandatory" },
    });
    const failedCost = commitFabReplacementCostTarget(
      beforeCost,
      target.continuation,
      { kind: "entity-target", instanceIds: [discardId] },
      transactionOptions,
    );
    expect(failedCost.state.containers.zonesByPlayerId[attackerId]!.hand).toContain(discardId);
    expect(
      Object.values(failedCost.state.rulesProcess?.replacementCostCommitReceipts ?? {}),
    ).toEqual([expect.objectContaining({ status: "failed" })]);
    const originalReceipts: Array<{ readonly name: string; readonly actorId?: string }> = [];
    resumeFabReplacementCostConsequence(
      restoreFabMatchSnapshot(
        serializeFabMatchSnapshot(failedCost.state),
        createFabMatchContext(
          failedCost.state.cardDefinitions,
          failedCost.state.publicCardIdentities,
        ),
      ),
      target.continuation,
      {
        ...transactionOptions,
        onCommittedEvents: (events) =>
          originalReceipts.push(
            ...events.map((event) => ({
              name: event.name,
              ...(event.name === "wager-win" ? { actorId: event.data.actorId } : {}),
            })),
          ),
      },
    );
    expect(originalReceipts).toContainEqual({ name: "wager-win", actorId: defenderId });
  });

  it.each([
    { accepted: false, expectedLife: LIFE - 1 },
    { accepted: true, expectedLife: LIFE - 2 },
  ])(
    "persists and resumes an optional replacement that becomes active after another replacement: $accepted",
    ({ accepted, expectedLife }) => {
      const { suspended, defenderId, options } = setupNewlyActiveOptionalPrevention();
      expect(suspended.players[defenderId]!.life).toBe(LIFE);
      expect(suspended.decision).toMatchObject({
        actorId: defenderId,
        kind: "option",
        options: [{ id: "optional-prevent-one-less" }],
        continuation: { kind: "replacement-player" },
      });
      const decision = suspended.decision;
      if (!decision || decision.continuation.kind !== "replacement-player") {
        throw new Error("expected newly active optional replacement decision");
      }
      const restored = restoreFabMatchSnapshot(
        serializeFabMatchSnapshot(suspended),
        createFabMatchContext(suspended.cardDefinitions, suspended.publicCardIdentities),
      );
      const answer = {
        kind: "option" as const,
        optionIds: accepted ? ["optional-prevent-one-less"] : [],
      };
      const resumed = resumeFabReplacementPlayerChoice(
        restored,
        decision.continuation,
        answer,
        options,
      );
      const replayed = resumeFabReplacementPlayerChoice(
        restoreFabMatchSnapshot(
          serializeFabMatchSnapshot(suspended),
          createFabMatchContext(suspended.cardDefinitions, suspended.publicCardIdentities),
        ),
        decision.continuation,
        answer,
        options,
      );

      expect(replayed).toEqual(resumed);
      expect(resumed.players[defenderId]!.life).toBe(expectedLife);
      expect(resumed.replacementEffects).toEqual([]);
    },
  );

  it("consumes a declined next-time opportunity and resumes identically after restore", () => {
    const game = setupBoundedOptionalPrevention();
    presentDamage(game);
    const suspended = game.getState();
    const restored = restoreFabMatchSnapshot(
      serializeFabMatchSnapshot(suspended),
      createFabMatchContext(suspended.cardDefinitions, suspended.publicCardIdentities),
    );
    const resumed = FabTestEngine.fromState(restored);

    resumed.as(bravo).chooseOptions();

    expect(resumed.as(bravo).life()).toBe(LIFE - 5);
    expect(resumed.getState().replacementEffects).not.toContainEqual(
      expect.objectContaining({ replacementId: "generic-next-optional-prevention" }),
    );
    const after = resumed.getState();
    expect(
      serializeFabMatchSnapshot(
        restoreFabMatchSnapshot(
          serializeFabMatchSnapshot(after),
          createFabMatchContext(after.cardDefinitions, after.publicCardIdentities),
        ),
      ),
    ).toEqual(serializeFabMatchSnapshot(after));
  });

  it("consumes the same bounded effect when its optional modification is accepted", () => {
    const game = setupBoundedOptionalPrevention();
    const choice = presentDamage(game);
    game.as(bravo).chooseOptions(choice.options[0]!.id);

    expect(game.as(bravo).life()).toBe(LIFE - 4);
    expect(game.getState().replacementEffects).not.toContainEqual(
      expect.objectContaining({ replacementId: "generic-next-optional-prevention" }),
    );
  });

  it("fails closed on the retired boolean replacement-consumption snapshot shape", () => {
    const state = setupBoundedOptionalPrevention().getState();
    const snapshot = serializeFabMatchSnapshot(state);
    const replacement = snapshot.replacementEffects[0]!;
    const { consumptionPolicy: _retired, ...withoutPolicy } = replacement;
    void _retired;

    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        replacementEffects: [{ ...withoutPolicy, consumeOnUse: true }],
      }),
    ).toBe(false);
  });
});
