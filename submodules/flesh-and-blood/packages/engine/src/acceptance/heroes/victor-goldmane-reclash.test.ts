/**
 * HVY047/HVY048 a2 — CR 8.5.45–8.5.45d.
 *
 * A provisional clash outcome is replaceable before winner observations and
 * its prize. Victor's exact Gold and one exact original reveal are declared,
 * the cost commits, the selected reveal moves, and only then is a fresh clash
 * computed from the resulting deck tops.
 */
import { describe, expect, it } from "vitest";
import {
  createFabMatchContext,
  FabTestEngine,
  commitFabReplacementConsequenceTarget,
  restoreFabMatchSnapshot,
  resumeFabReplacementCostConsequence,
  serializeFabMatchSnapshot,
} from "../../index.ts";
import type { FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import { gold } from "../../../../cards/src/cards/tokens/gold.ts";
import { testOfStrengthRed } from "../../../../cards/src/cards/blocks/test-of-strength.ts";
import { victorGoldmaneHighAndMighty } from "../../../../cards/src/cards/heroes/victor-goldmane-high-and-mighty.ts";
import { victorGoldmane } from "../../../../cards/src/cards/heroes/victor-goldmane.ts";
import { disableYellow } from "../../../../cards/src/cards/actions/disable.ts";
import { heartOfFyendalBlue } from "../../../../cards/src/cards/resources/heart-of-fyendal.ts";
import { bravo, nimblismBlue, snatchRed } from "../../rules/fixtures.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;
const transactionOptions: FabEventTransactionOptions = {
  triggerContext: { evaluateStateCondition: () => true },
  legalTargets: () => [],
  evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
  randomIndex: () => 0,
};

function restore(game: FabTestEngine): FabTestEngine {
  const state = game.getState();
  return FabTestEngine.fromState(
    restoreFabMatchSnapshot(
      serializeFabMatchSnapshot(state),
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    ),
  );
}

function setup(
  hero: typeof victorGoldmane,
  options: { readonly withGold?: boolean; readonly initialOutcome?: "loss" | "tie" | "win" } = {},
) {
  const initialOutcome = options.initialOutcome ?? "loss";
  return FabTestEngine.start(
    {
      hero,
      hand: [snatchRed, snatchRed, nimblismBlue, nimblismBlue],
      arsenal: [heartOfFyendalBlue],
      arena: options.withGold === false ? [] : [gold],
      deck: [nimblismBlue, initialOutcome === "win" ? disableYellow : snatchRed],
      intellect: 0,
      actionPoints: 2,
    },
    {
      hero: bravo,
      hand: [testOfStrengthRed, testOfStrengthRed, nimblismBlue, nimblismBlue],
      arsenal: [heartOfFyendalBlue],
      deck: [
        nimblismBlue,
        initialOutcome === "loss"
          ? disableYellow
          : initialOutcome === "tie"
            ? snatchRed
            : nimblismBlue,
      ],
      intellect: 0,
    },
    manual,
  );
}

describe.each([
  ["young", victorGoldmane],
  ["adult", victorGoldmaneHighAndMighty],
] as const)("Victor Goldmane re-clash — %s", (_label, hero) => {
  it("restores at every choice, pays the exact Gold, bottoms one original reveal, re-clashes, and awards only the final winner", () => {
    let game = setup(hero);
    let Victor = game.as(hero);
    let Bravo = game.as(bravo);
    const originalBravoReveal = Bravo.cardIn("deck", disableYellow);

    Victor.attackWith(snatchRed);
    Bravo.defendWith([testOfStrengthRed]);
    const optional = game.advanceToDecision(Victor, "option");
    expect(game.committedEvents().filter((event) => event.name === "clash-win")).toHaveLength(0);

    game = restore(game);
    Victor = game.as(hero);
    Victor.chooseOptions(optional.options[0]!.id);
    expect(Victor.expectDecision("entity-target").continuation.kind).toBe(
      "replacement-cost-target",
    );

    game = restore(game);
    Victor = game.as(hero);
    Bravo = game.as(bravo);
    const paidGold = Victor.cardIn("arena", gold);
    Victor.chooseTargets(paidGold);
    expect(Victor.expectDecision("entity-target").continuation.kind).toBe(
      "replacement-consequence-target",
    );

    game = restore(game);
    Victor = game.as(hero);
    Bravo = game.as(bravo);
    Victor.chooseTargets(originalBravoReveal);
    game.helpers.resolveRestOfCombat();

    expect(Victor.zone("arena")).not.toContain(gold.canonicalId);
    expect(
      game
        .committedEvents()
        .some(
          (event) =>
            event.name === "destroy" && event.data.object.instanceId === paidGold.instanceId,
        ),
    ).toBe(true);
    expect(game.getState().containers.zonesByPlayerId[Bravo.id]!.deck[0]).toBe(
      originalBravoReveal.instanceId,
    );
    expect(game.getState().objects[originalBravoReveal.instanceId]!.history.moves).toHaveLength(1);
    expect(game.getState().lastClashWinnerId).toBe(Victor.id);
    expect(Victor.zone("arena").filter((id) => id === "token:gold")).toHaveLength(1);
    expect(Bravo.zone("arena")).not.toContain("token:gold");
    expect(game.committedEvents().filter((event) => event.name === "clash-win")).toHaveLength(1);
    expect(game.committedEvents().filter((event) => event.name === "clash")).toHaveLength(2);
    expect(game.committedEvents().filter((event) => event.name === "reveal")).toHaveLength(4);
    expect(
      game
        .committedEvents()
        .filter(
          (event) => event.name === "create" && event.data.object.canonicalId === "token:gold",
        ),
    ).toHaveLength(1);
  });

  it("declines the one-shot opportunity without destroying Gold or changing the original loss", () => {
    const game = setup(hero);
    const Victor = game.as(hero);
    const Bravo = game.as(bravo);
    const paidGold = Victor.cardIn("arena", gold);
    const originalBravoReveal = Bravo.cardIn("deck", disableYellow);

    Victor.attackWith(snatchRed);
    Bravo.defendWith([testOfStrengthRed]);
    game.advanceToDecision(Victor, "option");
    Victor.chooseOptions();
    game.helpers.resolveRestOfCombat();

    expect(Victor.cardIn("arena", gold).instanceId).toBe(paidGold.instanceId);
    expect(game.getState().containers.zonesByPlayerId[Bravo.id]!.deck.at(-1)).toBe(
      originalBravoReveal.instanceId,
    );
    expect(game.getState().lastClashWinnerId).toBe(Bravo.id);
    expect(Bravo.zone("arena").filter((id) => id === "token:gold")).toHaveLength(1);
  });

  it("restores after the selected reveal moved and resumes the fresh re-clash exactly once", () => {
    let game = setup(hero);
    let Victor = game.as(hero);
    let Bravo = game.as(bravo);
    const originalBravoReveal = Bravo.cardIn("deck", disableYellow);

    Victor.attackWith(snatchRed);
    Bravo.defendWith([testOfStrengthRed]);
    const optional = game.advanceToDecision(Victor, "option");
    Victor.chooseOptions(optional.options[0]!.id);
    Victor.chooseTargets(Victor.cardIn("arena", gold));
    const decision = Victor.expectDecision("entity-target");
    expect(decision.continuation.kind).toBe("replacement-consequence-target");
    if (decision.continuation.kind !== "replacement-consequence-target") {
      throw new Error("Expected the persisted re-clash consequence continuation.");
    }
    const movedState = commitFabReplacementConsequenceTarget(
      game.getState(),
      decision.continuation,
      { kind: "entity-target", instanceIds: [originalBravoReveal.instanceId] },
      transactionOptions,
    );
    movedState.decision = null;
    expect(movedState.containers.zonesByPlayerId[Bravo.id]!.deck[0]).toBe(
      originalBravoReveal.instanceId,
    );
    expect(movedState.objects[originalBravoReveal.instanceId]!.history.moves).toHaveLength(1);
    expect(movedState.replacementEffects).toBeDefined();

    game = restore(FabTestEngine.fromState(movedState));
    Victor = game.as(hero);
    Bravo = game.as(bravo);
    const continuation = decision.continuation;
    const resumed = resumeFabReplacementCostConsequence(
      game.getState(),
      {
        kind: "replacement-cost-target",
        processId: continuation.processId,
        playerId: continuation.playerId,
        replacementId: continuation.replacementId,
        ...(continuation.eventGroupId ? { eventGroupId: continuation.eventGroupId } : {}),
        ...(continuation.sequencePrefix ? { sequencePrefix: continuation.sequencePrefix } : {}),
      },
      transactionOptions,
    );
    game = FabTestEngine.fromState(resumed);
    game.helpers.resolveRestOfCombat();

    expect(game.getState().objects[originalBravoReveal.instanceId]!.history.moves).toHaveLength(1);
    expect(game.getState().lastClashWinnerId).toBe(Victor.id);
  });
});

describe("Victor Goldmane re-clash boundaries", () => {
  it("rejects foreign and changed-incarnation targets at both persisted target boundaries", () => {
    const game = setup(victorGoldmane);
    const Victor = game.as(victorGoldmane);
    const Bravo = game.as(bravo);

    Victor.attackWith(snatchRed);
    Bravo.defendWith([testOfStrengthRed]);
    const optional = game.advanceToDecision(Victor, "option");
    Victor.chooseOptions(optional.options[0]!.id);

    let decision = Victor.expectDecision("entity-target");
    const foreignGoldTarget = Bravo.cardIn("deck", disableYellow);
    expect(
      Victor.expectFailure({
        move: "answer-decision",
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [foreignGoldTarget.instanceId] },
        },
      }).accepted,
    ).toBe(false);

    const paidGold = Victor.cardIn("arena", gold);
    Victor.chooseTargets(paidGold);
    decision = Victor.expectDecision("entity-target");
    const foreignRevealTarget = Bravo.cardIn("hand", testOfStrengthRed);
    expect(
      Victor.expectFailure({
        move: "answer-decision",
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [foreignRevealTarget.instanceId] },
        },
      }).accepted,
    ).toBe(false);

    const originalReveal = Bravo.cardIn("deck", disableYellow);
    game.getState().objects[originalReveal.instanceId] = {
      ...game.getState().objects[originalReveal.instanceId]!,
      incarnation: game.getState().objects[originalReveal.instanceId]!.incarnation + 1,
    };
    expect(
      Victor.expectFailure({
        move: "answer-decision",
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [originalReveal.instanceId] },
        },
      }).accepted,
    ).toBe(false);
    expect(Victor.cardIn("arena", gold).instanceId).toBe(paidGold.instanceId);
  });

  it("rejects the consequence when the bound Gold changes incarnation before payment commits", () => {
    const game = setup(victorGoldmane);
    const Victor = game.as(victorGoldmane);
    const Bravo = game.as(bravo);

    Victor.attackWith(snatchRed);
    Bravo.defendWith([testOfStrengthRed]);
    const optional = game.advanceToDecision(Victor, "option");
    Victor.chooseOptions(optional.options[0]!.id);
    const paidGold = Victor.cardIn("arena", gold);
    Victor.chooseTargets(paidGold);
    const decision = Victor.expectDecision("entity-target");
    game.getState().objects[paidGold.instanceId] = {
      ...game.getState().objects[paidGold.instanceId]!,
      incarnation: game.getState().objects[paidGold.instanceId]!.incarnation + 1,
    };
    const originalReveal = Bravo.cardIn("deck", disableYellow);

    expect(
      Victor.expectFailure({
        move: "answer-decision",
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [originalReveal.instanceId] },
        },
      }).accepted,
    ).toBe(false);
    expect(Victor.cardIn("arena", gold).instanceId).toBe(paidGold.instanceId);
  });

  it("consumes a declined opportunity for a later failed clash in the same turn", () => {
    const game = setup(victorGoldmane);
    const Victor = game.as(victorGoldmane);
    const Bravo = game.as(bravo);
    const originalGold = Victor.cardIn("arena", gold);

    Victor.attackWith(snatchRed);
    Bravo.defendWith([testOfStrengthRed]);
    game.advanceToDecision(Victor, "option");
    Victor.chooseOptions();
    game.helpers.resolveRestOfCombat();

    Victor.attackWith(snatchRed);
    Bravo.defendWith([testOfStrengthRed]);
    game.helpers.resolveRestOfCombat();

    expect(Victor.cardIn("arena", gold).instanceId).toBe(originalGold.instanceId);
    expect(game.committedEvents().filter((event) => event.name === "clash-win")).toHaveLength(2);
    expect(Bravo.zone("arena").filter((id) => id === "token:gold")).toHaveLength(2);
  });

  it("resets the declined first-opportunity limit on Victor's next turn", () => {
    const game = setup(victorGoldmane);
    const Victor = game.as(victorGoldmane);
    const Bravo = game.as(bravo);

    Victor.attackWith(snatchRed);
    Bravo.defendWith([testOfStrengthRed]);
    game.advanceToDecision(Victor, "option");
    Victor.chooseOptions();
    game.helpers.resolveRestOfCombat();
    Victor.endTurn();
    Bravo.endTurn();

    Victor.attackWith(snatchRed);
    Bravo.defendWith([testOfStrengthRed]);
    expect(game.advanceToDecision(Victor, "option").options).toHaveLength(1);
  });

  it("does not offer the replacement without a controlled Gold", () => {
    const game = setup(victorGoldmane, { withGold: false });
    const Victor = game.as(victorGoldmane);
    const Bravo = game.as(bravo);

    Victor.attackWith(snatchRed);
    Bravo.defendWith([testOfStrengthRed]);
    game.helpers.resolveRestOfCombat();

    expect(game.getState().lastClashWinnerId).toBe(Bravo.id);
    expect(Bravo.zone("arena").filter((id) => id === "token:gold")).toHaveLength(1);
  });

  it("does not offer the replacement when Victor wins the initial clash", () => {
    const game = setup(victorGoldmane, { initialOutcome: "win" });
    const Victor = game.as(victorGoldmane);
    const Bravo = game.as(bravo);
    const originalGold = Victor.cardIn("arena", gold);

    Victor.attackWith(snatchRed);
    Bravo.defendWith([testOfStrengthRed]);
    game.helpers.resolveRestOfCombat();

    expect(game.getState().lastClashWinnerId).toBe(Victor.id);
    expect(Victor.cardIn("arena", gold).instanceId).toBe(originalGold.instanceId);
    expect(Victor.zone("arena").filter((id) => id === "token:gold")).toHaveLength(1);
  });

  it("offers the replacement on a tie and resolves a fresh clash after the chosen reveal moves", () => {
    const game = setup(victorGoldmane, { initialOutcome: "tie" });
    const Victor = game.as(victorGoldmane);
    const Bravo = game.as(bravo);
    const tiedBravoReveal = Bravo.cardIn("deck", snatchRed);

    Victor.attackWith(snatchRed);
    Bravo.defendWith([testOfStrengthRed]);
    const optional = game.advanceToDecision(Victor, "option");
    Victor.chooseOptions(optional.options[0]!.id);
    Victor.chooseTargets(Victor.cardIn("arena", gold));
    Victor.chooseTargets(tiedBravoReveal);
    game.helpers.resolveRestOfCombat();

    expect(game.getState().containers.zonesByPlayerId[Bravo.id]!.deck[0]).toBe(
      tiedBravoReveal.instanceId,
    );
    expect(game.getState().lastClashWinnerId).toBe(Victor.id);
  });
});
