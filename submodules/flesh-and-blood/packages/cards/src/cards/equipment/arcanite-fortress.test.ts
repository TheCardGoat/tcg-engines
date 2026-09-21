import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { bravo } from "../heroes/bravo.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { arcaniteFortress } from "./arcanite-fortress.ts";
import { arcaniteSkullcap } from "./arcanite-skullcap.ts";
import { nullruneGloves } from "./nullrune-gloves.ts";

const padding = () => [
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
];

// ROS notes: X is evaluated when Spellvoid is applied. Fortress counts itself.
// Opposing Arcanite equipment and own non-Arcanite equipment must not count.
describe("Arcanite Fortress (ROS211)", () => {
  for (const ownSkullcap of [false, true]) {
    for (const prevent of [false, true]) {
      it(`${ownSkullcap ? "two" : "one"} own Arcanite equipment: ${prevent ? "accept" : "decline"} Spellvoid against five arcane`, () => {
        const game = FabTestEngine.start(
          {
            hero: oscilio,
            life: 20,
            hand: [volticBoltRed],
            head: [arcaniteSkullcap],
            resourcePoints: 2,
            actionPoints: 1,
            deck: padding(),
          },
          {
            hero: dash,
            life: 20,
            chest: [arcaniteFortress],
            head: ownSkullcap ? [arcaniteSkullcap] : [],
            arms: [nullruneGloves],
            hand: [],
            resourcePoints: 0,
            deck: padding(),
          },
          FAB_MANUAL_HARNESS,
        );
        const Oscilio = game.as(oscilio);
        const Dash = game.as(dash);
        expectFabCard(Dash, arcaniteFortress).toHaveDefense(ownSkullcap ? 2 : 1);
        Oscilio.play(volticBoltRed, { target: Dash.id });
        game.passBoth();
        if (prevent) Dash.choose("spellvoid");
        else Dash.chooseOptions();
        game.untilIdle({ optionals: "throw", entityTargets: "throw" });
        expectFabPlayer(Dash)
          .toHaveLife(prevent ? (ownSkullcap ? 17 : 16) : 15)
          .toHaveResourceCount(0);
        expectFabCard(Dash, arcaniteFortress).toBeIn(prevent ? "graveyard" : "chest");
        expectFabCard(Dash, nullruneGloves).toBeIn("arms");
        if (ownSkullcap) expectFabCard(Dash, arcaniteSkullcap).toBeIn("head");
        expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(0).toHaveResourceCount(0);
        expectFabCard(Oscilio, volticBoltRed).toBeIn("graveyard");
        expectWait(game).toBeIdle();
      });
    }

    it(`${ownSkullcap ? "two" : "one"} defense prevents that much physical damage; Guardwell removes all remaining defense`, () => {
      const game = FabTestEngine.start(
        {
          hero: bravo,
          life: 20,
          hand: [snatchRed],
          head: [arcaniteSkullcap],
          actionPoints: 1,
          deck: padding(),
        },
        {
          hero: dash,
          life: 20,
          chest: [arcaniteFortress],
          head: ownSkullcap ? [arcaniteSkullcap] : [],
          arms: [nullruneGloves],
          hand: [],
          resourcePoints: 0,
          deck: padding(),
        },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);
      Bravo.playAttack(snatchRed);
      Dash.defendWith(arcaniteFortress);
      game.closeCombat({ optionals: "throw" });
      expectFabPlayer(Dash).toHaveLife(ownSkullcap ? 18 : 17);
      expectFabCard(Dash, arcaniteFortress)
        .toBeIn("chest")
        .toHaveDefenseCounters(ownSkullcap ? -2 : -1)
        .toHaveDefense(0);
      if (ownSkullcap) expectFabCard(Dash, arcaniteSkullcap).toHaveDefenseCounters(0);
      expectFabPlayer(Bravo).toHaveLife(20).toHaveAP(0).toHaveHandCount(1);
      expectFabCard(Bravo, snatchRed).toBeIn("graveyard");
      expectWait(game).toBeIdle();
    });
  }
});
