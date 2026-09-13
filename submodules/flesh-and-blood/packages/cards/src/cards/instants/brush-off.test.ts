import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { flashBoltBlue } from "./flash-bolt.ts";
import { flashBoltRed } from "./flash-bolt.ts";
import { flashBoltYellow } from "./flash-bolt.ts";
import { brushOffBlue, brushOffRed, brushOffYellow } from "./brush-off.ts";

const variants = [
  { label: "Brush Off Red (OUT228)", card: brushOffRed, bolt: flashBoltRed, threshold: 3 },
  { label: "Brush Off Yellow (OUT229)", card: brushOffYellow, bolt: flashBoltYellow, threshold: 2 },
  { label: "Brush Off Blue (OUT230)", card: brushOffBlue, bolt: flashBoltBlue, threshold: 1 },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card, bolt, threshold }) => {
  it(`happy: the next ${threshold} or less damage is fully prevented`, () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [bolt],
        resourcePoints: 2,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [card], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(bolt, { target: Dash.id });
    Blaze.pass();
    Dash.play(card);
    game.passBoth();
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, card).toBeIn("graveyard");
  });

  it("boundary: 5 damage is not reduced", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [card], life: 20, deck: 6 },
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
  });

  it("timing: only the next matching damage this turn is prevented", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [bolt, bolt],
        resourcePoints: 4,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [card], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);
    const bolts = Blaze.cardsIn("hand", bolt);

    Blaze.play(bolts[0]!, { target: Dash.id });
    Blaze.pass();
    Dash.play(card);
    game.passBoth();
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(20);

    Blaze.play(bolts[1]!, { target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(20 - threshold);
  });
});
