import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { phoenixFlameRed } from "./phoenix-flame.ts";
import { snatchRed } from "./snatch.ts";
import { riseFromTheAshesRed } from "./rise-from-the-ashes.ts";

describe("Rise from the Ashes (FAI009) AAA", () => {
  it("happy: return Phoenix Flame and the next Draconic/Ninja attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [riseFromTheAshesRed],
        graveyard: [phoenixFlameRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.play(riseFromTheAshesRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expectFabCard(Fai, phoenixFlameRed).toBeIn("hand");

    Fai.attackWith(phoenixFlameRed);
    // Phoenix Flame 0 + 3.
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });

  it("boundary: a Generic attack does not receive the +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [riseFromTheAshesRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.play(riseFromTheAshesRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Fai.attackWith(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the action point spent to play this", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [riseFromTheAshesRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.play(riseFromTheAshesRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Fai).toHaveAP(1);
  });
});
