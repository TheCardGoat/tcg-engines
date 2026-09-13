import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { lastDitchEffortBlue } from "./last-ditch-effort.ts";

describe("Last Ditch Effort (WTR161) AAA", () => {
  it("happy: empty deck grants +4{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [lastDitchEffortBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(lastDitchEffortBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(12);
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: cards remaining in deck keeps printed 4 power and spends the AP", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [lastDitchEffortBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(lastDitchEffortBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Briar).toHaveAP(0);
  });
});
