import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { shuckBlue } from "./shuck.ts";

describe("Shuck (AHA024) AAA", () => {
  it("happy: playing Shuck creates one Flurry token and Shuck goes to the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: halaBladesaintOfTheVow, hand: [shuckBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(shuckBlue);
    game.helpers.resolveUntilIdle();

    expect(Hala.zone("arena")).toContain("token:flurry");
    expectFabPlayer(Hala).toHaveTokenCount("flurry", 1);
    expectFabCard(Hala, shuckBlue).toBeIn("graveyard");
  });

  it("boundary: the Flurry token is created only under the controller's arena", () => {
    const game = FabTestEngine.start(
      { hero: halaBladesaintOfTheVow, hand: [shuckBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Dash = game.as(dash);

    Hala.play(shuckBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveTokenCount("flurry", 0);
    expect(Dash.zone("arena")).not.toContain("token:flurry");
  });

  it("timing: the created Flurry is destroyed when its controller activates a weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        hand: [shuckBlue],
        weapon1: [zenithBlade],
        actionPoints: 2,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(shuckBlue);
    game.helpers.resolveUntilIdle();
    expect(Hala.zone("arena")).toContain("token:flurry");

    Hala.activate(zenithBlade);
    game.passBoth();
    Hala.decline();
    game.helpers.resolveRestOfCombat();

    expect(Hala.zone("arena")).not.toContain("token:flurry");
  });
});
