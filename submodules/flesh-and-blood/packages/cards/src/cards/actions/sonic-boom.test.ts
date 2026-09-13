import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { nullruneHood } from "../equipment/nullrune-hood.ts";
import { scaldingRainRed } from "./scalding-rain.ts";
import { tomeOfFyendalYellow } from "./tome-of-fyendal.ts";
import { rewindBlue } from "../instants/rewind.ts";
import { sonicBoomYellow } from "./sonic-boom.ts";

/**
 * Sonic Boom Yellow (ARC119) — Wizard Action.
 * "Deal 3 arcane damage to target opposing hero. If this deals damage, look at
 * the top card of your deck. If it's a Wizard 'non-attack' action card, you may
 * banish it. If you do, you may play it this turn as though it were an instant
 * and it costs X resource points less to play, where X is the damage dealt by
 * Sonic Boom."
 *
 * Mode B (fab-rules): CR 8.5.3a/b the controller's effect damage (no combat
 * chain); the look binds the deck-top card; the banish optional fires only for
 * a Wizard non-attack ACTION card; the play permission and cost reduction are
 * this-turn only.
 *
 * W2-FIX2 removed the authored `subtypes: ["Reaction"]` from the binding-
 * matches filter (action cards never carry "Reaction" in subtypes — "Attack
 * Reaction"/"Defense Reaction" are types), so the printed banish → play-as-
 * instant → cost-reduction clause now fires; the filter also requires
 * types: ["Action"] per the printed "action card" (ARC138 golden shape).
 */

describe("Sonic Boom (ARC119) AAA", () => {
  it("happy: deal 3, banish the Wizard action on deck top, play it from banish as a reduced-cost instant", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [sonicBoomYellow],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
        deckTop: [scaldingRainRed],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(sonicBoomYellow);
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(17);
    // Effect damage: no combat chain opens (CR 8.5.3b).
    expect(game.combat()).toBeNull();

    // Look bound the deck top (Wizard non-attack action): accept the banish,
    // then accept the play-as-instant permission.
    Blaze.chooseBoolean(true);
    Blaze.chooseBoolean(true);
    expect(Blaze.zone("banished")).toContain(scaldingRainRed.canonicalId);

    // Play the banished card as though it were an instant; X = 3 damage dealt
    // by Sonic Boom makes the printed 1{r} cost free (RP 3 stays 3).
    Blaze.play(scaldingRainRed, { from: "banished", target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(13); // 3 + 4
    expectFabPlayer(Blaze).toHaveResourceCount(3);
    expect(Blaze.zone("banished")).not.toContain(scaldingRainRed.canonicalId);
    expectFabCard(Blaze, scaldingRainRed).toBeIn("graveyard");
    // Sonic Boom itself reaches the graveyard once its resolution chain drains.
    expectFabCard(Blaze, sonicBoomYellow).toBeIn("graveyard");
  });

  it("boundary: Arcane Barrier 1 prevents 1 of the 3 arcane damage", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [sonicBoomYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, resourcePoints: 1, head: [nullruneHood], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(sonicBoomYellow);
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });

  it("boundary: a non-Wizard action on deck top is not banished", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [sonicBoomYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
        deckTop: [tomeOfFyendalYellow],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(sonicBoomYellow);
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(17);

    // The looked card is not a Wizard card: no banish optional is presented
    // (priority window, not a decision) and the deck top is untouched.
    expect(game.waitState()).toMatchObject({ kind: "priority", playerId: Blaze.id });
    expect(Blaze.zone("banished")).toHaveLength(0);
    expect(Blaze.zone("deck")).toContain(tomeOfFyendalYellow.canonicalId);
  });

  it("boundary: a Wizard instant on deck top is not an action card and is not banished", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [sonicBoomYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
        deckTop: [rewindBlue],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(sonicBoomYellow);
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(17);

    // Printed text banishes a Wizard 'non-attack' ACTION card: the Wizard
    // instant on top does not qualify, so no optional is presented.
    expect(game.waitState()).toMatchObject({ kind: "priority", playerId: Blaze.id });
    expect(Blaze.zone("banished")).toHaveLength(0);
    expect(Blaze.zone("deck")).toContain(rewindBlue.canonicalId);
  });

  it("timing: the play-from-banish permission expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [sonicBoomYellow],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
        deckTop: [scaldingRainRed],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(sonicBoomYellow);
    game.passBoth();
    Blaze.chooseBoolean(true);
    Blaze.chooseBoolean(true);
    expect(Blaze.zone("banished")).toContain(scaldingRainRed.canonicalId);

    // Do not play it; let the turn cycle.
    Blaze.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expect(() => Blaze.play(scaldingRainRed, { from: "banished", target: Dash.id })).toThrow();
    expect(Blaze.zone("banished")).toContain(scaldingRainRed.canonicalId);
  });
});
