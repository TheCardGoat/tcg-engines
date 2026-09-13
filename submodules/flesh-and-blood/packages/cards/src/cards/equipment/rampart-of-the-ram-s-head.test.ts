import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { rampartOfTheRamSHead } from "./rampart-of-the-ram-s-head.ts";

describe("Rampart of the Ram's Head (ELE203) AAA", () => {
  it("happy: paying {r} after it defends grants +1{d} this combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        weapon2: [rampartOfTheRamSHead],
        resourcePoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(rampartOfTheRamSHead);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabPlayer(Bravo).toHaveResourceCount(0).toHaveLife(17);
    expectFabCard(Bravo, rampartOfTheRamSHead).toBeIn("weapon2");
  });

  it("boundary: declining the payment leaves printed 0 defense", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        weapon2: [rampartOfTheRamSHead],
        resourcePoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(rampartOfTheRamSHead);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Bravo).toHaveResourceCount(1).toHaveLife(16);
  });

  it("timing: +1{d} lasts until end of turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        weapon2: [rampartOfTheRamSHead],
        resourcePoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(rampartOfTheRamSHead);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expectFabCard(Bravo, rampartOfTheRamSHead).toHaveDefense(1);
    expectFabPlayer(Bravo).toHaveLife(17);

    Dash.endTurn();
    expectFabCard(Bravo, rampartOfTheRamSHead).toHaveDefense(0);
  });
});
