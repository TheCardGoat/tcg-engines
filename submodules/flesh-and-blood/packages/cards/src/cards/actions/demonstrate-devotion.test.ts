import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cindra } from "../heroes/cindra.ts";
import { huntToTheEndsOfRatheRed } from "./hunt-to-the-ends-of-rathe.ts";
import { demonstrateDevotionRed } from "./demonstrate-devotion.ts";

describe("Demonstrate Devotion (HNT059) AAA", () => {
  it("happy: after two Draconic links this creates a Fealty token when it attacks", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [huntToTheEndsOfRatheRed, huntToTheEndsOfRatheRed, demonstrateDevotionRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindra);

    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(demonstrateDevotionRed);
    game.closeCombat();
    expect(Cindra.zone("arena")).toContain("token:fealty");
    expectFabPlayer(Cindra).toHaveAP(1);
  });

  it("boundary: as the first link this does not create Fealty", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [demonstrateDevotionRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindra);

    Cindra.attackWith(demonstrateDevotionRed);
    game.closeCombat();
    expect(Cindra.zone("arena")).not.toContain("token:fealty");
  });

  it("timing: go again from two Draconic links refunds AP after the attack resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [huntToTheEndsOfRatheRed, huntToTheEndsOfRatheRed, demonstrateDevotionRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindra);

    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(demonstrateDevotionRed);
    game.closeCombat();
    expectFabPlayer(Cindra).toHaveAP(1);
  });
});
