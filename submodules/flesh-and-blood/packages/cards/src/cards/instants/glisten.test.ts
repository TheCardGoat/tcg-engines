import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { raydnDuskbane } from "../weapons/raydn-duskbane.ts";
import { glistenBlue } from "./glisten.ts";
import { glistenRed } from "./glisten.ts";
import { glistenYellow } from "./glisten.ts";

const variants = [
  { label: "Glisten Red (MON069)", card: glistenRed, amount: 4 },
  { label: "Glisten Yellow (MON070)", card: glistenYellow, amount: 3 },
  { label: "Glisten Blue (MON071)", card: glistenBlue, amount: 2 },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card, amount }) => {
  it(`happy: distributes up to ${amount} +1{p} counters to a weapon`, () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [raydnDuskbane],
        hand: [card],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(card);
    game.untilIdle({ entityTargets: "maximum" });

    expectFabCard(Boltyn, raydnDuskbane).toHavePower(amount);
    expectFabCard(Boltyn, card).toBeIn("graveyard");
    expectFabPlayer(Boltyn).toHaveAP(1);
  });
});

describe("Glisten boundaries", () => {
  it("does not create counters when no weapon is controlled", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [glistenRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(glistenRed);
    game.untilIdle({ entityTargets: "maximum" });

    expectFabCard(Boltyn, glistenRed).toBeIn("graveyard");
    expectFabPlayer(Boltyn).toHaveAP(1);
  });

  it("removes its +1{p} counters at the beginning of the controller's end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [raydnDuskbane],
        hand: [glistenRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(glistenRed);
    game.untilIdle({ entityTargets: "maximum" });
    expectFabCard(Boltyn, raydnDuskbane).toHavePower(4);

    Boltyn.endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Boltyn, raydnDuskbane).toHavePower(0);
  });
});
