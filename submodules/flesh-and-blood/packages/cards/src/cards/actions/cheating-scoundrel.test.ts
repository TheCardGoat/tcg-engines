import { describe, expect, it } from "vitest";
import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "@tcg/flesh-and-blood-engine/runtime";
import { FabTestEngine, expectWait } from "@tcg/flesh-and-blood-engine/testing";
import { prowlBlue } from "./prowl.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { disableYellow } from "./disable.ts";
import { snatchRed } from "./snatch.ts";
import { scarForAScarBlue } from "./scar-for-a-scar.ts";
import { nimblismBlue } from "./nimblism.ts";
import { heartOfFyendalBlue } from "../resources/heart-of-fyendal.ts";
import { cheatingScoundrelRed } from "./cheating-scoundrel.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

function restore(game: FabTestEngine): FabTestEngine {
  const state = game.getState();
  return FabTestEngine.fromState(
    restoreFabMatchSnapshot(
      serializeFabMatchSnapshot(state),
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    ),
  );
}

function fourCardAttacker(
  extra: readonly [typeof prowlBlue, typeof nimblismBlue] = [prowlBlue, nimblismBlue],
) {
  return {
    hero: bravo,
    hand: [cheatingScoundrelRed, snatchRed, ...extra],
    arsenal: [heartOfFyendalBlue],
    actionPoints: 1,
    deck: 8,
  } as const;
}

function fourCardDefender() {
  return {
    hero: dash,
    hand: [disableYellow, disableYellow, disableYellow, nimblismBlue],
    arsenal: [heartOfFyendalBlue],
    life: 20,
    deck: 8,
  } as const;
}

describe("Cheating Scoundrel (PEN169) AAA — Errata Bulletin #10", () => {
  it("grants only the next attack +3, wagers when that attack attacks, and awards its preserved prize on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cheatingScoundrelRed, snatchRed, scarForAScarBlue, prowlBlue],
        arsenal: [heartOfFyendalBlue],
        actionPoints: 2,
        deck: 8,
      },
      fourCardDefender(),
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(cheatingScoundrelRed);
    game.passBoth();
    Bravo.attackWith(snatchRed);

    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    expect(game.committedEvents().filter((event) => event.name === "wager")).toHaveLength(1);
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(13);
    expect(Bravo.zone("arena").filter((id) => id === "token:gold")).toHaveLength(1);

    Bravo.attackWith(scarForAScarBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
    expect(game.committedEvents().filter((event) => event.name === "wager")).toHaveLength(1);
  });

  it("restores at both decisions, discards the exact chosen hand card, and reverses winner and prize on a defended miss", () => {
    let game = FabTestEngine.start(fourCardAttacker(), fourCardDefender(), manual);
    let Bravo = game.as(bravo);
    let Dash = game.as(dash);

    Bravo.play(cheatingScoundrelRed);
    game.passBoth();
    Bravo.attackWith(snatchRed);
    Dash.defendWith([disableYellow, disableYellow, disableYellow]);
    const choice = game.advanceToDecision(Bravo, "option");

    game = restore(game);
    Bravo = game.as(bravo);
    Bravo.chooseOptions(choice.options[0]!.id);
    expect(Bravo.expectDecision("entity-target").continuation).toMatchObject({
      kind: "replacement-cost-target",
    });

    game = restore(game);
    Bravo = game.as(bravo);
    Dash = game.as(dash);
    Bravo.chooseTargets(Bravo.cardIn("hand", prowlBlue));
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(20);
    expect(Bravo.zone("graveyard")).toContain(prowlBlue.canonicalId);
    expect(Bravo.zone("hand")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("arena").filter((id) => id === "token:gold")).toHaveLength(1);
    expect(Dash.zone("arena")).not.toContain("token:gold");
    expect(
      game
        .committedEvents()
        .filter((event) => event.name === "wager-win" && event.data.actorId === Bravo.id),
    ).toHaveLength(1);
  });

  it("declining consumes the opportunity and awards the original prize to the defending hero", () => {
    const game = FabTestEngine.start(fourCardAttacker(), fourCardDefender(), manual);
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(cheatingScoundrelRed);
    game.passBoth();
    Bravo.attackWith(snatchRed);
    Dash.defendWith([disableYellow, disableYellow, disableYellow]);
    game.advanceToDecision(Bravo, "option");
    Bravo.chooseOptions();
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("hand")).toEqual(
      expect.arrayContaining([prowlBlue.canonicalId, nimblismBlue.canonicalId]),
    );
    expect(Bravo.zone("arena")).not.toContain("token:gold");
    expect(Dash.zone("arena").filter((id) => id === "token:gold")).toHaveLength(1);
  });

  it("offers no impossible prompt when paying for the attack leaves no hand card to discard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cheatingScoundrelRed, disableYellow, prowlBlue, nimblismBlue],
        arsenal: [heartOfFyendalBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 8,
      },
      fourCardDefender(),
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(cheatingScoundrelRed);
    game.passBoth();
    Bravo.attackWith(disableYellow, { pitch: [prowlBlue, nimblismBlue] });
    Dash.defendWith([disableYellow, disableYellow, disableYellow, nimblismBlue]);
    expectWait(game).notToHaveDecision();
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("hand")).toHaveLength(0);
    expect(Bravo.zone("arena")).not.toContain("token:gold");
    expect(Dash.zone("arena").filter((id) => id === "token:gold")).toHaveLength(1);
    expectWait(game).notToHaveDecision();
  });

  it("expires both the unconsumed attack grant and wager-loss replacement at end of turn", () => {
    const game = FabTestEngine.start(fourCardAttacker(), fourCardDefender(), manual);
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(cheatingScoundrelRed);
    game.passBoth();
    Bravo.endTurn();
    Dash.endTurn();

    Bravo.attackWith(snatchRed);

    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    expect(game.committedEvents().filter((event) => event.name === "wager")).toHaveLength(0);
  });

  it("rejects a stale exact discard target after its incarnation leaves the hand", () => {
    const game = FabTestEngine.start(fourCardAttacker(), fourCardDefender(), manual);
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(cheatingScoundrelRed);
    game.passBoth();
    Bravo.attackWith(snatchRed);
    Dash.defendWith([disableYellow, disableYellow, disableYellow]);
    const choice = game.advanceToDecision(Bravo, "option");
    Bravo.chooseOptions(choice.options[0]!.id);
    const decision = Bravo.expectDecision("entity-target");
    const stale = Bravo.cardIn("hand", prowlBlue);

    game.moveObject(stale.instanceId, Bravo.id, "graveyard");
    const rejection = Bravo.expectFailure({
      move: "answer-decision",
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "entity-target", instanceIds: [stale.instanceId] },
      },
    });

    expect(rejection.error).toMatch(/no longer legal/i);
    expect(game.pendingDecision()?.decisionId).toBe(decision.decisionId);
    expect(Bravo.zone("arena")).not.toContain("token:gold");
    expect(Dash.zone("arena")).not.toContain("token:gold");
  });
});
