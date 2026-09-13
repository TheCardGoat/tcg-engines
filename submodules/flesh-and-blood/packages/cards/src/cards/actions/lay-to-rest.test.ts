import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { chane } from "../heroes/chane.ts";
import { snatchRed } from "./snatch.ts";
import { layToRestRed } from "./lay-to-rest.ts";

describe("Lay to Rest (DTD082) AAA", () => {
  it("happy: attacking a Shadow hero grants +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [layToRestRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: chane, hand: [], deck: 6 },
    );
    game.as(prism).playAttack(layToRestRed);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: attacking a non-Shadow hero stays printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [layToRestRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    game.as(prism).playAttack(layToRestRed);
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: hitting a hero may turn a card in their banished zone face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [layToRestRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: chane,
        hand: [],
        banished: [{ card: snatchRed, state: { faceDown: false } }],
        deck: 6,
      },
    );
    game.as(prism).playAttack(layToRestRed);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "accept" });
    expectFabCard(game.as(chane), snatchRed).toBeBanished().toBeFaceDown();
  });
});
