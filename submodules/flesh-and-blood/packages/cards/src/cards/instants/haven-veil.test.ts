import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { prism } from "../heroes/prism.ts";
import { crackedBaubleYellow } from "../resources/cracked-bauble.ts";
import { havenVeilBlue, havenVeilRed, havenVeilYellow } from "./haven-veil.ts";

const variants = [
  { label: "Haven Veil Red (OMN137)", card: havenVeilRed, amount: 3 },
  { label: "Haven Veil Yellow (OMN138)", card: havenVeilYellow, amount: 2 },
  { label: "Haven Veil Blue (OMN139)", card: havenVeilBlue, amount: 1 },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card, amount }) => {
  it(`happy: prevents ${amount} arcane damage on entering the arena`, () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: prism, hand: [card], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Prism = game.as(prism);

    Blaze.play(volticBoltRed, { target: Prism.id });
    Blaze.pass();
    Prism.play(card);
    game.untilIdle();

    expectFabPlayer(Prism).toHaveLife(20 - (5 - amount));
    expectFabCard(Prism, card).toBeIn("arena");
  });

  it("boundary: the prevention lasts only through the current turn", () => {
    const game = FabTestEngine.start(
      { hero: prism, hand: [card], life: 20, deck: 6 },
      {
        hero: blazeFiremind,
        hand: [volticBoltRed, crackedBaubleYellow],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Blaze = game.as(blazeFiremind);

    Prism.play(card);
    game.untilIdle();
    Prism.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Blaze.play(volticBoltRed, { pitch: crackedBaubleYellow, target: Prism.id });
    game.untilIdle();

    expectFabPlayer(Prism).toHaveLife(15);
    expectFabCard(Prism, card).toBeIn("arena");
  });

  it("timing: the aura is destroyed at the beginning of its action phase", () => {
    const game = FabTestEngine.start(
      { hero: prism, hand: [card], deck: 6 },
      { hero: blazeFiremind, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Blaze = game.as(blazeFiremind);

    Prism.play(card);
    game.untilIdle();
    Prism.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Blaze.endTurn();
    game.untilIdle();

    expectFabCard(Prism, card).toBeIn("graveyard");
  });
});
