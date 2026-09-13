import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { pickACardAnyCardRed } from "./pick-a-card-any-card.ts";

const namedSnatch = {
  ...FAB_MANUAL_HARNESS,
  publicCardIdentities: [{ canonicalId: snatchRed.canonicalId, names: ["Snatch"] }],
} as const;

describe("Pick a Card, Any Card (EVR167) AAA", () => {
  it("happy: naming the revealed hand card creates 3 Silver tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [pickACardAnyCardRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], deck: 6 },
      namedSnatch,
    );
    const Dash = game.as(dash);

    Dash.play(pickACardAnyCardRed);
    game.passBoth();
    Dash.choose("Snatch");
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, pickACardAnyCardRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveTokenCount("silver", 3);
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Dash.id,
      cardName: "Snatch",
    });
  });

  it("boundary: naming a card that is not in their hand creates no Silver", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [pickACardAnyCardRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [nimblismBlue], deck: 6 },
      {
        ...FAB_MANUAL_HARNESS,
        publicCardIdentities: [
          { canonicalId: snatchRed.canonicalId, names: ["Snatch"] },
          { canonicalId: nimblismBlue.canonicalId, names: ["Nimblism"] },
        ],
      },
    );
    const Dash = game.as(dash);

    Dash.play(pickACardAnyCardRed);
    game.passBoth();
    Dash.choose("Snatch");
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveTokenCount("silver", 0);
  });

  it("timing: an empty opposing hand still names a card and creates no Silver", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [pickACardAnyCardRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      namedSnatch,
    );
    const Dash = game.as(dash);

    Dash.play(pickACardAnyCardRed);
    game.passBoth();
    Dash.choose("Snatch");
    expectFabPlayer(Dash).toHaveTokenCount("silver", 0);
    expect(game.combat()).toBeNull();
  });
});
