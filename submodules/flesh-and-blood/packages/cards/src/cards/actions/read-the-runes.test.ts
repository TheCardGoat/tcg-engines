import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { readTheRunesRed } from "./read-the-runes.ts";

describe("readTheRunes family AAA", () => {
  it("happy: playing Read the Runes creates exactly 3 Runechant tokens", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [readTheRunesRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(readTheRunesRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveTokenCount("runechant", 3);
    expect(Briar.zone("arena")).toContain("token:runechant");
    expectFabCard(Briar, readTheRunesRed).toBeIn("graveyard");
  });

  it("boundary: the opponent controls none of the created Runechants", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [readTheRunesRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(readTheRunesRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveTokenCount("runechant", 3);
    expectFabPlayer(Dash).toHaveTokenCount("runechant", 0);
    expect(Dash.zone("arena")).not.toContain("token:runechant");
  });

  it("timing: a follow-up attack action consumes all 3 Runechants for 3 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [readTheRunesRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(readTheRunesRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 3);

    Briar.attackWith(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    // 4 combat damage + 3 arcane (one per consumed Runechant, CR 8.6.3).
    expectFabPlayer(Dash).toHaveLife(13);
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 0);
  });
});
