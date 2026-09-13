import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { comeToFightBlue, comeToFightYellow } from "../actions/come-to-fight.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { solarPlexus } from "./solar-plexus.ts";

/**
 * Solar Plexus (ASB004) — Light Chest (no printed defense).
 *
 * Printed: "Instant - Destroy this, banish a card from your soul: Yellow cards
 * you play this turn cost {r} less to play."
 */

describe("Solar Plexus (ASB004) AAA", () => {
  it("happy: the cost reduction lets a 1{r} yellow card be played for 0{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        chest: [solarPlexus],
        soul: [nimblismBlue],
        hand: [comeToFightYellow, comeToFightBlue],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.activate(solarPlexus);
    game.untilIdle();

    expectFabCard(Prism, solarPlexus).toBeIn("graveyard");
    expectFabCard(Prism, nimblismBlue).toBeIn("banished");

    Prism.play(comeToFightYellow); // 1{r} - 1 = 0{r} at 0 RP
    game.untilIdle();
    expectFabCard(Prism, comeToFightYellow).toBeIn("graveyard");
    expectFabPlayer(Prism).toHaveAP(2); // go again refunds the action point
  });

  it("boundary: non-yellow cards do not get the reduction", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        chest: [solarPlexus],
        soul: [nimblismBlue],
        hand: [comeToFightBlue],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.activate(solarPlexus);
    game.untilIdle();

    expectFabUnplayable(() => Prism.play(comeToFightBlue));
    expectFabCard(Prism, comeToFightBlue).toBeIn("hand");
  });
});
