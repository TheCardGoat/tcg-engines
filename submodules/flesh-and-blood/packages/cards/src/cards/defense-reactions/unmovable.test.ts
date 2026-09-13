import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { unmovableRed } from "./unmovable.ts";

describe("Unmovable family AAA", () => {
  it("gets +1{d} when played from arsenal", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, arsenal: [unmovableRed], resourcePoints: 3, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    Bravo.play(unmovableRed, { from: "arsenal" });
    game.passBoth();
    expectFabCard(Bravo, unmovableRed).toHaveDefense(8);
  });

  it("stays at printed defense when played from hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [unmovableRed], resourcePoints: 3, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    Bravo.play(unmovableRed);
    expectFabCard(Bravo, unmovableRed).toHaveDefense(7);
  });
});
