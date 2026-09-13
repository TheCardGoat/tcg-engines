import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { nimblismBlue } from "./nimblism.ts";
import { polarBlastRed } from "./polar-blast.ts";

describe("Polar Blast (ELE166) AAA", () => {
  it("happy: an unpaying opponent arms dominate on the next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [polarBlastRed, brutalAssaultBlue, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(polarBlastRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Bravo.must.pitch(nimblismBlue).playAttack(brutalAssaultBlue);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveKeyword("dominate");
  });

  it("boundary: paying {r}{r}{r} arms nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [polarBlastRed, brutalAssaultBlue],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], resourcePoints: 3, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(polarBlastRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    Bravo.playAttack(brutalAssaultBlue);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).notToHaveKeyword("dominate");
  });

  it("timing: played from arsenal, draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [],
        arsenal: [{ card: polarBlastRed, state: { faceDown: false } }],
        deckTop: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playFromArsenal(polarBlastRed, { target: game.as(dash).id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
