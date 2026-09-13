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
import { kassaiCintariSellsword } from "../heroes/kassai-cintari-sellsword.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { nimblismBlue } from "./nimblism.ts";
import { electrifyRed } from "./electrify.ts";

describe("Electrify family AAA", () => {
  it("happy: the next AAC hit this turn deals 3 extra damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [electrifyRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(electrifyRed);
    game.untilIdle();
    Dash.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(game.as(bravo)).toHaveLife(13);
  });

  it("boundary: a weapon hit does not take the extra 3 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiCintariSellsword,
        weapon1: [cintariSaber],
        hand: [electrifyRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiCintariSellsword);

    Kassai.play(electrifyRed);
    game.untilIdle();
    Kassai.activateAttack(cintariSaber);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });

  it("timing: playing from arsenal draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arsenal: [{ card: electrifyRed, state: { faceDown: false } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
        deckTop: [nimblismBlue],
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(electrifyRed, { from: "arsenal" });
    game.untilIdle();

    expectFabCard(Dash, electrifyRed).toBeIn("graveyard");
    expect(Dash.zone("hand")).toContain(nimblismBlue.canonicalId);
  });
});
