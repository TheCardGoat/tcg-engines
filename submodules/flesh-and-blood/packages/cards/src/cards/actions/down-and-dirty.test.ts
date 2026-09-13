import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { downAndDirtyRed } from "./down-and-dirty.ts";

describe("Down and Dirty (OUT184) AAA", () => {
  it("happy: unblocked attack deals printed 6", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [downAndDirtyRed], resourcePoints: 2, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(downAndDirtyRed);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(bravo)).toHaveLife(14);
    expectFabCard(Dash, downAndDirtyRed).toBeIn("graveyard");
  });

  it("boundary: an arsenal card without this clause cannot defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: bravo, hand: [], arsenal: [snatchRed], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.expectFailure({
      move: "defend",
      payload: { instanceIds: [Bravo.findCardInZone("arsenal", snatchRed)] },
    });
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, snatchRed).toBeIn("arsenal");
  });

  it("timing: while it is in arsenal it may defend and reduces the attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: bravo, hand: [], arsenal: [downAndDirtyRed], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(downAndDirtyRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, downAndDirtyRed).toBeIn("graveyard");
  });
});
