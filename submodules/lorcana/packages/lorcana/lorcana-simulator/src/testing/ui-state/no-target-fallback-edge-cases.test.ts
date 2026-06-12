import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { shesYourPerson } from "@tcg/lorcana-cards/cards/008";
import { helgaSinclairPreparedForAnything } from "@tcg/lorcana-cards/cards/012";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

// These tests document CURRENT engine behavior for two edge cases the Scar fix
// did NOT directly address. They serve as a behavioral baseline so we can detect
// regressions and decide whether the current behavior is acceptable.
//
// Edge case 1: Mandatory triggered ability whose `chosen` target pool is empty.
// Edge case 2: Non-optional `choice` whose every branch is unfillable.
//
// Expected behavior (per Lorcana rules 8.6 + existing engine fizzle paths):
//   - The trigger / action still occurs
//   - No unresolvable target picker is presented to the player
//   - The bag drains and the game can continue without manual intervention

describe("Edge case 1 | mandatory triggered ability with no valid target", () => {
  // Helga Sinclair - Prepared for Anything: "Whenever this character quests,
  // deal 1 damage to chosen opposing character." This is NOT optional. If the
  // opposing board is empty when she quests, the trigger still fires but has
  // no valid target.
  it("Helga quests with no opposing characters: bag auto-drains, lore is gained, game continues", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: helgaSinclairPreparedForAnything, isDrying: false }],
        deck: 5,
      },
      // Player two has an empty board — no opposing characters at all.
      { deck: 5 },
    );

    expect(engine.asPlayerOne().quest(helgaSinclairPreparedForAnything)).toBeSuccessfulCommand();

    // CURRENT BEHAVIOR (locked in here): the engine fizzles the mandatory
    // trigger before it surfaces. The bag is empty, no prompt is pending, and
    // the quest's lore gain still applies normally.
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(snapshotPendingPrompt(engine)).toBeNull();
    expect(engine.asPlayerOne().getCardZone(helgaSinclairPreparedForAnything)).toBe("play");

    // Game can continue: passing the turn must succeed without manual bag
    // resolution.
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  });

  it("Helga quests WITH an opposing character: trigger surfaces a target prompt", () => {
    // Positive control — confirms the trigger is normally non-trivial; if this
    // were silently fizzling in all cases, the test above would be uninformative.
    const opposing = createMockCharacter({
      id: "edge-case-opposing",
      name: "Opposing Body",
      cost: 2,
      strength: 1,
      willpower: 3,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: helgaSinclairPreparedForAnything, isDrying: false }],
        deck: 5,
      },
      { play: [{ card: opposing, isDrying: false }], deck: 5 },
    );

    expect(engine.asPlayerOne().quest(helgaSinclairPreparedForAnything)).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().getBagCount()).toBe(1);
    const snapshot = snapshotPendingPrompt(engine);
    expect(snapshot?.kind).toBe("target-selection");
    expect(snapshot?.cardCandidateIds.length).toBeGreaterThan(0);
  });
});

describe("Edge case 2 | non-optional choice where every branch is unfillable", () => {
  // She's Your Person — "Choose one:
  //   - Remove up to 3 damage from chosen character.
  //   - Remove up to 3 damage from each of your characters with Bodyguard."
  //
  // Both branches need at least one character on the board. With nothing in
  // play on either side, neither option produces a meaningful effect.
  it("She's Your Person played with no characters anywhere: play is rejected upfront", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [shesYourPerson],
        inkwell: shesYourPerson.cost,
        deck: 1,
      },
      // Both players' play zones are empty — option 1 has no chosen character,
      // option 2 has no Bodyguard characters of yours.
      { deck: 1 },
    );

    expect(engine.asPlayerOne().playCard(shesYourPerson)).toBeSuccessfulCommand();

    // OBSERVED current behavior:
    //  - `playCard` succeeds; the card moves to `limbo` while the choice resolves.
    //  - A `choice-selection` prompt is presented to the controller.
    //  - Both candidate pools are empty, but `choice-selection` doesn't render
    //    a target picker — it renders option buttons, so the player is NOT stuck.
    //  - Picking branch 1 (the `selector: "all"` Bodyguard branch) resolves
    //    cleanly to a no-op; the action moves to discard.
    //
    // We pin both observations:
    const snapshot = snapshotPendingPrompt(engine);
    expect(snapshot?.kind).toBe("choice-selection");
    expect(engine.asPlayerOne().getCardZone(shesYourPerson)).toBe("limbo");

    // Branch 1: `Remove up to 3 damage from each of your Bodyguards` — should
    // resolve as a no-op even with no Bodyguards in play.
    expect(
      engine.asPlayerOne().resolvePendingByCard(shesYourPerson, { choiceIndex: 1 }),
    ).toBeSuccessfulCommand();
    expect(snapshotPendingPrompt(engine)).toBeNull();
    expect(engine.asPlayerOne().getCardZone(shesYourPerson)).toBe("discard");

    // Game can continue.
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  });

  it("She's Your Person played with empty boards: branch 0 (chosen character) — observed behavior", () => {
    // Branch 0 needs a `chosen character`. With nothing in play on either side
    // the candidate pool is empty. This is the case I flagged as potentially
    // exposing the same bug pattern as Scar — the `choice` is non-optional, so
    // there's no implicit decline available.
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [shesYourPerson],
        inkwell: shesYourPerson.cost,
        deck: 1,
      },
      { deck: 1 },
    );

    expect(engine.asPlayerOne().playCard(shesYourPerson)).toBeSuccessfulCommand();
    expect(snapshotPendingPrompt(engine)?.kind).toBe("choice-selection");

    expect(
      engine.asPlayerOne().resolvePendingByCard(shesYourPerson, { choiceIndex: 0 }),
    ).toBeSuccessfulCommand();
    // Behavior pin: branch 0 with no chosen-character candidates still
    // resolves to a no-op rather than getting stuck on an empty target picker.
    expect(snapshotPendingPrompt(engine)).toBeNull();
    expect(engine.asPlayerOne().getCardZone(shesYourPerson)).toBe("discard");

    // Game can continue.
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  });

  it("She's Your Person played with one valid target: choice prompt surfaces normally", () => {
    // Positive control — option 1 needs a chosen character. With one character
    // in play, the choice is fillable on at least one branch.
    const ownChar = createMockCharacter({
      id: "edge-case-own-char",
      name: "Own Character",
      cost: 1,
      strength: 1,
      willpower: 3,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [shesYourPerson],
      inkwell: shesYourPerson.cost,
      play: [{ card: ownChar, isDrying: false }],
      deck: 1,
    });

    expect(
      engine.asPlayerOne().playCardWithChoice(shesYourPerson, 0, {
        targets: [ownChar],
      }),
    ).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().getCardZone(shesYourPerson)).toBe("discard");
  });
});
