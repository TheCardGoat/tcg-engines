import { describe, expect, it } from "vitest";
import { registerFabCardDefinition } from "../cards.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { FabMatchRuntime } from "../runtime.ts";
import { FAB_RUNTIME_TEST_RECEIPT } from "../runtime-access.ts";
import { submitFabDecision, type FabDecisionResumeOptions } from "../procedures/decisions/index.ts";
import { beginFabPlayProcedure } from "../procedures/play-card/index.ts";
import type { FabEventTransactionOptions } from "../kernel/process-runner/index.ts";
import { registerFabTestObject } from "../testing/test-fixtures.ts";
import { buildFabRulesView } from "./state-rules-view.ts";
import type { CommittedEvent } from "./events.ts";

const transactionOptions: FabEventTransactionOptions = {
  triggerContext: { evaluateStateCondition: () => true },
  legalTargets: () => [],
  evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
  randomIndex: () => 0,
};

const resumeOptions: FabDecisionResumeOptions = {
  ...transactionOptions,
};

function setup(cost: number, pitchCards: number) {
  const canonicalIdsByInstance: Record<string, string> = { action1: "action" };
  const owned = ["action1"];
  for (let index = 1; index <= pitchCards; index += 1) {
    canonicalIdsByInstance[`pitch${index}`] = "pitch";
    owned.push(`pitch${index}`);
  }
  const state = FabTestEngine.createStateForRulesTest({
    seed: "play-procedure",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: { canonicalIdsByInstance, owners: { p1: owned, p2: [] } },
    cardDefinitions: {
      action: {
        canonicalId: "action",
        name: "Test Action",
        types: ["Action"],
        cost,
        abilities: [
          {
            id: "action-a1",
            kind: "resolution",
            text: "Gain 1 life.",
            effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
          },
        ],
      },
      pitch: { canonicalId: "pitch", name: "Blue Pitch", types: ["Action"], pitch: 3 },
    },
  });
  for (const playerId of ["p1", "p2"] as const) {
    const heroId = `${playerId}-hero`;
    const canonicalId = `${playerId}-hero-definition`;
    state.cardDefinitions[canonicalId] = registerFabCardDefinition({
      canonicalId,
      name: `${playerId} Hero`,
      types: ["Hero"],
    });
    registerFabTestObject(state, heroId, canonicalId, playerId);
    state.containers.zonesByPlayerId[playerId]!.heroZone = [heroId];
    state.players[playerId]!.heroCardId = heroId;
  }
  state.containers.zonesByPlayerId["p1"]!.hand = owned;
  return state;
}

function submitPayment(state: ReturnType<typeof setup>, instanceId: string) {
  const decision = state.decision!;
  return submitFabDecision(
    state,
    "p1",
    {
      decisionId: decision.decisionId,
      stateVersion: decision.stateVersion,
      answer: { kind: "payment", instanceIds: [instanceId] },
    },
    resumeOptions,
  );
}

