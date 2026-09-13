import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { helioSMitre } from "./helio-s-mitre.ts";

describe("Helio's Mitre (UPR183) AAA", () => {
  it("happy: pay 2{r} to prevent the next 1 from the chosen source", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        head: [helioSMitre],
        resourcePoints: 2,
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(bravo).pass();
    Dash.activate(helioSMitre);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: snatchRed.canonicalId });

    expectFabCard(Dash, helioSMitre).toBeIn("head");
    expectFabPlayer(Dash).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: 1 resource cannot pay the Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [helioSMitre],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).expectActivationRejected(helioSMitre);
    expectFabCard(game.as(dash), helioSMitre).toBeIn("head");
  });

  it("timing: the mitre is destroyed at the beginning of the end phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        head: [helioSMitre],
        resourcePoints: 2,
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(bravo).pass();
    Dash.activate(helioSMitre);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();
    expectFabCard(Dash, helioSMitre).toBeIn("head");

    game.as(bravo).endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, helioSMitre).toBeIn("graveyard");
  });
});
