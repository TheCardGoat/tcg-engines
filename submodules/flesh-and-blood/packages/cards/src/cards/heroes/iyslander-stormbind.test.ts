import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { blizzardBlue } from "../instants/blizzard.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { iyslanderStormbind } from "./iyslander-stormbind.ts";

describe("Iyslander, Stormbind (UPR102) AAA", () => {
  it("happy: Ice instant on an opponent's turn creates a Frostbite under them", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: iyslanderStormbind,
        hand: [blizzardBlue],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).playAttack(snatchRed, { stopAt: "defend" });
    game.toReaction("defender");
    game.as(iyslanderStormbind).play(blizzardBlue);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(game.as(dash)).toHaveTokenCount("frostbite", 1);
  });

  it("core mechanic: not your turn — a blue non-attack action from arsenal plays as an instant", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: iyslanderStormbind, arsenal: [nimblismBlue], actionPoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iys = game.as(iyslanderStormbind);

    game.as(dash).playAttack(snatchRed, { stopAt: "defend" });
    game.toReaction("defender");
    Iys.playFromArsenal(nimblismBlue);
    game.untilIdle({ ordering: "listed" });

    // Playing an Action outside her own turn is only legal as the printed
    // instant — the card resolves into the graveyard.
    expectFabCard(Iys, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: adult hero is 36 life", () => {
    const game = FabTestEngine.start(
      { hero: iyslanderStormbind, deck: 6 },
      { hero: dash, deck: 6 },
    );
    expectFabPlayer(game.as(iyslanderStormbind)).toHaveLife(36);
  });

  it("timing: Ice on your own turn does not mint opponent Frostbite", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslanderStormbind,
        hand: [blizzardBlue, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iys = game.as(iyslanderStormbind);

    Iys.playAttack(snatchRed, { stopAt: "defend" });
    game.toReaction("attacker");
    Iys.play(blizzardBlue);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(game.as(dash)).toHaveTokenCount("frostbite", 0);
    expectFabCard(Iys, blizzardBlue).toBeIn("graveyard");
  });
});
