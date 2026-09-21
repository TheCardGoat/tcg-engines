import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine } from "../testing/test-engine.ts";
import { FAB_RUNTIME_TEST_RECEIPT } from "../runtime-access.ts";
import type { FabCardDefinitionInput } from "../cards.ts";
import {
  bravo,
  cintariSellsword,
  dash,
  nimblismBlue,
  snatchRed,
  unmovableRed,
} from "./fixtures.ts";
import { quoteFabAttackTargets, quoteFabDefense, quoteFabPlay } from "./legality-quotes.ts";
import { executeFabPlayQuote } from "../procedures/play-card/index.ts";
import type { FabEventTransactionOptions } from "../kernel/process-runner/index.ts";
import { listLegalCommands } from "../automation/legal-commands.ts";
import { demonboundGloombladeRed } from "../../../cards/src/cards/actions/demonbound-gloomblade.ts";
import { runechantOfLustYellow } from "../../../cards/src/cards/instants/runechant-of-lust.ts";
import { stickyFingers } from "../../../cards/src/cards/companions/sticky-fingers.ts";
import { parableOfHumilityYellow } from "../../../cards/src/cards/instants/parable-of-humility.ts";
import { spreadingPlagueYellow } from "../../../cards/src/cards/attack-reactions/spreading-plague.ts";

const transactionOptions: FabEventTransactionOptions = {
  triggerContext: { evaluateStateCondition: () => true },
  legalTargets: () => [],
  evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
  randomIndex: () => 0,
};

const freezeOpposingHands: FabCardDefinitionInput = {
  canonicalId: "test:freeze-opposing-hands",
  name: "Freeze Opposing Hands",
  types: ["Action", "Aura"],
  abilities: [
    {
      id: "test:freeze-opposing-hands-a1",
      kind: "static",
      staticKind: "continuous",
      text: "Cards in opponents' hands are frozen.",
      effect: {
        type: "freeze",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["hand"],
          count: { type: "all" },
        },
        duration: "while-in-arena",
      },
    },
  ],
};

