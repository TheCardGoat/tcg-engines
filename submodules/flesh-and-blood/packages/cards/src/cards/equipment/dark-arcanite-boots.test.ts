import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { soulOfExistencePurple } from "../resources/soul-of-existence-purple.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { darkArcaniteBoots } from "./dark-arcanite-boots.ts";

describe("Dark Arcanite Boots (IAR227) AAA", () => {
  it("UST notes: Shadow Resist may destroy this to prevent 1 damage from a Shadow-hero source, including a generic attack", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        legs: [darkArcaniteBoots],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.playAttack(snatchRed);
    Dash.defendWith([]);
    game.closeCombat({ optionals: "accept" });

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Dash.zone("legs")).not.toContain(darkArcaniteBoots.canonicalId);
  });

  it("UST notes boundary: a non-Shadow hero's damage cannot pay Shadow Resist", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        legs: [darkArcaniteBoots],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    Dash.defendWith([]);
    game.closeCombat({ optionals: "throw" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, darkArcaniteBoots).toBeIn("legs");
  });

  it("UST notes: Shadow Resist cannot prevent loss of life", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [brutalAssaultBlue, soulOfExistencePurple],
        legs: [darkArcaniteBoots],
        resourcePoints: 0,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.must.pitch(soulOfExistencePurple).playAttack(brutalAssaultBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Chane).toHaveLife(19);
    expectFabCard(Chane, darkArcaniteBoots).toBeIn("legs");
  });
});
