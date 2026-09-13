import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { sigilOfProtectionRed } from "./sigil-of-protection.ts";

describe("Sigil of Protection (UPR218) AAA", () => {
  it("happy: Ward 4 prevents a 4{p} Snatch and destroys this", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sigilOfProtectionRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(sigilOfProtectionRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, sigilOfProtectionRed).toBeIn("arena");
    expectFabCard(Bravo, sigilOfProtectionRed).toHaveKeyword("ward");
    Bravo.endTurn();

    Dash.attackWith(snatchRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabCard(Bravo, sigilOfProtectionRed).toBeIn("graveyard");
  });

  it("boundary: the opponent does not gain Ward", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sigilOfProtectionRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(sigilOfProtectionRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, sigilOfProtectionRed).toBeIn("arena");
    expect(Dash.zone("arena")).toHaveLength(0);
  });

  it("timing: destroyed at the beginning of your next action phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sigilOfProtectionRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(sigilOfProtectionRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, sigilOfProtectionRed).toBeIn("arena");
    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, sigilOfProtectionRed).toBeIn("graveyard");
  });
});
