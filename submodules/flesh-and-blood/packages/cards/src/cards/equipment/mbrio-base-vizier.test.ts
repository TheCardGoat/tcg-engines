import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { hyperDriverRed } from "../actions/hyper-driver.ts";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { snatchRed } from "../actions/snatch.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { mbrioBaseVizier } from "./mbrio-base-vizier.ts";

describe("M'brio Base Vizier (PEN058) AAA", () => {
  it("happy: removing a steam counter from the Hyper Driver prevents 1 of 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [hyperDriverRed], resourcePoints: 1, head: [mbrioBaseVizier], deck: 6 },
      {
        hero: blazeFiremind,
        hand: [volticBoltRed, snatchRed, headJabRed],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Dash.play(hyperDriverRed);
    game.untilIdle();
    Dash.endTurn();
    const boltId = Blaze.findCardInZone("hand", volticBoltRed);
    game.playInstance(
      Blaze.id,
      boltId,
      { target: Dash.id, pitch: [snatchRed, headJabRed] },
      "explicit",
    );
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);
    Dash.target(hyperDriverRed);
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, hyperDriverRed).toHaveCounters(2, "steam");
  });

  it("boundary: with no Hyper Driver the bolt lands for the full 5", () => {
    const game = FabTestEngine.start(
      { hero: dash, head: [mbrioBaseVizier], deck: 6 },
      {
        hero: blazeFiremind,
        hand: [volticBoltRed, snatchRed, headJabRed],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Dash.endTurn();
    Blaze.must.pitch(snatchRed, headJabRed).play(volticBoltRed, { target: Dash.id });
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(15);
  });
});
