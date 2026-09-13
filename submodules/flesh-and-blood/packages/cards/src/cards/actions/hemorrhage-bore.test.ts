import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { hemorrhageBoreRed } from "./hemorrhage-bore.ts";

describe("Hemorrhage Bore (DYN162) AAA", () => {
  it("happy: a hit destroys a card in their arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: hemorrhageBoreRed, state: { aimCounters: 1 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);
    Azalea.attackWith(hemorrhageBoreRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: a miss leaves their arsenal intact", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: hemorrhageBoreRed, state: { aimCounters: 1 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, snatchRed],
        arsenal: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);
    Azalea.attackWith(hemorrhageBoreRed, { from: "arsenal" });
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, snatchRed]);
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("arsenal")).toContain(nimblismBlue.canonicalId);
  });

  it("boundary: an arrow cannot be played from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [hemorrhageBoreRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const rej = Azalea.expectFailure({
      move: "begin-play",
      payload: { instanceId: Azalea.findCardInZone("hand", hemorrhageBoreRed), from: "hand" },
    });
    expect(rej.errorCode).toBe("arrow_must_come_from_arsenal");
  });
});
