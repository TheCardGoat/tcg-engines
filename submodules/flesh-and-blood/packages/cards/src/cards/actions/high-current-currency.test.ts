import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { energyPotionBlue } from "./energy-potion.ts";
import { highCurrentCurrencyBlue } from "./high-current-currency.ts";

describe("High Current Currency (PEN323) AAA", () => {
  it("happy: removes all energy counters from an opposing non-hero permanent and creates that many Gold tokens", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [highCurrentCurrencyBlue], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [{ card: energyPotionBlue, state: { energyCounters: 3 } }],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(highCurrentCurrencyBlue, {
      targetInstanceId: Dash.findCardInZone("arena", energyPotionBlue),
    });
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, energyPotionBlue).toHaveCounters(0, "energy");
    expect(Briar.zone("arena").filter((id) => id === "token:gold")).toHaveLength(3);
    expectFabCard(Briar, highCurrentCurrencyBlue).toBeIn("graveyard");
  });

  it("boundary: a permanent with 0 energy counters creates no Gold", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [highCurrentCurrencyBlue], actionPoints: 1, deck: 6 },
      { hero: dash, arena: [energyPotionBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(highCurrentCurrencyBlue, {
      targetInstanceId: Dash.findCardInZone("arena", energyPotionBlue),
    });
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, energyPotionBlue).toHaveCounters(0, "energy");
    expect(Briar.zone("arena")).not.toContain("token:gold");
    expectFabPlayer(Briar).toHaveAP(0);
  });
});
