import { describe, it } from "vitest";
import { FabTestEngine, expectFabToken } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { viseraiRuneBlood } from "./viserai-rune-blood.ts";
import { oathOfTheArknightYellow } from "../actions/oath-of-the-arknight.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";

describe("Viserai, Rune Blood (ARC075) AAA", () => {
  it("happy: Runeblade after another non-attack action creates a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiRuneBlood,
        hand: [tomeOfFyendalYellow, oathOfTheArknightYellow],
        deck: 6,
        resourcePoints: 5,
        actionPoints: 2,
      },
      { hero: dash, deck: 6 },
    );
    const Viserai = game.as(viseraiRuneBlood);

    Viserai.must.play(tomeOfFyendalYellow);
    Viserai.must.play(oathOfTheArknightYellow);

    // Oath's own Runechant plus the hero trigger.
    expectFabToken(game, "runechant").toHaveCount(2);
  });

  it("timing: no prior non-attack — only the card's own Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiRuneBlood,
        hand: [oathOfTheArknightYellow],
        deck: 6,
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hero: dash, deck: 6 },
    );
    const Viserai = game.as(viseraiRuneBlood);

    Viserai.must.play(oathOfTheArknightYellow);

    expectFabToken(game, "runechant").toHaveCount(1);
  });
});
