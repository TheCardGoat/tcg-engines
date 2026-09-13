import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { crackedBaubleYellow } from "../resources/cracked-bauble.ts";
import { cripplingCrushRed } from "./crippling-crush.ts";

describe("Crippling Crush (WTR043) AAA", () => {
  it("happy: dealing 4 or more damage discards 2 random cards", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [cripplingCrushRed],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, snatchRed],
        life: 40,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.attackWith(cripplingCrushRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(29);
    expect(Dash.zone("hand").length).toBeLessThan(2);
    expect(Dash.zone("graveyard").length).toBeGreaterThanOrEqual(1);
  });

  it("boundary: blocked below 4 damage does not discard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [cripplingCrushRed],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, snatchRed, brutalAssaultBlue, wreckerRompBlue, crackedBaubleYellow],
        life: 40,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.attackWith(cripplingCrushRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, snatchRed, brutalAssaultBlue, wreckerRompBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(39);
    expectFabCard(Dash, crackedBaubleYellow).toBeIn("hand");
  });
});
