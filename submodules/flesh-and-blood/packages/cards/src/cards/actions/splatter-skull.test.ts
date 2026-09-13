import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { packHuntBlue } from "./pack-hunt.ts";
import { snatchRed } from "./snatch.ts";
import { maskOfMomentum } from "../equipment/mask-of-momentum.ts";
import { tectonicPlating } from "../equipment/tectonic-plating.ts";
import { braveforgeBracers } from "../equipment/braveforge-bracers.ts";
import { splatterSkullRed } from "./splatter-skull.ts";

describe("Splatter Skull (ROS243) AAA", () => {
  it("ends the game immediately when its attack damage reduces the opposing hero to zero", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [splatterSkullRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 6, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.attackWith(splatterSkullRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(0);
    expect(game.hasGameEnded()).toBe(true);
    expect(game.getGameEndResult().winnerId).toBe(Rhinar.id);
  });

  it("happy: on-hit moves a face-down intimidate-banished card to their graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [packHuntBlue, splatterSkullRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.attackWith(packHuntBlue);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Dash, snatchRed).toBeBanished();
    expectFabCard(Dash, snatchRed).toBeFaceDown();

    Rhinar.attackWith(splatterSkullRed);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: snatchRed.canonicalId,
    });

    expectFabPlayer(Dash).toHaveLife(10);
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
  });

  it("boundary: a miss does not move the intimidated card", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [packHuntBlue, splatterSkullRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snatchRed],
        head: [maskOfMomentum],
        chest: [tectonicPlating],
        arms: [braveforgeBracers],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.attackWith(packHuntBlue);
    game.helpers.resolveRestOfCombat();

    Rhinar.attackWith(splatterSkullRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([maskOfMomentum, tectonicPlating, braveforgeBracers]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, snatchRed).toBeBanished();
  });

  it("timing: a banished card that was not intimidated this turn is not moved", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [splatterSkullRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, banished: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.attackWith(splatterSkullRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Dash, snatchRed).toBeBanished();
  });
});
