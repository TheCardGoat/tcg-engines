import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { flashBoltRed } from "./flash-bolt.ts";
import { snatchRed } from "../actions/snatch.ts";
import { blessingOfSerenityRed } from "./blessing-of-serenity.ts";

describe("Blessing of Serenity (CRU041/042/043) AAA", () => {
  it("happy: the red family member prevents 3 of the next physical damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [blessingOfSerenityRed], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith();
    game.toReaction();
    game.helpers.passPriorityTo(Dash);
    Dash.play(blessingOfSerenityRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Dash, blessingOfSerenityRed).toBeIn("graveyard");
  });

  it("boundary: arcane damage does not consume the physical prevention", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [flashBoltRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [blessingOfSerenityRed], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    game.helpers.passPriorityTo(Dash);
    Dash.play(blessingOfSerenityRed);
    game.passBoth();
    Bravo.play(flashBoltRed, { target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(17);

    Bravo.playAttack(snatchRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: the prevention is consumed by one physical damage event", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      { hero: dash, life: 20, hand: [blessingOfSerenityRed], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const snatches = Bravo.cardsIn("hand", snatchRed);

    Bravo.playAttack(snatches[0]!);
    Dash.defendWith();
    game.toReaction();
    game.helpers.passPriorityTo(Dash);
    Dash.play(blessingOfSerenityRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    Bravo.playAttack(snatches[1]!);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(15);
  });
});
