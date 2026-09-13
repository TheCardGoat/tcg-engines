import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sinkBelowRed } from "./sink-below.ts";

describe("Sink Below (WTR215) AAA", () => {
  it("happy: putting a card on the bottom draws a card", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [sinkBelowRed, snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Dash.play(sinkBelowRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: snatchRed.canonicalId,
    });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveHandCount(1);
    expect(Dash.zone("deck").at(-1)).toBe(snatchRed.canonicalId);
    expectFabCard(Dash, sinkBelowRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: declining the optional does not draw", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [sinkBelowRed, snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Dash.play(sinkBelowRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, snatchRed).toBeIn("hand");
    expect(Dash.zone("deck")).toHaveLength(4);
  });
});
