import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { puffin } from "../heroes/puffin.ts";
import { goldenSkullYellow } from "./golden-skull.ts";

describe("Golden Skull (OMN240) AAA", () => {
  it("happy: this counts as a Gold after it enters arena", () => {
    const game = FabTestEngine.start(
      { hero: puffin, hand: [goldenSkullYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);
    Puffin.play(goldenSkullYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Puffin, goldenSkullYellow).toBeIn("arena").toHaveName("Gold");
    game.helpers.expectLog("flesh-and-blood.gain-name", {
      cardName: "Golden Skull",
      gainedName: "Gold",
    });
    expectFabPlayer(Puffin).toHaveAP(1);
  });

  it("boundary: it is an Item in arena, not an attack", () => {
    const game = FabTestEngine.start(
      { hero: puffin, hand: [goldenSkullYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);
    Puffin.play(goldenSkullYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Puffin, goldenSkullYellow).toBeIn("arena");
    expect(Puffin.zone("combatChain")).toHaveLength(0);
  });

  it("timing: go again refunds the action point on resolution", () => {
    const game = FabTestEngine.start(
      { hero: puffin, hand: [goldenSkullYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);
    Puffin.play(goldenSkullYellow);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Puffin).toHaveAP(1);
  });
});
