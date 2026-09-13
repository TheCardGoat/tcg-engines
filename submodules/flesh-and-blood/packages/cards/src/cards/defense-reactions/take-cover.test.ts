import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { takeCoverRed } from "./take-cover.ts";

describe("Take Cover family AAA", () => {
  it("reloads a hand card into an empty arsenal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [takeCoverRed, nimblismBlue], arsenal: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);
    Bravo.playAttack(snatchRed);
    game.toReaction("defender");
    game.playInstance(Azalea.id, Azalea.findCardInZone("hand", takeCoverRed), {}, "explicit");
    game.passBoth();
    Azalea.accept();
    game.passBoth();
    expectFabCard(Azalea, nimblismBlue).toBeIn("arsenal").toBeFaceDown();
  });
});
