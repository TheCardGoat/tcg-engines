import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { fryRed } from "./fry.ts";
import { secondStrikeRed } from "./second-strike.ts";

describe("Second Strike (AUA016) AAA", () => {
  it("happy: after dealing damage this turn it gets +1{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [fryRed, secondStrikeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(fryRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(17);

    Briar.attackWith(secondStrikeRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: as the first damage this turn it stays at printed 3 with no go again", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [secondStrikeRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(secondStrikeRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveAP(0);
  });
});
