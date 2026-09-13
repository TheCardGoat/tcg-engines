import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { regainComposureBlue } from "./regain-composure.ts";

describe("Regain Composure (SEA210) AAA", () => {
  it("happy: next attack gets +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [regainComposureBlue, snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(regainComposureBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
  });

  it("boundary: a later second attack is not buffed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [regainComposureBlue, snatchRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(regainComposureBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    Bravo.playAttack(brutalAssaultBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the play AP", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [regainComposureBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(regainComposureBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, regainComposureBlue).toBeIn("graveyard");
    expect(game.combat()).toBeNull();
  });
});
