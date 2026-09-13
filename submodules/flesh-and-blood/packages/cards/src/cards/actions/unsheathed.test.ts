import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { sharpenSteelRed } from "./sharpen-steel.ts";
import { unsheathedRed } from "./unsheathed.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Unsheathed (ROS248) AAA", () => {
  it("gives the next sword attack +3 but not go again at exactly twice base power", () => {
    const game = FabTestEngine.start(
      { hero: dorinthea, weapon1: [dawnblade], hand: [unsheathedRed], resourcePoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Dori = game.as(dorinthea);

    Dori.play(unsheathedRed);
    game.passBoth();
    Dori.activate(dawnblade);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    // Arrange the optional Dorinthea re-attack decision explicitly; this
    // scenario isolates Unsheathed's no-go-again boundary.
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(game.as(dash).life()).toBe(14);
    expect(Dori.actionPoints()).toBe(0);
  });

  it("synergizes with an additional sword modifier to exceed twice base and gain go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [unsheathedRed, sharpenSteelRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Dori = game.as(dorinthea);

    Dori.play(unsheathedRed);
    game.passBoth();
    Dori.play(sharpenSteelRed);
    game.passBoth();
    Dori.activate(dawnblade);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(9);
    // Decline Dorinthea's optional re-attack so the assertion remains about
    // Unsheathed's granted go again on the first Dawnblade attack.
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Dori.actionPoints()).toBe(1);
  });
});
