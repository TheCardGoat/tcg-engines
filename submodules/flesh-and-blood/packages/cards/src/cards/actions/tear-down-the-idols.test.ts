import { describe, expect, it } from "vitest";
import { expectFabCard, expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { tearDownTheIdolsRed } from "./tear-down-the-idols.ts";

describe("Tear Down the Idols (SUP086) AAA", () => {
  it("happy: attacking a Revered hero intimidates them", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [tearDownTheIdolsRed], resourcePoints: 3, deck: 6 },
      { hero: tuffnut, hand: [brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Tuffnut = game.as(tuffnut);

    game.as(bravo).playAttack(tearDownTheIdolsRed);

    expectFabPlayer(Tuffnut).toHaveHandCount(0);
    expectFabCard(Tuffnut, brutalAssaultBlue).toBeIn("banished");
    expectFabCard(Tuffnut, brutalAssaultBlue).toBeFaceDown();
  });

  it("boundary: attacking a non-Revered hero does not intimidate", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [tearDownTheIdolsRed], resourcePoints: 3, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
    );

    game.as(bravo).playAttack(tearDownTheIdolsRed);

    expectFabPlayer(game.as(dash)).toHaveHandCount(1);
    expect(game.as(dash).zone("banished")).toHaveLength(0);
  });

  it("timing: hitting a Revered hero discards a leftover hand card", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [tearDownTheIdolsRed], resourcePoints: 3, deck: 6 },
      { hero: tuffnut, hand: [brutalAssaultBlue, brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Tuffnut = game.as(tuffnut);

    game.as(bravo).playAttack(tearDownTheIdolsRed);
    expectFabPlayer(Tuffnut).toHaveHandCount(1);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Tuffnut).toHaveHandCount(0);
    expect(Tuffnut.zone("banished")).toHaveLength(1);
    expect(Tuffnut.zone("graveyard")).toHaveLength(1);
  });
});
