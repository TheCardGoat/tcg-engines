import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { hungeringDemigonRed } from "./hungering-demigon.ts";

/**
 * Hungering Demigon (DTD172) — Shadow Action - Attack, cost 2, 6{p}/3{d}.
 * Printed: If an opposing hero has 1 or more cards in their soul, you may play
 * this from your banished zone. When this hits a hero, banish a card from their
 * soul. Blood Debt.
 */

describe("Hungering Demigon (DTD172) AAA", () => {
  it("happy: a hit banishes a card from the defending hero's soul", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hungeringDemigonRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], soul: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(hungeringDemigonRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(14);
    expect(Dash.zone("soul")).toHaveLength(0);
    expectFabCard(Dash, snatchRed).toBeBanished();
  });

  it("boundary: a miss does not banish a soul card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hungeringDemigonRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        soul: [snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(hungeringDemigonRed);
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("soul")).toHaveLength(1);
    expectFabCard(Dash, snatchRed).toBeIn("soul");
  });

  it("timing: may be played from banished while an opposing hero has a soul card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [],
        banished: [hungeringDemigonRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], soul: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(hungeringDemigonRed, { from: "banished" });
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabCard(game.as(dash), snatchRed).toBeBanished();
  });

  it("boundary: cannot play from banished if the opposing hero has no soul", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [],
        banished: [hungeringDemigonRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], soul: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.playAttack(hungeringDemigonRed, { from: "banished" })).toThrow();
    expectFabCard(Bravo, hungeringDemigonRed).toBeIn("banished");
  });
});
