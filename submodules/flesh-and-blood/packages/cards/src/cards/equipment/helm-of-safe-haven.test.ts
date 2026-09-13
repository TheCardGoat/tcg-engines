import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { helmOfSafeHaven } from "./helm-of-safe-haven.ts";

describe("Helm of Safe Haven (PEN314) AAA", () => {
  it("happy: defend reveal AAC adds it as a defender and discards a card", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        head: [helmOfSafeHaven],
        hand: [nimblismBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(helmOfSafeHaven);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabCard(Bravo, helmOfSafeHaven).toBeIn("graveyard");
    expectFabCard(Bravo, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Bravo, snatchRed).toBeIn("graveyard");
  });

  it("boundary: non-AAC top reveals only — no extra defender and no discard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        head: [helmOfSafeHaven],
        hand: [nimblismBlue],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(helmOfSafeHaven);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
    expectFabCard(Bravo, helmOfSafeHaven).toBeIn("graveyard");
  });

  it("timing: Blade Break destroys the helm after it defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        head: [helmOfSafeHaven],
        hand: [nimblismBlue],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(helmOfSafeHaven);
    expectFabCard(Bravo, helmOfSafeHaven).toBeIn("combatChain");
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, helmOfSafeHaven).toBeIn("graveyard");
    expectFabCard(Bravo, helmOfSafeHaven).toHaveKeyword("blade-break");
  });
});
