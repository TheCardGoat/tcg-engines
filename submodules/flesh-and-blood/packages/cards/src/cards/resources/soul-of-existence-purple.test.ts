import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { soulOfExistencePurple } from "./soul-of-existence-purple.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { darkArcaniteBoots } from "../equipment/dark-arcanite-boots.ts";

/**
 * Soul of Existence (IAR000) — Shadow Resource - Gem, Legendary, pitch 4.
 * Printed: when this is pitched, lose 1{h}.
 */

describe("Soul of Existence (IAR000) AAA", () => {
  it("happy: pitching this to play a card loses 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [brutalAssaultBlue, soulOfExistencePurple],
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
    game.helpers.resolveRestOfCombat();

    expectFabCard(Chane, soulOfExistencePurple).toBeIn("pitch").toHaveColor("Purple");
    expectFabPlayer(Chane).toHaveLife(19).toHaveResourceCount(2);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("UST notes: pitching this from an effect still loses 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, soulOfExistencePurple],
        life: 20,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.activate(tuffnut);
    game.untilIdle();

    expectFabCard(Tuffnut, soulOfExistencePurple).toBeIn("pitch");
    expectFabPlayer(Tuffnut).toHaveLife(19);
  });

  it("UST notes: the pitch life loss is not damage and is not prevented by Shadow Resist", () => {
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
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Chane).toHaveLife(19);
    expectFabCard(Chane, darkArcaniteBoots).toBeIn("legs");
  });

  it("boundary: remaining in hand without pitching does not lose life", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [brutalAssaultBlue, soulOfExistencePurple],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.attackWith(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Chane, soulOfExistencePurple).toBeIn("hand");
    expectFabPlayer(Chane).toHaveLife(20);
  });

  it("timing: pitching a non-Gem does not lose life", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [brutalAssaultBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.must.pitch(nimblismBlue).playAttack(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Chane).toHaveLife(20);
  });
});
