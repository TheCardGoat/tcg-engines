import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { wageGoldYellow } from "./wage-gold.ts";
import { eradicateYellow } from "./eradicate.ts";

describe("Eradicate (DYN119) AAA", () => {
  it("happy: hitting a hero banishes X=damage yellows and completes the yellow-banish contract", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [eradicateYellow], actionPoints: 1, resourcePoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [],
        deck: [snatchRed, wageGoldYellow, wageGoldYellow, wageGoldYellow, wageGoldYellow],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(eradicateYellow);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
    expect(Dash.zone("banished").filter((id) => id === wageGoldYellow.canonicalId).length).toBe(4);
    expectFabPlayer(Bravo).toHaveTokenCount("silver", 1);
    expectFabCard(Bravo, eradicateYellow).toBeIn("graveyard");
  });

  it("boundary: a fully blocked miss does not banish their deck", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [eradicateYellow], actionPoints: 1, resourcePoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue],
        deck: [wageGoldYellow],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(eradicateYellow);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue]);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("deck")).toContain(wageGoldYellow.canonicalId);
    expect(Dash.zone("banished")).not.toContain(wageGoldYellow.canonicalId);
  });

  it("timing: the hit banishes their deck, not yours", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [eradicateYellow],
        actionPoints: 1,
        resourcePoints: 1,
        deck: [snatchRed],
      },
      { hero: dash, life: 20, hand: [], deck: [wageGoldYellow] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(eradicateYellow);
    game.closeCombat({ ordering: "listed" });

    expect(Dash.zone("banished")).toContain(wageGoldYellow.canonicalId);
    expect(Bravo.zone("banished")).not.toContain(snatchRed.canonicalId);
  });
});
