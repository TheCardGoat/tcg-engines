import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { malice } from "../heroes/malice.ts";
import { corruptedCorpse } from "./corrupted-corpse.ts";
import { otherworldlyOssuaryBlue } from "./otherworldly-ossuary.ts";

/**
 * Otherworldly Ossuary, Blue — Shadow Necromancer Action, 1{r} 3{d}.
 *
 * Printed: "Create a Corrupted Corpse in your banished zone.\nGo again"
 */

describe("Otherworldly Ossuary AAA", () => {
  it("happy: creates a Corrupted Corpse in the banished zone and refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [otherworldlyOssuaryBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.play(otherworldlyOssuaryBlue);
    game.untilIdle();

    expectFabCard(Malice, otherworldlyOssuaryBlue).toBeIn("graveyard");
    expectFabCard(Malice, corruptedCorpse).toBeBanished();
    expectFabPlayer(Malice).toHaveAP(1);
  });

  it("boundary: the 1{r} cost is required", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [otherworldlyOssuaryBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    expectFabUnplayable(() => Malice.play(otherworldlyOssuaryBlue), /resource/i);
    expect(Malice.cardsIn("banished", corruptedCorpse)).toHaveLength(0);
  });
});
