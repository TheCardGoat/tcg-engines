import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  type FabPlayerHandle,
  type FabCardInstanceRef,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { lexi } from "../heroes/lexi.ts";
import { voltaireStrikeTwice } from "./voltaire-strike-twice.ts";
import { boltNShotRed as boltNShot } from "../actions/bolt-n-shot.ts";
import { nimblismBlue } from "../actions/nimblism.ts";

const deck = [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue];
function loadArrow(
  game: FabTestEngine,
  player: FabPlayerHandle,
  arrow: FabCardInstanceRef,
  mode: "power" | "go-again",
) {
  player.activate(voltaireStrikeTwice);
  game.advanceToDecision(player, "boolean");
  player.accept();
  player.target(arrow);
  game.advanceToDecision(player, "effect-resolution");
  // Printed order: +1 power, then go again. Select the requested mode explicitly.
  player.choose(mode === "power" ? "option-0" : "option-1");
  game.untilIdle({ optionals: "throw" });
}

describe("Voltaire, Strike Twice public play lines", () => {
  it("two loaded arrows get their chosen benefit; a funded third activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [voltaireStrikeTwice],
        hand: [boltNShot, boltNShot, boltNShot],
        resourcePoints: 3,
        actionPoints: 1,
        deck,
      },
      { hero: dash, hand: [], life: 20, deck },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);
    const [first, second, third] = Lexi.cardsIn("hand", boltNShot);
    loadArrow(game, Lexi, first!, "power");
    expectFabCard(Lexi, first!).toBeIn("arsenal").toHavePower(5);
    expectFabPlayer(Lexi).toHaveAP(1);
    Lexi.playAttack(first!, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(5);
    Dash.defendWith();
    // The boosted Bolt'n Shot offers reload on hit; decline to leave the slot empty.
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Lexi).toHaveAP(1);
    expectFabCard(Lexi, first!).toBeIn("graveyard").toHavePower(4);

    loadArrow(game, Lexi, second!, "go-again");
    expectFabCard(Lexi, second!).toBeIn("arsenal").toHavePower(4);
    Lexi.playAttack(second!, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(4);
    Dash.defendWith();
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Dash).toHaveLife(11);
    expectFabPlayer(Lexi).toHaveAP(1).toHaveResourceCount(1);
    expectFabCard(Lexi, second!).toBeIn("graveyard").notToHaveKeyword("go-again");
    Lexi.expectActivationRejected(voltaireStrikeTwice);
    expectFabPlayer(Lexi).toHaveResourceCount(1);
    expectFabCard(Lexi, third!).toBeIn("hand");
    expectCombat(game).toBeClosed();
  });

  it("a full arsenal cannot move another arrow or grant its dependent mode", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [voltaireStrikeTwice],
        hand: [boltNShot],
        arsenal: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 0,
        deck,
      },
      { hero: dash, hand: [], deck },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    Lexi.activate(voltaireStrikeTwice);
    game.advanceToDecision(Lexi, "boolean");
    Lexi.accept();
    Lexi.target(boltNShot);
    game.untilIdle({ optionals: "throw" });
    expectFabCard(Lexi, boltNShot).toBeIn("hand").toHavePower(4);
    expectFabCard(Lexi, Lexi.cardIn("arsenal", nimblismBlue)).toBeIn("arsenal");
    expectFabPlayer(Lexi).toHaveResourceCount(0).toHaveAP(0);
    expectWait(game).notToHaveDecision();
    expectCombat(game).toBeClosed();
  });

  it("declining the load spends its resource but grants no benefit or combat action", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [voltaireStrikeTwice],
        hand: [boltNShot],
        resourcePoints: 1,
        actionPoints: 0,
        deck,
      },
      { hero: dash, hand: [], deck },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    Lexi.activate(voltaireStrikeTwice);
    game.advanceToDecision(Lexi, "boolean");
    Lexi.decline();
    game.untilIdle({ optionals: "throw" });
    expectFabCard(Lexi, boltNShot).toBeIn("hand").toHavePower(4);
    expectFabPlayer(Lexi).toHaveResourceCount(0).toHaveAP(0);
    expectWait(game).notToHaveDecision();
    expectCombat(game).toBeClosed();
  });
});
