import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { emissaryOfMoonRed } from "./emissary-of-moon.ts";

describe("Emissary of Moon (MST197) AAA", () => {
  it("happy: on attack, put a hand card on the bottom to draw", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [emissaryOfMoonRed, nimblismBlue],
        actionPoints: 1,
        deckTop: [snatchRed],
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(emissaryOfMoonRed);
    game.passBoth();
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: nimblismBlue.canonicalId,
    });

    expect(Dash.zone("deck")).toContain(nimblismBlue.canonicalId);
    expectFabCard(Dash, snatchRed).toBeIn("hand");
    expectFabPlayer(game.as(bravo)).toHaveLife(16);
  });

  it("boundary: declining the bottom draws nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [emissaryOfMoonRed, nimblismBlue],
        actionPoints: 1,
        deckTop: [snatchRed],
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(emissaryOfMoonRed);
    game.passBoth();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
    expectFabPlayer(Dash).toHaveAP(0);
  });

  it("timing: printed attack is 4{p} with no go again", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [emissaryOfMoonRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(emissaryOfMoonRed);
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
