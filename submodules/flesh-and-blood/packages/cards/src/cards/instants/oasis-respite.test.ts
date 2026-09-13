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
import { oasisRespiteBlue, oasisRespiteRed, oasisRespiteYellow } from "./oasis-respite.ts";

const variants = [
  { label: "Oasis Respite Red (DRO027)", card: oasisRespiteRed, amount: 4 },
  { label: "Oasis Respite Yellow (UPR222)", card: oasisRespiteYellow, amount: 3 },
  { label: "Oasis Respite Blue (UPR223)", card: oasisRespiteBlue, amount: 2 },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card, amount }) => {
  it(`happy: prevents ${amount} damage this turn and may gain 1 life when behind`, () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [card], resourcePoints: 1, life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(volticBoltRed, { target: Dash.id });
    Blaze.pass();
    Dash.exec({
      move: "begin-play",
      payload: { instanceId: Dash.findCardInZone("hand", card) },
    });
    Dash.chooseTargetPlayers(Dash);
    Dash.chooseTargets(Blaze.cardIn("stack", volticBoltRed));
    game.passBoth();
    Dash.chooseBoolean(true);
    game.passBoth();
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(15 - (5 - amount) + 1);
    expectFabCard(Dash, card).toBeIn("graveyard");
  });

  it("boundary: a hero who does not have less life cannot gain the bonus life", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [card], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { hero: blazeFiremind, life: 17, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(card, { target: Dash.id });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, card).toBeIn("graveyard");
  });

  it("timing: only the chosen source is prevented", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed, volticBoltRed],
        resourcePoints: 4,
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [card], resourcePoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);
    const bolts = Blaze.cardsIn("hand", volticBoltRed);

    Blaze.play(bolts[0]!, { target: Dash.id });
    Blaze.pass();
    Dash.exec({
      move: "begin-play",
      payload: { instanceId: Dash.findCardInZone("hand", card) },
    });
    Dash.chooseTargetPlayers(Dash);
    Dash.chooseTargets(Blaze.cardIn("stack", bolts[0]!));
    game.passBoth();
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(20 - (5 - amount));

    Blaze.play(bolts[1]!, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(20 - (5 - amount) - 5);
  });
});
