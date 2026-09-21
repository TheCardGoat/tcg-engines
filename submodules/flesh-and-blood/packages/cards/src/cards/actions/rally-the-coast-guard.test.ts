import { nimblismBlue } from "./nimblism.ts";
import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import {
  rallyTheCoastGuardBlue,
  rallyTheCoastGuardRed,
  rallyTheCoastGuardYellow,
} from "./rally-the-coast-guard.ts";

describe("rally-the-coast-guard family AAA", () => {
  it.each([
    [rallyTheCoastGuardRed, 7, 13],
    [rallyTheCoastGuardYellow, 6, 14],
    [rallyTheCoastGuardBlue, 5, 15],
  ])("happy: unblocked attack deals printed %i", (card, power, life) => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [card],
        resourcePoints: 3,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
    );
    const Dash = game.as(dash);

    Dash.playAttack(card);
    expectCombat(game).toHaveAttackPower(power);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(bravo)).toHaveLife(life);
    expectFabCard(Dash, card).toBeIn("graveyard");
  });

  it("boundary: insufficient resources cannot play the attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [rallyTheCoastGuardRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: bravo, hand: [], deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue] },
    );

    expectFabUnplayable(
      () => game.as(dash).playAttack(rallyTheCoastGuardRed),
      /resource|unpayable|cannot be paid/i,
    );
    expectFabCard(game.as(dash), rallyTheCoastGuardRed).toBeIn("hand");
  });

  it("timing: defending with it reduces an attack by printed 2", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [rallyTheCoastGuardRed],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(rallyTheCoastGuardRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, rallyTheCoastGuardRed).toBeIn("graveyard");
  });

  it.each([
    ["Red", rallyTheCoastGuardRed],
    ["Yellow", rallyTheCoastGuardYellow],
    ["Blue", rallyTheCoastGuardBlue],
  ] as const)(
    "interaction %s: discard grants +3 defense only before object reset",
    (_color, card) => {
      const game = FabTestEngine.start(
        {
          hero: dash,
          hand: [snatchRed],
          deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        },
        {
          hero: bravo,
          hand: [card, snatchRed],
          life: 20,
          deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);

      game.as(dash).playAttack(snatchRed);
      Bravo.defendWith(card);
      game.toReaction("defender");
      Bravo.activate(card);
      game.passBoth();
      game.advanceUntil({ stopAt: "reaction", optionals: "throw" });

      expectFabCard(Bravo, card).toHaveDefense(5);
      expectFabCard(Bravo, snatchRed).toBeIn("graveyard");
      game.closeCombat({ optionals: "throw" });
      expectFabPlayer(Bravo).toHaveLife(20);
      expectFabCard(Bravo, card).toBeIn("graveyard").toHaveDefense(2);
      expectCombat(game).toBeClosed();
    },
  );
});
