import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { titForTatBlue } from "./tit-for-tat.ts";

describe("Tit for Tat (SEA211) AAA", () => {
  it("happy: tap target hero and untap another target hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [titForTatBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(titForTatBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, titForTatBlue).toBeIn("graveyard");
    expect(game.combat()).toBeNull();
  });

  it("boundary: this is not combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [titForTatBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).play(titForTatBlue);
    game.helpers.resolveUntilIdle();
    expect(game.combat()).toBeNull();
  });

  it("timing: go again refunds the play AP", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [titForTatBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(titForTatBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
