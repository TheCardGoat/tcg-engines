import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { cromai } from "../allies/cromai.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { reachBeyondTheGrave } from "./reach-beyond-the-grave.ts";

describe("Reach Beyond the Grave (PEN154) AAA", () => {
  it("happy: destroying the piece returns an ally to hand, then discards and goes again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [reachBeyondTheGrave],
        graveyard: [cromai],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: blazeFiremind, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    // The single graveyard ally auto-binds (CR 1.8.6c); only the discard asks.
    Dash.activate(reachBeyondTheGrave);
    Dash.target(snatchRed);

    expectFabCard(Dash, reachBeyondTheGrave).toBeIn("graveyard");
    expectFabCard(Dash, cromai).toBeIn("hand");
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: with no ally in the graveyard the activation reverses", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [reachBeyondTheGrave],
        hand: [headJabRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: blazeFiremind, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(reachBeyondTheGrave);
    // No ally exists, so the return no-ops; the engine still does the rest
    // (destroy-self cost + discard), per CR do-as-much-as-possible.
    Dash.target(headJabRed);

    expectFabCard(Dash, reachBeyondTheGrave).toBeIn("graveyard");
    expectFabCard(Dash, headJabRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveAP(1);
  });
});
