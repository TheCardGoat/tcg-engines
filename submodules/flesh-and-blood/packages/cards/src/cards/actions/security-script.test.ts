import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { snatchRed } from "./snatch.ts";
import { pulsewaveProtocolYellow } from "./pulsewave-protocol.ts";
import { securityScriptBlue } from "./security-script.ts";

describe("Security Script (EVO080) AAA", () => {
  it("happy: your Mechanologist AAC gets +1{d} while defending", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      {
        hero: teklovossen,
        arena: [{ card: securityScriptBlue, state: { steamCounters: 1 } }],
        hand: [pulsewaveProtocolYellow],
        resourcePoints: 0,
        actionPoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    game.as(bravo).playAttack(snatchRed, { stopAt: "defend" });
    Teklo.defendWith(pulsewaveProtocolYellow);
    game.closeCombat();

    expectFabPlayer(Teklo).toHaveLife(20);
  });

  it("boundary: a non-Mechanologist defender is not boosted", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      {
        hero: teklovossen,
        arena: [{ card: securityScriptBlue, state: { steamCounters: 1 } }],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    game.as(bravo).playAttack(snatchRed, { stopAt: "defend" });
    Teklo.defendWith(snatchRed);
    game.closeCombat();

    expectFabPlayer(Teklo).toHaveLife(18);
  });

  it("timing: start of your turn you may keep this by removing steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: securityScriptBlue, state: { steamCounters: 1 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    expectFabCard(Teklo, securityScriptBlue).toBeIn("arena");

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Teklo, securityScriptBlue).toBeIn("arena");
  });
});
