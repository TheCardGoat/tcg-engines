import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { clearwaterElixirRed } from "./clearwater-elixir.ts";

describe("Clearwater Elixir (PEN324) AAA", () => {
  it("happy: next attack gets +3{p} and destroying Bloodrot Pox gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [clearwaterElixirRed, snatchRed],
        arena: [fabToken("bloodrot-pox")],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(clearwaterElixirRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expectFabPlayer(Bravo).toHaveLife(21);
    expectFabToken(game, "bloodrot-pox").toHaveCount(0);
    expectFabCard(Bravo, clearwaterElixirRed).toBeIn("graveyard");

    Bravo.playAttack(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("boundary: declining the Bloodrot destroy grants no life; a later attack still gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [clearwaterElixirRed, snatchRed],
        arena: [fabToken("bloodrot-pox")],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(clearwaterElixirRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabToken(game, "bloodrot-pox").toHaveCount(1);

    Bravo.playAttack(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("timing: go again refunds the play AP and the +3{p} does not leak to a second attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [clearwaterElixirRed, snatchRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(clearwaterElixirRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Bravo).toHaveAP(2);

    Bravo.playAttack(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    game.helpers.resolveRestOfCombat();

    Bravo.playAttack(brutalAssaultBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });
});
