import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { roninRenegadeRed } from "./ronin-renegade.ts";

describe("Ronin Renegade (FAI019) AAA", () => {
  it("happy: Fai's 3-power ninja attack refunds the action point", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [roninRenegadeRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(roninRenegadeRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabCard(Fai, roninRenegadeRed).toBeIn("graveyard");
    expectFabPlayer(Fai).toHaveAP(1);
  });

  it("boundary: a Generic attack without go again does not print the keyword", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(fai).attackWith(snatchRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    expectFabPlayer(game.as(fai)).toHaveAP(0);
  });

  it("timing: go again refunds at chain-link resolution, not on declaration", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [roninRenegadeRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(roninRenegadeRed);
    expectFabPlayer(Fai).toHaveAP(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveAP(1);
  });
});
