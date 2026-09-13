/**
 * AAA test for trigger:complete-contract.
 * Representative card: Eradicate Yellow (DYN119).
 * Contract to banish opponents' yellow cards; complete-contract creates Silver.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { FAB_MANUAL_HARNESS } from "../../../../testing/harness-config.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { righteousCleansingYellow } from "../../../../../../cards/src/cards/actions/righteous-cleansing.ts";
import { eradicateYellow } from "../../../../../../cards/src/cards/actions/eradicate.ts";
import { nimblismBlue } from "../../../../../../cards/src/cards/actions/nimblism.ts";
import { wageGoldYellow } from "../../../../../../cards/src/cards/actions/wage-gold.ts";

describe("trigger: complete-contract", () => {
  it("AAA: Eradicate completes its yellow-banish contract and creates Silver (DYN119)", () => {
    // CR 8.5.39a: completion is a controller-acted banish of an opponent-owned
    // match. Eradicate's on-hit mills the defending deck; seed a yellow on top.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [eradicateYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        deckTop: [wageGoldYellow],
      },
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(eradicateYellow);
    game.as(dash).defendWith();
    game.closeCombat({ ordering: "listed" });

    expect(Bravo.zone("arena").some((id) => /token:silver|silver/i.test(String(id)))).toBe(true);
  });

  it("AAA boundary: non-contract attack creates no Silver", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(
      game
        .as(bravo)
        .zone("arena")
        .some((id) => /token:silver/i.test(String(id))),
    ).toBe(false);
  });

  it("AAA regression (CR 8.5.1): a reason-banish move-zone completes a seated contract (CRU027 crush)", () => {
    // Eradicate seats "banish opponents' yellow cards" on turn 1; the printed
    // hit path is walled off (4{d} vs 4{p}) so the only completion route left
    // is Righteous Cleansing's crush, whose choose-same-name-group banish
    // rides a move-zone event with reason "banish" — the derived banish
    // observation must still complete the contract (CR 8.5.39).
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [eradicateYellow, righteousCleansingYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [nimblismBlue, nimblismBlue, wageGoldYellow],
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        // Six blues: two wall the turn-1 attack, four keep Dash at intellect
        // so her end-of-turn draw cannot eat the staged crush payload.
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        deckTop: [wageGoldYellow, wageGoldYellow, nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(eradicateYellow);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.zone("arena").some((id) => /token:silver|silver/i.test(String(id)))).toBe(false);

    Bravo.endTurn();
    Dash.endTurn();

    Bravo.attackWith(righteousCleansingYellow, {
      pitch: [nimblismBlue, nimblismBlue, wageGoldYellow],
    });
    for (let safety = 0; safety < 8 && game.waitState().kind !== "decision"; safety += 1) {
      game.passBoth();
    }
    const decision = Bravo.expectDecision("group-choice");
    const wageCohort = decision.cohorts.find((cohort) =>
      cohort.entryIds.every((id) =>
        decision.entries.some(
          (entry) => entry.id === id && entry.label.toLowerCase().includes("wage"),
        ),
      ),
    );
    expect(wageCohort).toBeDefined();
    Bravo.exec({
      move: "answer-decision",
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: {
          kind: "group-choice",
          selectedIds: wageCohort!.entryIds,
          orderedRemainderIds: decision.entries
            .map((entry) => entry.id)
            .filter((id) => !wageCohort!.entryIds.includes(id)),
        },
      },
    });
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("banished").filter((id) => id === wageGoldYellow.canonicalId)).toHaveLength(2);
    expect(Bravo.activeContract()).toBe(null);
    expect(Bravo.zone("arena").some((id) => /token:silver|silver/i.test(String(id)))).toBe(true);
  });
});
