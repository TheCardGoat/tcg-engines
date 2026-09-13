import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { flitteringChargeBlue } from "./flittering-charge.ts";
import { currentFunnelBlue as currentFunnel } from "./current-funnel.ts";

describe("Current Funnel (ROS074) AAA", () => {
  it("happy: if the last action this turn was Lightning, this gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [flitteringChargeBlue, currentFunnel],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(flitteringChargeBlue);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();
    Briar.attackWith(currentFunnel);

    expect(game.combat()?.activeLink?.attackPower).toBe(2);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("boundary: as the first action of the turn, its printed go again remains", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [currentFunnel], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).attackWith(currentFunnel);
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
    // Current Funnel has printed go again; only its conditional grant depends
    // on the prior Lightning action.
    expect(game.combat()?.activeLink?.keywords ?? []).toContain("go-again");
  });
});
