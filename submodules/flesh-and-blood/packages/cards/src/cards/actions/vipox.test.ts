import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { vipoxRed } from "./vipox.ts";

describe("Vipox (UPR188) AAA", () => {
  it("happy: hitting a 3-card hand deals 1 and they lose 3 life", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [vipoxRed], deck: 6 },
      {
        hero: bravo,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(vipoxRed);
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabPlayer(Bravo).toHaveHandCount(3);
    expectFabCard(game.as(dash), vipoxRed).toBeIn("graveyard");
  });

  it("boundary: hitting an empty hand deals only the printed 1", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [vipoxRed], deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );

    game.as(dash).playAttack(vipoxRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(bravo)).toHaveLife(19);
  });

  it("timing: a miss does not make them lose life for cards in hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [vipoxRed], deck: 6 },
      { hero: bravo, hand: [nimblismBlue], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(vipoxRed);
    Bravo.defendWith(nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(20);
  });
});
