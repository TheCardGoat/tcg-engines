import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { phoenixFlameRed } from "./phoenix-flame.ts";
import { flamecallAwakeningRed } from "./flamecall-awakening.ts";

describe("Flamecall Awakening (FAI012) AAA", () => {
  it("happy: after another red card this turn, attacking with this may search a Phoenix Flame into hand", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixFlameRed, flamecallAwakeningRed],
        deck: [phoenixFlameRed],
        resourcePoints: 1,
        actionPoints: 2,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(phoenixFlameRed);
    game.closeCombat();
    Fai.playAttack(flamecallAwakeningRed, { stopAt: "on-attack" });
    Fai.accept();
    Fai.target(Fai.cardsIn("deck", phoenixFlameRed)[0]!);
    game.advanceUntil({ stopAt: "defend" });

    expect(Fai.zone("hand")).toContain(phoenixFlameRed.canonicalId);
    expectCombat(game).toHaveKeyword("go-again");
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: as the first red card this turn, this does not search", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [flamecallAwakeningRed],
        deck: [phoenixFlameRed],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(flamecallAwakeningRed);
    expect(Fai.cardsIn("deck", phoenixFlameRed)).toHaveLength(1);
    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: declining the search leaves Phoenix Flame in the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixFlameRed, flamecallAwakeningRed],
        deck: [phoenixFlameRed],
        resourcePoints: 1,
        actionPoints: 2,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(phoenixFlameRed);
    game.closeCombat();
    Fai.playAttack(flamecallAwakeningRed, { stopAt: "on-attack" });
    Fai.decline();
    game.advanceUntil({ stopAt: "defend" });

    expect(Fai.cardsIn("deck", phoenixFlameRed)).toHaveLength(1);
    expectFabCard(Fai, flamecallAwakeningRed).toBeIn("combatChain");
  });
});
