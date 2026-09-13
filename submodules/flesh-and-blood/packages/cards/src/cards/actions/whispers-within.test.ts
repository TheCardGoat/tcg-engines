import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { whispersWithinBlue } from "./whispers-within.ts";

describe("Whispers Within AAA", () => {
  it("happy: defending with this opts 1", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: azalea,
        hand: [whispersWithinBlue],
        deckTop: [nimblismBlue, snatchRed],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    Dash.playAttack(snatchRed);
    Azalea.defendWith(whispersWithinBlue);
    game.closeCombat({ optBottom: 1 });

    expect(Azalea.zone("deck")[0]).toBe(snatchRed.canonicalId);
    expectFabCard(Azalea, whispersWithinBlue).toBeIn("graveyard");
  });

  it("boundary: defending with another card does not opt", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: azalea,
        hand: [whispersWithinBlue, nimblismBlue],
        deckTop: [snatchRed],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    Dash.playAttack(snatchRed);
    Azalea.defendWith(nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expect(Azalea.zone("deck").at(-1)).toBe(snatchRed.canonicalId);
    expectFabCard(Azalea, whispersWithinBlue).toBeIn("hand");
  });
});
