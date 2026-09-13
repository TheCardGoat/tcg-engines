import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { scurvStowaway } from "../heroes/scurv-stowaway.ts";
import { dash } from "../heroes/dash.ts";
import { gold } from "../tokens/gold.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { notSoFastYellow } from "./not-so-fast.ts";

/**
 * Not So Fast, Yellow (SEA149) — Pirate Instant, Scurv Specialization.
 * Printed: "The next time an opponent would draw a card from the effect of a
 * Gold token this turn, instead you draw a card."
 * The Gold token's own draw is its "Action - {r}{r}, destroy this: Draw a
 * card. Go again" activation (DYN243). Dash activates his Gold; the Instant
 * replaces that draw wholesale and Scurv draws instead
 * (engine/gold-token-draw-redirect).
 */

describe("Not So Fast, Yellow (SEA149) AAA", () => {
  it("happy: the opponent's Gold-token draw is redirected to Scurv", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [],
        arena: [gold],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [snatchRed],
      },
      {
        hero: scurvStowaway,
        hand: [notSoFastYellow],
        deckTop: [nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Scurv = game.as(scurvStowaway);

    // Dash starts activating his Gold; Scurv answers with the Instant while
    // the activation layer is still live.
    Dash.activate(gold);
    game.helpers.passPriorityTo(Scurv);
    Scurv.play(notSoFastYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expect(Dash.zone("arena")).not.toContain(gold.canonicalId); // spent as the cost
    expectFabCard(Scurv, notSoFastYellow).toBeIn("graveyard");
    expect(Scurv.zone("hand")).toHaveLength(1); // the redirected draw
    expect(Dash.zone("hand")).toHaveLength(0); // the Gold draw was replaced
    expectFabCard(Scurv, nimblismBlue).toBeIn("hand");
    expect(Dash.cardsIn("deck", snatchRed)).toHaveLength(1);
  });

  it("boundary: without the Instant the Gold draw goes to its controller", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [],
        arena: [gold],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 4,
      },
      {
        hero: scurvStowaway,
        hand: [],
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(gold);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expect(Dash.zone("hand")).toHaveLength(1); // the Gold draw, unredirected
  });
});
