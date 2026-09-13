import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { roninRenegadeRed } from "./ronin-renegade.ts";
import { blazeHeadlongRed } from "./blaze-headlong.ts";

describe("Blaze Headlong (FAI010) AAA", () => {
  it("happy: after another red card this turn, this gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [roninRenegadeRed, blazeHeadlongRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(roninRenegadeRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveAP(1);

    Fai.attackWith(blazeHeadlongRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabCard(Fai, blazeHeadlongRed).toBeIn("graveyard");
    expectFabPlayer(Fai).toHaveAP(1);
  });

  it("boundary: as the first red card this turn it does not get go again", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [blazeHeadlongRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(blazeHeadlongRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveAP(0);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
