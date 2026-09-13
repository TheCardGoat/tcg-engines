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
import { restvineElixirRed } from "./restvine-elixir.ts";

describe("Restvine Elixir (PEN325) AAA", () => {
  it("happy: next attack gets +3{p} and destroying Inertia gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [restvineElixirRed, snatchRed],
        arena: [fabToken("inertia")],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(restvineElixirRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expectFabPlayer(Bravo).toHaveLife(21);
    expectFabToken(game, "inertia").toHaveCount(0);
    expectFabCard(Bravo, restvineElixirRed).toBeIn("graveyard");

    Bravo.playAttack(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("boundary: declining the Inertia destroy grants no life", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [restvineElixirRed, snatchRed],
        arena: [fabToken("inertia")],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(restvineElixirRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabToken(game, "inertia").toHaveCount(1);

    Bravo.playAttack(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("timing: go again refunds the play AP and the +3{p} does not leak to a second attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [restvineElixirRed, snatchRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(restvineElixirRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Bravo).toHaveAP(2);

    Bravo.playAttack(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    game.helpers.resolveRestOfCombat();

    Bravo.playAttack(brutalAssaultBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });
});
