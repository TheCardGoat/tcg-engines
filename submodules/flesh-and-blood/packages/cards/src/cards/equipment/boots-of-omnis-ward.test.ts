import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { bravo } from "../heroes/bravo.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bootsOfOmnisWard } from "./boots-of-omnis-ward.ts";

describe("Boots of Omnis Ward (OMN204) AAA", () => {
  it("happy: Instant {t} your hero, destroy this — Boots leave the legs seat", () => {
    const game = FabTestEngine.start(
      { hero: dash, legs: [bootsOfOmnisWard], actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(bootsOfOmnisWard);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, bootsOfOmnisWard).toBeIn("graveyard");
    expectFabCard(Dash, dash).toBeTapped();
  });

  it("boundary: Temper on d1 with no arcane this turn destroys Boots after defending", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, legs: [bootsOfOmnisWard], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(bootsOfOmnisWard);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, bootsOfOmnisWard).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, bootsOfOmnisWard).toHaveKeyword("temper");
  });

  it("timing: dealt arcane this turn gives +1{d} before Temper, so Boots survive defending", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, legs: [bootsOfOmnisWard], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    if (game.pendingDecision()?.kind === "option") Dash.chooseOptions();
    expectFabPlayer(Dash).toHaveLife(15);

    Blaze.attackWith(snatchRed);
    expectFabCard(Dash, bootsOfOmnisWard).toHaveDefense(2);
    Dash.defendWith(bootsOfOmnisWard);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, bootsOfOmnisWard).toBeIn("legs");
    expectFabCard(Dash, bootsOfOmnisWard).toHaveDefenseCounters(-1);
    expectFabPlayer(Dash).toHaveLife(13);
  });
});
