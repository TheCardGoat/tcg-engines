import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viseraiRuneBlood } from "../heroes/viserai-rune-blood.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { skyFireLanternsRed } from "./sky-fire-lanterns.ts";

/**
 * Sky Fire Lanterns (DYN188) — Runeblade Action, cost 0, 2{d}, go again.
 *
 * Printed: "Reveal the top card of your deck. If it's red, create a Runechant
 * token. Go again"
 */

describe("skyFireLanterns family AAA", () => {
  it("happy: revealing a red top card creates a Runechant and go again refunds", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiRuneBlood,
        hand: [skyFireLanternsRed],
        actionPoints: 1,
        deck: 6,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiRuneBlood);

    Viserai.play(skyFireLanternsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Viserai.zone("arena").filter((c) => c === "token:runechant")).toHaveLength(1);
    expect(Viserai.zone("deck").at(-1)).toBe(snatchRed.canonicalId);
    expectFabCard(Viserai, skyFireLanternsRed).toBeIn("graveyard");
    expectFabPlayer(Viserai).toHaveAP(1);
  });

  it("boundary: a non-red reveal creates no Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiRuneBlood,
        hand: [skyFireLanternsRed],
        actionPoints: 1,
        deck: 6,
        deckTop: [brutalAssaultBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiRuneBlood);

    Viserai.play(skyFireLanternsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Viserai.zone("arena").filter((c) => c === "token:runechant")).toHaveLength(0);
    expect(Viserai.zone("deck").at(-1)).toBe(brutalAssaultBlue.canonicalId);
  });
});
