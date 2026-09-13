import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { indexRed } from "./index.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { craneDanceRed } from "./crane-dance.ts";
import { floodOfForceYellow } from "./flood-of-force.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";

/**
 * Index (ARC135) — Wizard Action, cost 0, def 2.
 *
 * Printed text (i18n, source of truth):
 * "Look at the top 5 cards of your deck. Put 1 card from among them on top
 * of your deck, and the rest on the bottom of your deck in any order."
 *
 * /fab-rules Mode B handoff (behavior constraints):
 * - The look creates a hidden-information selection: exactly 1 of the looked
 *   cards is chosen for the top, the remaining 4 go to the bottom in a
 *   player-chosen order (two ordered choices, both player-facing).
 * - No cards leave the deck zone; only their order changes (CR 4.4, deck).
 *
 * Look-cohort: the engine treats `them`→deck top then `them`→deck bottom as
 * choose 1 for the top and put the rest on the bottom (CR 8.5.11 / 8.5.15).
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Index (ARC135) AAA", () => {
  it("resolves cleanly: plays for cost 0, lands in the graveyard, deck size unchanged", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [indexRed],
        actionPoints: 1,
        deck: [indexRed, indexRed, indexRed, indexRed, indexRed, indexRed],
      },
      { hero: dash, hand: [], deck: 6 },
      manual,
    );
    const Kano = game.as(kano);

    Kano.play(indexRed);
    game.helpers.resolveUntilIdle({ ordering: "listed", entityTargets: "maximum" });

    expect(Kano.zone("graveyard")).toContain(indexRed.canonicalId);
    expect(Kano.zone("hand")).not.toContain(indexRed.canonicalId);
    expect(Kano.actionPoints()).toBe(0);
    expect(Kano.zone("deck").length).toBe(6);
  });

  it("happy: one looked-at card stays on top and the rest go to the bottom", () => {
    // Deck fixture arrays are bottom-first: the top five cards here are
    // [brutal, snatch, nimblism, crane, flood] and three fillers sit below.
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [indexRed],
        actionPoints: 1,
        deck: [
          indexRed,
          indexRed,
          indexRed,
          brutalAssaultBlue,
          snatchRed,
          nimblismBlue,
          craneDanceRed,
          floodOfForceYellow,
        ],
      },
      { hero: dash, hand: [], deck: 6 },
      manual,
    );
    const Kano = game.as(kano);

    Kano.play(indexRed);
    game.helpers.resolveUntilIdle({
      ordering: "listed",
      entityTargetCanonicalId: floodOfForceYellow.canonicalId,
    });

    expect(Kano.zone("deck").at(-1)).toBe(floodOfForceYellow.canonicalId);
    expect(Kano.zone("deck").length).toBe(8);
    expect(Kano.zone("deck").slice(0, 4).sort()).toEqual(
      [
        brutalAssaultBlue.canonicalId,
        snatchRed.canonicalId,
        nimblismBlue.canonicalId,
        craneDanceRed.canonicalId,
      ].sort(),
    );
  });

  it("BOUNDARY PIN: with only one card below the look window, that lone card becomes the new top", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [indexRed],
        actionPoints: 1,
        deck: [
          nimblismBlue,
          brutalAssaultBlue,
          snatchRed,
          craneDanceRed,
          floodOfForceYellow,
          indexRed,
        ],
      },
      { hero: dash, hand: [], deck: 6 },
      manual,
    );
    const Kano = game.as(kano);

    Kano.play(indexRed);
    game.helpers.resolveUntilIdle({
      ordering: "listed",
      entityTargetCanonicalId: indexRed.canonicalId,
    });

    expect(Kano.zone("deck").length).toBe(6);
    expect(Kano.zone("deck").at(-1)).toBe(indexRed.canonicalId);
  });
});
