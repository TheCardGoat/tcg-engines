import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { coreReactionBlue, coreReactionRed, coreReactionYellow } from "./core-reaction.ts";

const variants = [
  { label: "Core Reaction Red (OMN103)", card: coreReactionRed, amount: 4 },
  { label: "Core Reaction Yellow (OMN104)", card: coreReactionYellow, amount: 3 },
  { label: "Core Reaction Blue (OMN105)", card: coreReactionBlue, amount: 2 },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card, amount }) => {
  it(`happy: the next action phase destroys the aura and deals ${amount} arcane damage`, () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [card], resourcePoints: 2, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(card);
    game.passBoth();
    expectFabCard(Oscilio, card).toBeIn("arena");
    Oscilio.endTurn();
    Dash.endTurn();
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Oscilio, card).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(20 - amount);
  });

  it("boundary: playing the Instant Aura does not spend an action point", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [card], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.play(card);
    game.passBoth();

    expectFabCard(Oscilio, card).toBeIn("arena");
    expectFabPlayer(Oscilio).toHaveAP(1);
  });
});
