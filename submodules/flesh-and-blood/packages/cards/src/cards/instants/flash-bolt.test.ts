import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { flashBoltBlue, flashBoltRed, flashBoltYellow } from "./flash-bolt.ts";

const variants = [
  { label: "Flash Bolt Red (OMN106)", card: flashBoltRed, amount: 3 },
  { label: "Flash Bolt Yellow (OMN107)", card: flashBoltYellow, amount: 2 },
  { label: "Flash Bolt Blue (OMN108)", card: flashBoltBlue, amount: 1 },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card, amount }) => {
  it(`happy: deals ${amount} arcane damage to the targeted hero`, () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [card], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(card, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(20 - amount);
    expectFabPlayer(Oscilio).toHaveAP(1);
    expectFabCard(Oscilio, card).toBeIn("graveyard");
  });

  it("boundary: only the targeted hero takes damage", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [card], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(card, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(20 - amount);
    expectFabPlayer(Oscilio).toHaveLife(18);
  });
});
