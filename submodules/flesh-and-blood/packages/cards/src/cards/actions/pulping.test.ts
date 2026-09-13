import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { writhingBeastHulkRed } from "./writhing-beast-hulk.ts";
import { heartOfFyendalBlue } from "../resources/heart-of-fyendal.ts";
import { crackedBaubleYellow } from "../resources/cracked-bauble.ts";
import { nimblismBlue } from "./nimblism.ts";
import { pulpingRed } from "./pulping.ts";

describe("Pulping (MON223) AAA", () => {
  it("happy: discarding a 6+ {p} card this way grants dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [pulpingRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [
          writhingBeastHulkRed,
          writhingBeastHulkRed,
          writhingBeastHulkRed,
          writhingBeastHulkRed,
          writhingBeastHulkRed,
          writhingBeastHulkRed,
        ],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(rhinar).attackWith(pulpingRed);
    expect(game.combat()?.activeLink?.keywords).toContain("dominate");
  });

  it("boundary: discarding a sub-6 {p} card does not grant dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [pulpingRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [
          heartOfFyendalBlue,
          crackedBaubleYellow,
          heartOfFyendalBlue,
          crackedBaubleYellow,
          heartOfFyendalBlue,
          crackedBaubleYellow,
        ],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(rhinar).attackWith(pulpingRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("dominate");
  });

  it("timing: fewer than 2 non-equipment defenders grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [pulpingRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [
          heartOfFyendalBlue,
          crackedBaubleYellow,
          heartOfFyendalBlue,
          crackedBaubleYellow,
          heartOfFyendalBlue,
          crackedBaubleYellow,
        ],
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.attackWith(pulpingRed);
    Dash.defendWith(nimblismBlue);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Rhinar).toHaveAP(1);
  });
});
