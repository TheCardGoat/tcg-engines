import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { soulReapingRed } from "./soul-reaping.ts";
import { chane } from "../heroes/chane.ts";
import { levia } from "../heroes/levia.ts";
import { snatchRed } from "./snatch.ts";
import { shadenSwingYellow } from "./shaden-swing.ts";
import { diabolicOfferingBlue } from "./diabolic-offering.ts";

describe("Diabolic Offering (DTD107) AAA", () => {
  it("happy: a 6{p} card put into banished this turn makes this 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [soulReapingRed, shadenSwingYellow, diabolicOfferingBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], soul: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    game.playInstance(
      Chane.id,
      Chane.findCardInZone("hand", soulReapingRed),
      { target: Dash.id },
      "explicit",
    );
    Chane.accept();
    Chane.target(shadenSwingYellow);
    game.advanceUntil({ stopAt: "defend" });
    game.helpers.resolveRestOfCombat();

    Chane.playAttack(diabolicOfferingBlue);

    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: a 6{p} card already in banished before this turn leaves this at 0{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [diabolicOfferingBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.playAttack(diabolicOfferingBlue);

    expectCombat(game).toHaveAttackPower(0);
  });

  it("timing: Blood Debt taxes 1 at end of turn while a copy remains public-banished", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        banished: [diabolicOfferingBlue],
        hand: [],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.endTurn();
    game.untilIdle();

    expectFabPlayer(Levia).toHaveLife(19);
    expectFabCard(Levia, diabolicOfferingBlue).toBeBanished();
  });
});