describe("persisted FAB play-card procedure", () => {
  it("atomically announces, pays, plays, and creates a normal card layer", () => {
    const state = setup(0, 0);
    const result = beginFabPlayProcedure(
      state,
      { actorId: "p1", instanceId: "action1", from: "hand" },
      transactionOptions,
    );
    expect(result.kind).toBe("advanced");
    if (result.kind !== "advanced") return;
    expect(result.state.players.p1).toMatchObject({ actionPoints: 0, resourcePoints: 0 });
    expect(result.state.containers.zonesByPlayerId["p1"]!).toMatchObject({
      hand: [],
      stack: ["action1"],
    });
    expect(result.state.rulesStack).toMatchObject([
      {
        kind: "card",
        instanceId: "action1",
        resolutionPlan: { steps: [{ abilityIds: ["action-a1"] }] },
      },
    ]);
    expect(result.state).not.toHaveProperty("committedEvents");
  });

  it("declares a hero target, resolves an attack layer to the combat chain, and emits attack", () => {
    const state = setup(0, 0);
    state.cardDefinitions.action = registerFabCardDefinition({
      canonicalId: "action",
      name: "Test Attack",
      types: ["Action", "Attack"],
      cost: 0,
      power: 4,
    });
    registerFabTestObject(state, "defender1", "defender", "p2");
    state.cardDefinitions.defender = registerFabCardDefinition({
      canonicalId: "defender",
      name: "Test Defender",
      types: ["Action"],
      defense: 3,
    });
    state.containers.zonesByPlayerId["p2"]!.hand = ["defender1"];
    const runtime = new FabMatchRuntime(state);
    expect(
      dispatchTestCommand(runtime, "begin-play", "p1", { instanceId: "action1" }).accepted,
    ).toBe(true);
    expect(runtime.getState().rulesStack).toMatchObject([
      {
        kind: "card",
        instanceId: "action1",
        attackTarget: { kind: "hero", playerId: "p2" },
      },
    ]);
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.stack).toEqual(["action1"]);
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-card",
      "spend-assets",
      "attack-target-declared",
      "play",
    ]);

    expect(dispatchTestCommand(runtime, "pass", "p1", {}).accepted).toBe(true);
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-card",
      "spend-assets",
      "attack-target-declared",
      "play",
      "move-zone",
      "enter-arena",
      "enter-or-leave-arena",
      "attack",
      "remove-rules-layer",
    ]);
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.combatChain).toEqual(["action1"]);
    expect(runtime.getState().combat).toMatchObject({
      open: true,
      step: "attack",
      activeLink: {
        activeAttack: { kind: "card", sourceObjectId: "action1" },
        attackingPlayerId: "p1",
        defendingPlayerId: "p2",
      },
    });
    const attackRecord = runtime.getState().objects.action1!;
    expect(
      buildFabRulesView(runtime.getState()).object({
        instanceId: attackRecord.instanceId,
        incarnation: attackRecord.incarnation,
      })?.current.numeric.power,
    ).toBe(4);
    const defendingLife = runtime.getState().players.p2!.life;
    expect(dispatchTestCommand(runtime, "pass", "p1", {}).accepted).toBe(true);
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(
      dispatchTestCommand(runtime, "defend", "p2", { instanceIds: ["defender1"] }).accepted,
    ).toBe(true);
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.at(-1)?.name).toBe(
      "defense-declaration-complete",
    );
    expect(dispatchTestCommand(runtime, "pass", "p1", {}).accepted).toBe(true);
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(dispatchTestCommand(runtime, "pass", "p1", {}).accepted).toBe(true);
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().combat).toMatchObject({
      step: "damage",
      activeLink: {
        resolvedAttackLki: { power: 4, basePower: 4, totalDefense: 3 },
        damage: {
          status: "resolved",
          outcomes: [{ damageDealtByActiveAttack: 1 }],
        },
      },
    });
    expect(runtime.getState().players.p2!.life).toBe(defendingLife - 1);
    expect(
      runtime[FAB_RUNTIME_TEST_RECEIPT]()
        .committedEvents.map((event) => event.name)
        .slice(-4),
    ).toEqual(["deal-damage", "dealt-damage", "resolve-combat-damage", "hit"]);
    const resolveDamage = runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.find(
      (event): event is CommittedEvent<"resolve-combat-damage"> =>
        event.name === "resolve-combat-damage",
    );
    expect(resolveDamage?.data.defendedBy).toEqual(["defender1"]);
    expect(resolveDamage?.data).toMatchObject({
      attackPower: 4,
      totalDefense: 3,
      defenders: [{ defense: 3 }],
    });
    expect(dispatchTestCommand(runtime, "pass", "p1", {}).accepted).toBe(true);
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().combat?.step).toBe("resolution");
    expect(dispatchTestCommand(runtime, "pass", "p1", {}).accepted).toBe(true);
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().combat).toBeNull();
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.graveyard).toContain("action1");
    expect(runtime.getState().containers.zonesByPlayerId["p2"]!.graveyard).toContain("defender1");
    const eventNames = runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map(
      (event) => event.name,
    );
    const closeEvents = eventNames.slice(eventNames.lastIndexOf("chain-link-resolve"));
    expect(closeEvents).toEqual([
      "chain-link-resolve",
      "combat-chain-close",
      "move-zone",
      "leave-arena",
      "enter-or-leave-arena",
      "put-into-graveyard",
      "move-zone",
      "leave-arena",
      "enter-or-leave-arena",
      "put-into-graveyard",
    ]);
  });

  it("persists and restores an any-hero target before resolving damage", () => {
    const state = setup(0, 0);
    state.cardDefinitions.action = registerFabCardDefinition({
      canonicalId: "action",
      name: "Test Arcane Spell",
      types: ["Wizard", "Action"],
      cost: 0,
      abilities: [
        {
          id: "action-a1",
          kind: "resolution",
          text: "Deal 2 arcane damage to target hero.",
          effect: {
            type: "deal-damage",
            damageType: "arcane",
            amount: 2,
            target: { selector: "any-hero" },
          },
        },
      ],
    });
    let runtime = new FabMatchRuntime(state);
    const lifeBefore = runtime.getState().players.p2!.life;

    expect(
      dispatchTestCommand(runtime, "begin-play", "p1", { instanceId: "action1" }).accepted,
    ).toBe(true);
    expect(runtime.getState().decision).toMatchObject({
      kind: "entity-target",
      actorId: "p1",
      candidates: [{ instanceId: "p1" }, { instanceId: "p2" }],
      continuation: { kind: "play-target" },
    });

    runtime = new FabMatchRuntime(structuredClone(runtime.getState()));
    const decision = runtime.getState().decision!;
    expect(
      dispatchTestCommand(runtime, "answer-decision", "p1", {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "entity-target", instanceIds: ["p2"] },
      }).accepted,
    ).toBe(true);
    expect(runtime.getState().rulesStack).toMatchObject([
      {
        kind: "card",
        resolutionPlan: {
          steps: [{ targets: { "effect-0:target": [{ kind: "player", playerId: "p2" }] } }],
        },
      },
    ]);

    expect(dispatchTestCommand(runtime, "pass", "p1", {}).accepted).toBe(true);
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().players.p2!.life).toBe(lifeBefore - 2);
    expect(
      runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name),
    ).toContain("deal-damage");
  });

  it("persists non-triggered modal declarations before payment and stores them on the card layer", () => {
    const state = setup(0, 0);
    state.cardDefinitions.action = registerFabCardDefinition({
      canonicalId: "action",
      name: "Modal Action",
      types: ["Action"],
      cost: 0,
      abilities: [
        {
          id: "modal-a1",
          kind: "modal",
          text: "Choose 1.",
          modal: { choose: 1 },
          modes: [
            {
              id: "life",
              kind: "resolution",
              text: "Gain 1 life.",
              effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
            },
            {
              id: "draw",
              kind: "resolution",
              text: "Draw a card.",
              effect: { type: "draw", count: 1, player: "controller" },
            },
          ],
        },
      ],
    });
    const started = beginFabPlayProcedure(
      state,
      { actorId: "p1", instanceId: "action1", from: "hand" },
      transactionOptions,
    );
    expect(started.kind).toBe("advanced");
    if (started.kind !== "advanced") return;
    expect(started.state.decision).toMatchObject({
      kind: "option",
      continuation: { kind: "play-mode" },
    });

    const decision = started.state.decision!;
    const resumed = submitFabDecision(
      structuredClone(started.state),
      "p1",
      {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "option", optionIds: ["life"] },
      },
      resumeOptions,
    );
    expect(resumed.accepted).toBe(true);
    if (!resumed.accepted) return;
    expect(resumed.state.rulesStack[0]).toMatchObject({ kind: "card", modes: ["life"] });
  });

  it("lets any-number modal declaration pick 0..N modes, including none", () => {
    const state = setup(0, 0);
    state.cardDefinitions.action = registerFabCardDefinition({
      canonicalId: "action",
      name: "Any-Number Modal Action",
      types: ["Action"],
      cost: 0,
      abilities: [
        {
          id: "modal-a1",
          kind: "modal",
          text: "Choose any number.",
          modal: { choose: { type: "any-number" } },
          modes: [
            {
              id: "life",
              kind: "resolution",
              text: "Gain 1 life.",
              effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
            },
            {
              id: "draw",
              kind: "resolution",
              text: "Draw a card.",
              effect: { type: "draw", count: 1, player: "controller" },
            },
          ],
        },
      ],
    });
    const started = beginFabPlayProcedure(
      state,
      { actorId: "p1", instanceId: "action1", from: "hand" },
      transactionOptions,
    );
    expect(started.kind).toBe("advanced");
    if (started.kind !== "advanced") return;
    expect(started.state.decision).toMatchObject({
      kind: "option",
      min: 0,
      max: 2,
      continuation: { kind: "play-mode" },
    });

    const none = submitFabDecision(
      structuredClone(started.state),
      "p1",
      {
        decisionId: started.state.decision!.decisionId,
        stateVersion: started.state.decision!.stateVersion,
        answer: { kind: "option", optionIds: [] },
      },
      resumeOptions,
    );
    expect(none.accepted).toBe(true);
    if (!none.accepted) return;
    expect(none.state.rulesStack[0]).toMatchObject({ kind: "card", modes: [] });

    const subset = submitFabDecision(
      structuredClone(started.state),
      "p1",
      {
        decisionId: started.state.decision!.decisionId,
        stateVersion: started.state.decision!.stateVersion,
        answer: { kind: "option", optionIds: ["life"] },
      },
      resumeOptions,
    );
    expect(subset.accepted).toBe(true);
    if (!subset.accepted) return;
    expect(subset.state.rulesStack[0]).toMatchObject({ kind: "card", modes: ["life"] });
  });

  it("auto-selects every mode for a choose-all modal", () => {
    const state = setup(0, 0);
    state.cardDefinitions.action = registerFabCardDefinition({
      canonicalId: "action",
      name: "All-Modes Action",
      types: ["Action"],
      cost: 0,
      abilities: [
        {
          id: "modal-a1",
          kind: "modal",
          text: "Choose all.",
          modal: { choose: { type: "all" } },
          modes: [
            {
              id: "life",
              kind: "resolution",
              text: "Gain 1 life.",
              effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
            },
            {
              id: "draw",
              kind: "resolution",
              text: "Draw a card.",
              effect: { type: "draw", count: 1, player: "controller" },
            },
          ],
        },
      ],
    });
    const started = beginFabPlayProcedure(
      state,
      { actorId: "p1", instanceId: "action1", from: "hand" },
      transactionOptions,
    );
    expect(started.kind).toBe("advanced");
    if (started.kind !== "advanced") return;
    expect(started.state.decision).toBeFalsy();
    expect(started.state.rulesStack[0]).toMatchObject({
      kind: "card",
      modes: ["life", "draw"],
    });
  });

  it("persists required on-stack targets before committing the play", () => {
    const state = setup(0, 0);
    registerFabTestObject(state, "target1", "aura", "p2");
    state.containers.zonesByPlayerId["p2"]!.arena.push("target1");
    state.cardDefinitions.aura = registerFabCardDefinition({
      canonicalId: "aura",
      name: "Target Aura",
      types: ["Action", "Aura"],
    });
    state.cardDefinitions.action = registerFabCardDefinition({
      canonicalId: "action",
      name: "Targeted Action",
      types: ["Action"],
      cost: 0,
      abilities: [
        {
          id: "target-a1",
          kind: "resolution",
          text: "Destroy target aura.",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "opponent",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
              count: 1,
            },
          },
        },
      ],
    });
    const targetOptions: FabEventTransactionOptions = {
      ...transactionOptions,
      legalTargets: () => [
        {
          instanceId: "target1",
          label: "Target Aura",
          target: { kind: "object", ref: { instanceId: "target1", incarnation: 1 } },
        },
      ],
    };
    const declarationResumeOptions: FabDecisionResumeOptions = {
      ...resumeOptions,
      ...targetOptions,
    };
    const started = beginFabPlayProcedure(
      state,
      { actorId: "p1", instanceId: "action1", from: "hand" },
      targetOptions,
    );
    expect(started.kind).toBe("advanced");
    if (started.kind !== "advanced") return;
    expect(started.state.decision).toMatchObject({
      kind: "entity-target",
      continuation: { kind: "play-target" },
    });

    const decision = started.state.decision!;
    const resumed = submitFabDecision(
      structuredClone(started.state),
      "p1",
      {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "entity-target", instanceIds: ["target1"] },
      },
      declarationResumeOptions,
    );
    expect(resumed.accepted).toBe(true);
    if (!resumed.accepted) return;
    expect(resumed.state.rulesStack[0]).toMatchObject({
      kind: "card",
      resolutionPlan: {
        steps: [
          {
            targets: {
              "effect-0:target": [
                { kind: "object", ref: { instanceId: "target1", incarnation: 1 } },
              ],
            },
          },
        ],
      },
    });
  });

  it("pitches exactly one card per persisted decision and restores between payments", () => {
    const started = beginFabPlayProcedure(
      setup(4, 2),
      { actorId: "p1", instanceId: "action1", from: "hand" },
      transactionOptions,
    );
    expect(started.kind).toBe("advanced");
    if (started.kind !== "advanced") return;
    expect(started.state.decision).toMatchObject({
      kind: "payment",
      amount: 4,
      oneAtATime: true,
      label: "Pitch a card to pay 4 remaining resources for Test Action.",
    });

    const first = submitPayment(structuredClone(started.state), "pitch1");
    expect(first.accepted).toBe(true);
    if (!first.accepted) return;
    expect(first.state.decision).toMatchObject({
      kind: "payment",
      amount: 1,
      oneAtATime: true,
      label: "Pitch a card to pay 1 remaining resource for Test Action.",
    });
    expect(first.state.containers.zonesByPlayerId["p1"]!.hand).toEqual([
      "action1",
      "pitch1",
      "pitch2",
    ]);

    const second = submitPayment(structuredClone(first.state), "pitch2");
    expect(second.accepted).toBe(true);
    if (!second.accepted) return;
    expect(second.state.decision).toBeNull();
    expect(second.state.players.p1).toMatchObject({ resourcePoints: 2, actionPoints: 0 });
    expect(second.state.containers.zonesByPlayerId["p1"]!).toMatchObject({
      hand: [],
      pitch: ["pitch1", "pitch2"],
      stack: ["action1"],
    });
    expect(second.state).not.toHaveProperty("committedEvents");
  });

  it("rejects an unpayable play without changing authoritative state", () => {
    const state = setup(4, 1);
    const before = structuredClone(state);
    const result = beginFabPlayProcedure(
      state,
      { actorId: "p1", instanceId: "action1", from: "hand" },
      transactionOptions,
    );
    expect(result).toMatchObject({ kind: "failed", errorCode: "insufficient_resources" });
    expect(state).toEqual(before);
  });

  it("cancels a restored payment decision without committing its tentative journal", () => {
    const state = setup(4, 2);
    const authoritativeBefore = structuredClone(state);
    const started = beginFabPlayProcedure(
      state,
      { actorId: "p1", instanceId: "action1", from: "hand" },
      transactionOptions,
    );
    expect(started.kind).toBe("advanced");
    if (started.kind !== "advanced") return;
    const afterOnePitch = submitPayment(structuredClone(started.state), "pitch1");
    expect(afterOnePitch.accepted).toBe(true);
    if (!afterOnePitch.accepted) return;
    const decision = afterOnePitch.state.decision!;

    const cancelled = submitFabDecision(
      structuredClone(afterOnePitch.state),
      "p1",
      {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "cancel" },
      },
      resumeOptions,
    );

    expect(cancelled.accepted).toBe(true);
    if (!cancelled.accepted) return;
    expect(cancelled.state.decision).toBeNull();
    expect(cancelled.state.rulesProcess).toBeNull();
    expect(cancelled.state.players).toEqual(authoritativeBefore.players);
    expect(cancelled.state).not.toHaveProperty("committedEvents");
    expect(cancelled.state.rulesStack).toEqual([]);
  });

  it("runs the production move sequence through payment, normal priority, and event resolution", () => {
    const runtime = new FabMatchRuntime(setup(4, 2));
    const lifeBefore = runtime.getState().players.p1!.life;
    expect(
      dispatchTestCommand(runtime, "begin-play", "p1", { instanceId: "action1" }).accepted,
    ).toBe(true);
    for (const instanceId of ["pitch1", "pitch2"]) {
      const decision = runtime.getState().decision!;
      expect(
        dispatchTestCommand(runtime, "answer-decision", "p1", {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: [instanceId] },
        }).accepted,
      ).toBe(true);
    }
    expect(runtime.getState().rulesStack).toMatchObject([{ kind: "card", instanceId: "action1" }]);
    expect(dispatchTestCommand(runtime, "pass", "p1", {}).accepted).toBe(true);
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().players.p1!.life).toBe(lifeBefore + 1);
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.graveyard).toEqual(["action1"]);
    expect(runtime.getState().rulesStack).toEqual([]);
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-card",
      "pitch",
      "pitch",
      "spend-assets",
      "play",
      "gain-life",
      "move-zone",
      "put-into-graveyard",
      "remove-rules-layer",
    ]);
  });

  it("is deterministic across identical runs and restoration at every payment decision", () => {
    const run = (restoreAtDecisions: boolean) => {
      let runtime = new FabMatchRuntime(setup(4, 2));
      expect(
        dispatchTestCommand(runtime, "begin-play", "p1", { instanceId: "action1" }).accepted,
      ).toBe(true);
      for (const instanceId of ["pitch1", "pitch2"]) {
        if (restoreAtDecisions) runtime = new FabMatchRuntime(structuredClone(runtime.getState()));
        const decision = runtime.getState().decision!;
        expect(
          dispatchTestCommand(runtime, "answer-decision", "p1", {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "payment", instanceIds: [instanceId] },
          }).accepted,
        ).toBe(true);
      }
      expect(dispatchTestCommand(runtime, "pass", "p1", {}).accepted).toBe(true);
      expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
      return runtime.getState();
    };

    expect(run(true)).toEqual(run(false));
  });

  it("restores a random-discard additional cost without changing its event or result", () => {
    const makeState = () => {
      const state = setup(4, 3);
      const action = state.cardDefinitions.action!;
      state.cardDefinitions.action = registerFabCardDefinition({
        ...action,
        base: {
          ...action.base,
          abilities: [
            {
              id: "action-random-cost",
              kind: "static",
              staticKind: "play",
              text: "As an additional cost, discard a random card.",
              playEffect: {
                role: "additional-cost",
                cost: { class: "effect", type: "discard", count: 1, random: true },
              },
            },
            ...action.base.abilities,
          ],
        },
      });
      return state;
    };
    const run = (restoreAtDecisions: boolean) => {
      let runtime = new FabMatchRuntime(makeState());
      expect(
        dispatchTestCommand(runtime, "begin-play", "p1", { instanceId: "action1" }).accepted,
      ).toBe(true);
      for (const instanceId of ["pitch1", "pitch2"]) {
        if (restoreAtDecisions) runtime = new FabMatchRuntime(structuredClone(runtime.getState()));
        const decision = runtime.getState().decision!;
        expect(
          dispatchTestCommand(runtime, "answer-decision", "p1", {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "payment", instanceIds: [instanceId] },
          }).accepted,
        ).toBe(true);
      }
      return runtime.getState();
    };

    const restored = run(true);
    expect(restored).toEqual(run(false));
    expect(restored.containers.zonesByPlayerId["p1"]!.graveyard).toEqual(["pitch3"]);
    expect(restored).not.toHaveProperty("committedEvents");
  });
});
import { dispatchTestCommand } from "../testing/test-command.ts";
