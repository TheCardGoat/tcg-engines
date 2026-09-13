import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { dash } from "../heroes/dash.ts";
import { coalescenceMirageRed } from "./coalescence-mirage.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { pierceRealityBlue } from "./pierce-reality.ts";

describe("Pierce Reality (EVR143) AAA", () => {
  it("happy: the first Illusionist attack action this turn gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [pierceRealityBlue, coalescenceMirageRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.play(pierceRealityBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Zyggy, pierceRealityBlue).toBeIn("arena");

    Zyggy.attackWith(coalescenceMirageRed);
    // Coalescence Mirage base 7 + 2.
    expect(game.combat()?.activeLink?.attackPower).toBe(9);
  });

  it("boundary: a Generic attack action does not get the +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [pierceRealityBlue, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.play(pierceRealityBlue);
    game.helpers.resolveUntilIdle();
    Zyggy.attackWith(brutalAssaultBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: Spectra — destroying the aura as the attack target closes combat without damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: zyggyStarlight,
        arena: [pierceRealityBlue],
        life: 40,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Zyggy = game.as(zyggyStarlight);
    const spectraId = Zyggy.findCardInZone("arena", pierceRealityBlue);

    Dash.play(snatchRed, { target: spectraId });
    expectFabCard(Zyggy, pierceRealityBlue).toBeIn("graveyard");
    game.helpers.resolveRestOfCombat();
    expect(game.combat()).toBeNull();
    expectFabPlayer(Zyggy).toHaveLife(40);
  });
});
