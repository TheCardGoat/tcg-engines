import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { crushingHeadacheRed } from "./crushing-headache.ts";

describe("Crushing Headache (IAR244) AAA", () => {
  it("happy: crush destroys arsenal and discards hand non-attack actions only", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [crushingHeadacheRed], resourcePoints: 6, deck: 6 },
      {
        hero: dash,
        hand: [nimblismBlue, snatchRed],
        arsenal: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(crushingHeadacheRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(10);
    expectFabCard(Dash, snatchRed).toBeIn("hand");
    expect(Dash.zone("hand")).toHaveLength(1);
    expect(Dash.zone("arsenal")).toHaveLength(0);
    expect(Dash.zone("graveyard")).toHaveLength(2);
  });

  it("boundary: damage below four does not reveal or remove the remaining hand", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [crushingHeadacheRed], resourcePoints: 6, deck: 6 },
      {
        hero: dash,
        hand: [nimblismBlue, brutalAssaultBlue, wreckerRompBlue, snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(crushingHeadacheRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, wreckerRompBlue, snatchRed]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });
});
