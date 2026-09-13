import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { malice } from "../heroes/malice.ts";
import { mutualSacrificeRed } from "./mutual-sacrifice.ts";
import { restlessClericRed } from "./restless-cleric.ts";

describe("Mutual Sacrifice AAA", () => {
  it("happy: discarding an ally after hitting a hero makes them lose 2{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [mutualSacrificeRed, restlessClericRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.playAttack(mutualSacrificeRed);
    Dash.defendWith();
    game.closeCombat({ optionals: "accept", entityTargets: "maximum" });

    expectFabCard(Malice, restlessClericRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("happy: destroying a controlled ally after hitting a hero makes them lose 2{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [mutualSacrificeRed],
        arena: [restlessClericRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.playAttack(mutualSacrificeRed);
    Dash.defendWith();
    game.closeCombat({ optionals: "accept", entityTargets: "maximum" });

    expectFabCard(Malice, restlessClericRed).toBeBanished();
    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("boundary: declining the optional deals only the attack damage", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [mutualSacrificeRed, restlessClericRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.playAttack(mutualSacrificeRed);
    Dash.defendWith();
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Malice, restlessClericRed).toBeIn("hand");
    expectFabPlayer(Dash).toHaveLife(15);
  });
});
