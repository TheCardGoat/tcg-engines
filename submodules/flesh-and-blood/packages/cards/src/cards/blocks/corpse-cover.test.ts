import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { snatchRed } from "../actions/snatch.ts";
import { restlessClericRed } from "../actions/restless-cleric.ts";
import { corpseCoverRed } from "./corpse-cover.ts";

describe("Corpse Cover AAA", () => {
  it("happy: while defending, discarding an ally prevents the next 2 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: gravyBones,
        hand: [corpseCoverRed, restlessClericRed],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Gravy = game.as(gravyBones);

    Dash.playAttack(snatchRed);
    Gravy.defendWith(corpseCoverRed);
    game.toReaction("defender");
    Gravy.activate(corpseCoverRed);
    game.untilIdle({ entityTargets: "maximum" });
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Gravy, restlessClericRed).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveLife(20);
  });

  it("boundary: the Instant cannot be activated from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [corpseCoverRed, restlessClericRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(gravyBones).expectActivationRejected(corpseCoverRed);
    expectFabCard(game.as(gravyBones), corpseCoverRed).toBeIn("hand");
  });

  it("boundary: leftover prevention carries to a later damage event this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: gravyBones,
        hand: [corpseCoverRed, restlessClericRed],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Gravy = game.as(gravyBones);

    Dash.playAttack(snatchRed);
    Gravy.defendWith(corpseCoverRed);
    game.toReaction("defender");
    Gravy.activate(corpseCoverRed);
    game.untilIdle({ entityTargets: "maximum" });
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Gravy).toHaveLife(20);

    Dash.playAttack(snatchRed);
    Gravy.defendWith();
    game.closeCombat();
    expectFabPlayer(Gravy).toHaveLife(17);
  });
});
