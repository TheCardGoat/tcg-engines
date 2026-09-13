import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { radiantForcefieldYellow } from "./radiant-forcefield.ts";

/**
 * Radiant Forcefield (DTD081) — Light Instant Aura.
 *
 * Printed: If your hero would be dealt damage, banish a card from your hero's
 *          soul to prevent 1 of that damage.
 *          When there are no cards in your hero's soul, destroy this.
 */

describe("Radiant Forcefield (DTD081) AAA", () => {
  it("happy: banishing a soul card prevents 1 of the incoming damage", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [radiantForcefieldYellow],
        soul: [nimblismBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.play(radiantForcefieldYellow);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Prism, radiantForcefieldYellow).toBeIn("arena");

    Prism.endTurn();
    Dash.playAttack(snatchRed);
    Prism.defendWith();
    expect(() => game.closeCombat({ ordering: "listed" })).toThrow(
      /Choose which optional replacement and prevention effects to apply/,
    );
    Prism.choose("Radiant Forcefield: prevention");
    game.untilIdle({ ordering: "listed", entityTargets: "minimum" });

    expectFabPlayer(Prism).toHaveLife(17);
    expectFabCard(Prism, nimblismBlue).toBeBanished();
  });

  it("boundary: with an empty soul the damage is not prevented and this is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [radiantForcefieldYellow],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.play(radiantForcefieldYellow);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Prism, radiantForcefieldYellow).toBeIn("graveyard");

    Prism.endTurn();
    Dash.playAttack(snatchRed);
    Prism.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Prism).toHaveLife(16);
  });

  it("timing: banishing the last soul card to prevent then destroys this", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arena: [radiantForcefieldYellow],
        soul: [nimblismBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.endTurn();
    Dash.playAttack(snatchRed);
    Prism.defendWith();
    expect(() => game.closeCombat({ ordering: "listed" })).toThrow(
      /Choose which optional replacement and prevention effects to apply/,
    );
    Prism.choose("Radiant Forcefield: prevention");
    game.untilIdle({ ordering: "listed", entityTargets: "minimum" });

    expectFabPlayer(Prism).toHaveLife(17);
    expectFabCard(Prism, nimblismBlue).toBeBanished();
    expectFabCard(Prism, radiantForcefieldYellow).toBeIn("graveyard");
  });
});
