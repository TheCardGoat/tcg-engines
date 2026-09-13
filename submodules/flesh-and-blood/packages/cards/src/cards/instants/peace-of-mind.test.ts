import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { snatchRed } from "../actions/snatch.ts";
import { peaceOfMindBlue, peaceOfMindRed, peaceOfMindYellow } from "./peace-of-mind.ts";

const variants = [
  { label: "Peace of Mind Red (OUT231)", card: peaceOfMindRed, amount: 4 },
  { label: "Peace of Mind Yellow (OUT232)", card: peaceOfMindYellow, amount: 3 },
  { label: "Peace of Mind Blue (OUT233)", card: peaceOfMindBlue, amount: 2 },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card, amount }) => {
  it(`happy: prevents the next ${amount} physical damage and creates a Ponder`, () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { hero: dash, hand: [card], resourcePoints: 2, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Dash.play(card);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20 - (4 - amount));
    expectFabToken(game, "ponder").toHaveCount(1);
    expectFabCard(Dash, card).toBeIn("graveyard");
  });

  it("boundary: arcane damage is not prevented and Ponder is still created", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [card], resourcePoints: 2, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(volticBoltRed, { target: Dash.id });
    Blaze.pass();
    Dash.play(card);
    game.passBoth();
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabToken(game, "ponder").toHaveCount(1);
  });

  it(`timing: a second physical hit is not prevented after ${amount} is used`, () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed], actionPoints: 2, life: 20, deck: 6 },
      { hero: dash, hand: [card], resourcePoints: 2, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const snatches = Bravo.cardsIn("hand", snatchRed);

    Bravo.playAttack(snatches[0]!);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Dash.play(card);
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(20 - (4 - amount));

    Bravo.playAttack(snatches[1]!);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(20 - (4 - amount) - 4);
  });
});
