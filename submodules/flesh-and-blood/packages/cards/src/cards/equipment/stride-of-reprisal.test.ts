import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { strideOfReprisal } from "./stride-of-reprisal.ts";

function crouchingTigersInHand(hero: ReturnType<FabTestEngine["as"]>): string[] {
  return hero.zone("hand").filter((id) => id.startsWith("token:crouching-tiger"));
}

describe("Stride of Reprisal (MST050) AAA", () => {
  it("happy: defending with this creates a Crouching Tiger in the defending hero's hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: fai, legs: [strideOfReprisal], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    game.as(dash).playAttack(snatchRed);
    Fai.defendWith(strideOfReprisal);
    game.passBoth();

    expect(crouchingTigersInHand(Fai)).toHaveLength(1);
    expectFabPlayer(Fai).toHaveTokenCount("crouching-tiger", 0);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("crouching-tiger", 0);
  });

  it("boundary: this does not create a Crouching Tiger when it does not defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: fai, legs: [strideOfReprisal], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    game.as(dash).playAttack(snatchRed);
    Fai.defendWith();
    game.passBoth();

    expect(crouchingTigersInHand(Fai)).toHaveLength(0);
    expectFabCard(Fai, strideOfReprisal).toBeIn("legs");
  });

  it("timing: Blade Break destroys this at chain close, not when it is declared as a defender", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: fai, legs: [strideOfReprisal], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    game.as(dash).playAttack(snatchRed);
    Fai.defendWith(strideOfReprisal);
    game.passBoth();

    expectCombat(game).toBeOpen();
    expectFabCard(Fai, strideOfReprisal).toBeIn("combatChain");
    expect(crouchingTigersInHand(Fai)).toHaveLength(1);

    game.closeCombat();
    expectFabCard(Fai, strideOfReprisal).toBeIn("graveyard");
  });
});
