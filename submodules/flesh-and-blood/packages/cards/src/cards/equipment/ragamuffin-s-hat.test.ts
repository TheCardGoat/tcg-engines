import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { ragamuffinSHat } from "./ragamuffin-s-hat.ts";

describe("Ragamuffin's Hat (ELE233) AAA", () => {
  it("happy: with 1 card in hand, destroy this, draw, then put a card on the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [ragamuffinSHat],
        hand: [snatchRed],
        deck: [nimblismBlue],
        actionPoints: 0,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;

    Bravo.activate(ragamuffinSHat);
    game.advanceToDecision(Bravo, "effect-resolution");
    Bravo.choose("option-0");
    game.advanceToDecision(Bravo, "entity-target");
    Bravo.chooseTargets(Bravo.cardIn("hand", nimblismBlue));
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, ragamuffinSHat).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveHandCount(1);
    expect(Bravo.zone("deck")).toHaveLength(deckBefore);
  });

  it("boundary: cannot activate with an empty hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [ragamuffinSHat],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).expectActivationRejected(ragamuffinSHat);
    expectFabCard(game.as(bravo), ragamuffinSHat).toBeIn("head");
  });

  it("timing: cannot activate with 2 cards in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [ragamuffinSHat],
        hand: [snatchRed, nimblismBlue],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).expectActivationRejected(ragamuffinSHat);
    expectFabCard(game.as(bravo), ragamuffinSHat).toBeIn("head");
  });
});
