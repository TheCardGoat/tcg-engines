import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { righteousCleansingYellow } from "./righteous-cleansing.ts";

describe("Righteous Cleansing (CRU027) AAA", () => {
  it("happy: crush banishes a same-name group from the top 5 and returns the rest", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [righteousCleansingYellow],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        deckTop: [snatchRed, snatchRed, nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(righteousCleansingYellow);
    expectCombat(game).toHaveAttackPower(10);
    Dash.defendWith();
    for (let safety = 0; safety < 8 && game.waitState().kind !== "decision"; safety += 1) {
      game.passBoth();
    }

    const decision = Bravo.expectDecision("group-choice");
    const snatchCohort = decision.cohorts.find((cohort) =>
      cohort.entryIds.every((id) =>
        decision.entries.some(
          (entry) => entry.id === id && entry.label.toLowerCase().includes("snatch"),
        ),
      ),
    );
    expect(snatchCohort).toBeDefined();
    Bravo.exec({
      move: "answer-decision",
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: {
          kind: "group-choice",
          selectedIds: snatchCohort!.entryIds,
          orderedRemainderIds: decision.entries
            .map((entry) => entry.id)
            .filter((id) => !snatchCohort!.entryIds.includes(id)),
        },
      },
    });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(10);
    expect(Dash.zone("banished").filter((id) => id === snatchRed.canonicalId)).toHaveLength(2);
    expect(
      Dash.zone("deck").filter((id) => id === nimblismBlue.canonicalId).length,
    ).toBeGreaterThanOrEqual(3);
  });

  it("boundary: less than 4 damage does not look at their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [righteousCleansingYellow],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        deckTop: [snatchRed, snatchRed, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(righteousCleansingYellow);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(18);
    expect(Dash.zone("banished")).toHaveLength(0);
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
  });

  it("timing: crush looks at only the current top 5, not the rest of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [righteousCleansingYellow],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        deckTop: [snatchRed, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(righteousCleansingYellow);
    for (let safety = 0; safety < 8 && game.waitState().kind !== "decision"; safety += 1) {
      game.passBoth();
    }

    const decision = Bravo.expectDecision("group-choice");
    expect(decision.entries).toHaveLength(5);
    Bravo.exec({
      move: "answer-decision",
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: {
          kind: "group-choice",
          selectedIds: [decision.entries[0]!.id],
          orderedRemainderIds: decision.entries.slice(1).map((entry) => entry.id),
        },
      },
    });
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("banished")).toHaveLength(1);
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("banished")).not.toContain(snatchRed.canonicalId);
  });
});
