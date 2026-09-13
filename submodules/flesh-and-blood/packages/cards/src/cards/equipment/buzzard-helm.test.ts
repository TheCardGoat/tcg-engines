import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { bucklingBlowBlue } from "../actions/buckling-blow.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { snatchRed } from "../actions/snatch.ts";
import { azalea } from "../heroes/azalea.ts";
import { buzzardHelm } from "./buzzard-helm.ts";

describe("Buzzard Helm (PEN002) AAA", () => {
  it("happy: defending discards the drawn 6-power card and the helm blocks at 2 this turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [headJabRed], actionPoints: 1, deck: 6 },
      {
        hero: azalea,
        hand: [],
        deckTop: [bucklingBlowBlue],
        deck: 6,
        head: [buzzardHelm],
        life: 20,
      },
    );
    const Azalea = game.as(azalea);
    const Bravo = game.as(bravo);

    Bravo.playAttack(headJabRed);
    Azalea.defendWith(buzzardHelm);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Azalea, bucklingBlowBlue).toBeIn("graveyard");
    expectFabPlayer(Azalea).toHaveHandCount(0);
    expectFabPlayer(Azalea).toHaveLife(19);
    expectFabCard(Azalea, buzzardHelm).toBeIn("head");
  });

  it("boundary: a sub-6-power discard leaves the helm at printed 1{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [headJabRed], actionPoints: 1, deck: 6 },
      {
        hero: azalea,
        hand: [],
        deckTop: [snatchRed],
        deck: 6,
        head: [buzzardHelm],
        life: 20,
      },
    );
    const Azalea = game.as(azalea);
    const Bravo = game.as(bravo);

    Bravo.playAttack(headJabRed);
    Azalea.defendWith(buzzardHelm);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Azalea, snatchRed).toBeIn("graveyard");
    expectFabPlayer(Azalea).toHaveLife(18);
    // Temper: defending at printed 1{d} destroys the helm at chain close.
    expectFabCard(Azalea, buzzardHelm).toBeIn("graveyard");
  });

  it("timing: Temper still taxes one -1{d} counter at chain close", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [headJabRed], actionPoints: 1, deck: 6 },
      {
        hero: azalea,
        hand: [],
        deckTop: [bucklingBlowBlue],
        deck: 6,
        head: [buzzardHelm],
        life: 20,
      },
    );
    const Azalea = game.as(azalea);
    const Bravo = game.as(bravo);

    Bravo.playAttack(headJabRed);
    Azalea.defendWith(buzzardHelm);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Azalea, buzzardHelm).toBeIn("head");
    expectFabCard(Azalea, buzzardHelm).toHaveDefenseCounters(-1);
  });
});
