import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { jarlVetreiI } from "../heroes/jarl-vetrei-i.ts";
import { dash } from "../heroes/dash.ts";
import { ironrotGauntlet } from "../equipment/ironrot-gauntlet.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { crumbleToEternityBlue as crumbleToEternity } from "./crumble-to-eternity.ts";

describe("Crumble to Eternity (AJV018) AAA", () => {
  it("happy: entering the arena may put a -1{d} counter on an equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        hand: [crumbleToEternity],
        arms: [ironrotGauntlet],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);

    Jarl.play(crumbleToEternity);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Jarl, crumbleToEternity).toBeIn("arena");
    expectFabCard(Jarl, ironrotGauntlet).toHaveDefenseCounters(-1);
  });

  it("boundary: declining the enter-arena optional leaves the equipment unmarked", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        hand: [crumbleToEternity],
        arms: [ironrotGauntlet],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);

    Jarl.play(crumbleToEternity);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Jarl, crumbleToEternity).toBeIn("arena");
    expectFabCard(Jarl, ironrotGauntlet).toHaveDefenseCounters(0);
  });

  it("timing: at the beginning of your next action phase this is destroyed and the next attack gets dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        hand: [crumbleToEternity, brutalAssaultBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);
    const Dash = game.as(dash);

    Jarl.play(crumbleToEternity);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Jarl, crumbleToEternity).toBeIn("arena");

    Jarl.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Jarl, crumbleToEternity).toBeIn("graveyard");

    Jarl.attackWith(brutalAssaultBlue, { pitch: [nimblismBlue, nimblismBlue] });
    expect(game.combat()?.activeLink?.keywords ?? []).toContain("dominate");
    expectFabPlayer(Jarl).toBeActive();
  });
});
