import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { lightningSurgeRed } from "./lightning-surge.ts";

describe("Lightning Surge (ELE189) AAA", () => {
  it("happy: played from arsenal this gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        arsenal: [lightningSurgeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(lightningSurgeRed, { from: "arsenal" });
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: played from hand this spends the action point", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [lightningSurgeRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(lightningSurgeRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveAP(0);
  });
});
