import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { pintOfStrongAndStoutBlue } from "./pint-of-strong-and-stout.ts";
import { kayo } from "../heroes/kayo.ts";
import { smashbackAlehornBlue } from "./smashback-alehorn.ts";

/**
 * Smashback Alehorn (Blue) (HVY044) — Brute Action, cost 0, go again.
 *
 * Printed: "Create an Agility and a Might token.\nGo again"
 *
 * Mode B (fab-rules): CR 2.10 (token creation seats the named token objects
 * under the controller — one Agility and one Might, two separate tokens),
 * CR 8.3.4a (go again refunds the spent action point). Behavior constraints:
 * one play seats exactly one Agility and one Might token; the cost-0 play is
 * legal at zero resources; go again returns the action point.
 *
 * PINNED MISBEHAVIOR (plan §5, HVY044 row, W3-I): the module authors ONE
 * create-token leaf with the compound slug "agility-and-a-might", which
 * matches no token definition (Agility and Might are two separate tokens;
 * the individual "agility" and "might" slugs are used by HVY115-120 and
 * TER018/TER025 modules respectively). The resolution leaf fails loud with
 * "created object token:agility-and-a-might is absent from match program",
 * so Smashback Alehorn can never complete resolution. Same defect family as
 * BET026 (compound "might-and-a-vigor", resolved by W3-FIX3 via the LGS355
 * sequence-of-leaves shape). Flip this pin when the module is re-authored as
 * two create-token leaves with slugs "agility" and "might".
 */

describe("Smashback Alehorn (Blue) (HVY044) AAA", () => {
  it("PINNED (§5 HVY044): the play is admitted but resolution throws on the compound agility-and-a-might slug", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [smashbackAlehornBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    // Printed: create one Agility and one Might. Engine: the play passes
    // legality and the cost-0 gate, then the resolution leaf looks up the
    // compound slug "agility-and-a-might" in the match program and fails
    // loud instead of minting the two printed tokens.
    expect(() => {
      Kayo.play(smashbackAlehornBlue);
      game.helpers.resolveUntilIdle();
    }).toThrow(/agility-and-a-might.*absent from match program/);
  });

  it("boundary: the same flow with the split-leaf sibling seats both tokens — the throw is the compound slug's, not the flow's", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [pintOfStrongAndStoutBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    // BET026 (post W3-FIX3) authors its identical printed shape ("Create a
    // Might and a Vigor token") as two create-token leaves and resolves
    // cleanly through the same cost-0, go-again action play — isolating the
    // HVY044 failure to its authored compound slug alone.
    Kayo.play(pintOfStrongAndStoutBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kayo).toHaveTokenCount("might", 1);
    expectFabPlayer(Kayo).toHaveTokenCount("vigor", 1);
    expectFabCard(Kayo, pintOfStrongAndStoutBlue).toBeIn("graveyard");
    expectFabPlayer(Kayo).toHaveAP(1);
  });
});
