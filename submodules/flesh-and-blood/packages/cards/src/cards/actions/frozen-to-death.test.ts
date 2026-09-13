import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { jarlVetreiI } from "../heroes/jarl-vetrei-i.ts";
import { dash } from "../heroes/dash.ts";
import { blizzardBlue } from "../instants/blizzard.ts";
import { ironrotHelm } from "../equipment/ironrot-helm.ts";
import { frozenToDeathBlue } from "./frozen-to-death.ts";

describe("Frozen to Death (AJV020) AAA", () => {
  it("happy: you may create a Frostbite token in an exposed equipment zone", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        hand: [frozenToDeathBlue, blizzardBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);
    const Dash = game.as(dash);

    Jarl.play(frozenToDeathBlue, { fuse: true, fuseCards: [blizzardBlue] });
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    const frostbites = [
      ...Dash.zone("head"),
      ...Dash.zone("chest"),
      ...Dash.zone("arms"),
      ...Dash.zone("legs"),
    ].filter((id) => id === "token:frostbite");
    expect(frostbites.length).toBeGreaterThanOrEqual(1);
    expectFabCard(Jarl, frozenToDeathBlue).toBeIn("graveyard");
  });

  it("boundary: without fusion, the -1{d} equipment is not destroyed", () => {
    const game = FabTestEngine.start(
      { hero: jarlVetreiI, hand: [frozenToDeathBlue], resourcePoints: 3, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        head: [{ card: ironrotHelm, state: { defenseCounterTotal: -1 } }],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);
    const Dash = game.as(dash);

    Jarl.play(frozenToDeathBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dash, ironrotHelm).toBeIn("head");
    expectFabCard(Jarl, frozenToDeathBlue).toBeIn("graveyard");
    expectFabPlayer(Jarl).toHaveAP(0);
  });
});