describe("state-versioned FAB legality quotes", () => {
  it.each([
    {
      label: "attack reaction",
      reaction: spreadingPlagueYellow,
      owner: "attacker" as const,
      cost: 1,
    },
    {
      label: "defense reaction",
      reaction: unmovableRed,
      owner: "defender" as const,
      cost: 3,
    },
  ])("quotes and enforces the resource cost of a $label", ({ reaction, owner, cost }) => {
    const insufficient = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, ...(owner === "attacker" ? [reaction] : [])],
        resourcePoints: 0,
        deck: 4,
      },
      { hero: dash, hand: owner === "defender" ? [reaction] : [], resourcePoints: 0, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    insufficient.as(bravo).attackWith(snatchRed);
    insufficient.as(dash).defendWith([]);
    insufficient.passBoth();
    if (owner === "defender") insufficient.as(bravo).pass();

    const actor = insufficient.as(owner === "attacker" ? bravo : dash);
    const instanceId = actor.findCardInZone("hand", reaction);
    expect(
      quoteFabPlay(insufficient.getState(), { actorId: actor.id, instanceId, from: "hand" }),
    ).toMatchObject({
      allowed: false,
      reasonCode: "insufficient_resources",
      resourceCost: cost,
      actionPointCost: 0,
      timing: owner === "attacker" ? "attack-reaction" : "defense-reaction",
    });

    const payable = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, ...(owner === "attacker" ? [reaction, nimblismBlue] : [])],
        resourcePoints: 0,
        deck: 4,
      },
      {
        hero: dash,
        hand: owner === "defender" ? [reaction, nimblismBlue] : [],
        resourcePoints: 0,
        deck: 4,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    payable.as(bravo).attackWith(snatchRed);
    payable.as(dash).defendWith([]);
    payable.passBoth();
    if (owner === "defender") payable.as(bravo).pass();

    const payableActor = payable.as(owner === "attacker" ? bravo : dash);
    const payableInstanceId = payableActor.findCardInZone("hand", reaction);
    expect(
      quoteFabPlay(payable.getState(), {
        actorId: payableActor.id,
        instanceId: payableInstanceId,
        from: "hand",
      }),
    ).toMatchObject({ allowed: true, resourceCost: cost });
  });

  it("quotes an evaluated attack without dispatch probing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hand: [], hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actorId = game.as(bravo).id;
    const instanceId = game.as(bravo).findCardInZone("hand", snatchRed);
    const quote = quoteFabPlay(game.getState(), { actorId, instanceId, from: "hand" });

    expect(quote).toMatchObject({
      allowed: true,
      stateID: game.getStateID(),
      object: { instanceId },
      allowedOrigins: ["hand"],
      resourceCost: 0,
      actionPointCost: 1,
      isAttack: true,
      timing: "action",
      effectIds: [],
    });
  });

  it("rejects a quote after its authoritative state version changes", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hand: [], hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actorId = game.as(bravo).id;
    const instanceId = game.as(bravo).findCardInZone("hand", snatchRed);
    const quote = quoteFabPlay(game.getState(), { actorId, instanceId, from: "hand" });
    const changed = structuredClone(game.getState());
    changed.stateID += 1;

    const result = executeFabPlayQuote(
      changed,
      quote,
      { actorId, instanceId, from: "hand" },
      transactionOptions,
    );
    expect(result).toMatchObject({ kind: "failed", errorCode: "stale_play_quote" });
  });

  it("denies play through the evaluator's freeze rule instead of a player flag", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hand: [], hero: dash, arena: [freezeOpposingHands], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actorId = game.as(bravo).id;
    const instanceId = game.as(bravo).findCardInZone("hand", snatchRed);

    expect(quoteFabPlay(game.getState(), { actorId, instanceId, from: "hand" })).toMatchObject({
      allowed: false,
      reasonCode: "restricted_by_rule",
      effectIds: [expect.any(String)],
    });
  });

  it("quotes defense from the evaluated attack and defender properties", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, hand: [nimblismBlue], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    const actorId = game.as(dash).id;
    const instanceId = game.as(dash).findCardInZone("hand", nimblismBlue);

    expect(quoteFabDefense(game.getState(), { actorId, instanceIds: [instanceId] })).toMatchObject({
      allowed: true,
      stateID: game.getStateID(),
      defenders: [{ ref: { instanceId }, origin: "hand" }],
      attack: { instanceId: expect.any(String) },
    });
  });

  it("quotes opposing heroes and attackable arena objects without raw card reads", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hand: [], hero: dash, arena: [cintariSellsword], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actorId = game.as(bravo).id;
    const attackInstanceId = game.as(bravo).findCardInZone("hand", snatchRed);
    const allyId = game.as(dash).findCardInZone("arena", cintariSellsword);

    expect(quoteFabAttackTargets(game.getState(), { actorId, attackInstanceId })).toMatchObject({
      allowed: true,
      candidates: [
        { targetId: game.as(dash).id, kind: "hero", defendingPlayerId: game.as(dash).id },
        {
          targetId: allyId,
          kind: "ally",
          defendingPlayerId: game.as(dash).id,
          object: { instanceId: allyId },
        },
      ],
    });
  });

  it("carries an ally target from legal commands through the resolved attack event", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hand: [], hero: dash, arena: [cintariSellsword], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const runtime = game.getRuntime();
    const actorId = game.as(bravo).id;
    const defenderId = game.as(dash).id;
    const allyId = game.as(dash).findCardInZone("arena", cintariSellsword);
    const command = listLegalCommands(runtime, actorId).find(
      (candidate) => candidate.move === "begin-play" && candidate.payload.target === allyId,
    );

    expect(command).toBeDefined();
    expect(dispatchTestCommand(runtime, command!.move, actorId, command!.payload).accepted).toBe(
      true,
    );
    expect(dispatchTestCommand(runtime, "pass", actorId, {}).accepted).toBe(true);
    expect(dispatchTestCommand(runtime, "pass", defenderId, {}).accepted).toBe(true);
    expect(runtime.getState().combat?.activeLink).toMatchObject({
      defendingPlayerId: defenderId,
      attackTargetRef: {
        kind: "object",
        ref: { instanceId: allyId },
        controllerIdAtDeclaration: defenderId,
      },
    });
    expect(
      runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.find((event) => event.name === "attack")
        ?.data,
    ).toMatchObject({
      target: { kind: "ally", ref: { instanceId: allyId }, controllerId: defenderId },
      defendingPlayerId: defenderId,
    });
  });

  it("offers the no-defense pass alias when a non-hero attack target reaches Defend", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hand: [nimblismBlue], hero: dash, arena: [cintariSellsword], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const attacker = game.as(bravo);
    const defender = game.as(dash);
    const allyId = defender.findCardInZone("arena", cintariSellsword);
    attacker.play(snatchRed, { target: allyId });
    game.passBoth();
    game.passBoth();

    expect(game.combat()).toMatchObject({
      step: "defend",
      defenseDeclarationPending: true,
      activeLink: {
        attackTargetRef: {
          kind: "object",
          ref: { instanceId: allyId },
          controllerIdAtDeclaration: defender.id,
        },
      },
    });
    const ordinaryDefenderId = defender.findCardInZone("hand", nimblismBlue);
    expect(
      quoteFabDefense(game.getState(), {
        actorId: defender.id,
        instanceIds: [ordinaryDefenderId],
      }),
    ).toMatchObject({ allowed: false, reasonCode: "ally_target_no_defend" });

    const legal = listLegalCommands(game.getRuntime(), defender.id);
    expect(
      legal.some(
        (command) =>
          command.move === "defend" &&
          Array.isArray(command.payload.instanceIds) &&
          command.payload.instanceIds.includes(ordinaryDefenderId),
      ),
    ).toBe(false);
    const noDefense = legal.find(
      (command) => command.move === "pass" && command.label === "Do not defend",
    );
    expect(noDefense).toBeDefined();
    defender.exec(noDefense!);
    expect(game.combat()?.defenseDeclarationPending).toBe(false);
    expect(attacker.hasPriority()).toBe(true);
  });

  it("permits spectra targets but Usurp grants no permission to attack other auras or Perched objects", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [demonboundGloombladeRed], deck: 4 },
      {
        hand: [],
        hero: dash,
        arena: [parableOfHumilityYellow, runechantOfLustYellow, stickyFingers],
        deck: 4,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actorId = game.as(bravo).id;
    const attackInstanceId = game.as(bravo).findCardInZone("hand", demonboundGloombladeRed);
    const spectraId = game.as(dash).findCardInZone("arena", parableOfHumilityYellow);
    const auraId = game.as(dash).findCardInZone("arena", runechantOfLustYellow);
    const perchedId = game.as(dash).findCardInZone("arena", stickyFingers);
    const targets = quoteFabAttackTargets(game.getState(), { actorId, attackInstanceId });

    expect(targets.candidates).toEqual(
      expect.arrayContaining([expect.objectContaining({ targetId: spectraId, kind: "spectra" })]),
    );
    expect(targets.candidates.some((candidate) => candidate.targetId === perchedId)).toBe(false);
    expect(targets.candidates.some((candidate) => candidate.targetId === auraId)).toBe(false);
  });
});
import { dispatchTestCommand } from "../testing/test-command.ts";
