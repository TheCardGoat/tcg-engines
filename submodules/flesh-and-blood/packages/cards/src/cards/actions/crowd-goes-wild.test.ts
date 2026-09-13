import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { tuffnut } from "../heroes/tuffnut.ts";
import { dash } from "../heroes/dash.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { nimblismBlue } from "./nimblism.ts";
import { crowdGoesWildYellow } from "./crowd-goes-wild.ts";

describe("Crowd Goes Wild (SUP019) AAA", () => {
  it("happy: after the crowd cheers you this costs {r}{r}{r} less and hits for 6", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [crowdGoesWildYellow],
        deck: [
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          commandAndConquerRed,
        ],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.activate(tuffnut);
    game.helpers.resolveUntilIdle();

    expect(Tuffnut.zone("arena").filter((id) => id === "token:toughness")).toHaveLength(1);

    Tuffnut.attackWith(crowdGoesWildYellow);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabCard(Tuffnut, crowdGoesWildYellow).toBeIn("graveyard");
  });

  it("boundary: without a cheer this still costs 3 and cannot be played for free", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [crowdGoesWildYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    expect(() => Tuffnut.attackWith(crowdGoesWildYellow)).toThrow();
    expectFabCard(Tuffnut, crowdGoesWildYellow).toBeIn("hand");
  });

  it("timing: paying the printed 3 without a cheer still plays the attack", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [crowdGoesWildYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.attackWith(crowdGoesWildYellow);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    expectFabPlayer(Tuffnut).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });
});
