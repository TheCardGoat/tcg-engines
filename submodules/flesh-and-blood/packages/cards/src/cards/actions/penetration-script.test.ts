import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { snatchRed } from "./snatch.ts";
import { pulsewaveProtocolYellow } from "./pulsewave-protocol.ts";
import { penetrationScriptYellow } from "./penetration-script.ts";

describe("Penetration Script (EVO079) AAA", () => {
  it("happy: your Mechanologist AAC gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: penetrationScriptYellow, state: { steamCounters: 1 } }],
        hand: [pulsewaveProtocolYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(teklovossen).playAttack(pulsewaveProtocolYellow, { stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a non-Mechanologist attack does not get +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: penetrationScriptYellow, state: { steamCounters: 1 } }],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(teklovossen).playAttack(snatchRed, { stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: start of your turn you may keep this by removing steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: penetrationScriptYellow, state: { steamCounters: 1 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    expectFabCard(Teklo, penetrationScriptYellow).toBeIn("arena");

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Teklo, penetrationScriptYellow).toBeIn("arena");
  });
});
