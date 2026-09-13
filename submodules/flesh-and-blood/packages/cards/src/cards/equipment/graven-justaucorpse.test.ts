import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed, snatchYellow } from "../actions/snatch.ts";
import { gravenJustaucorpse } from "./graven-justaucorpse.ts";

/**
 * Graven Justaucorpse — Necromancer Equipment - Chest, d1 Battleworn.
 *
 * Printed: "Instant - Destroy this: Discard a card. Gain {r} equal to its
 * pitch value."
 */

describe("Graven Justaucorpse (AGB005) AAA", () => {
  it("happy: destroy this to discard a red card and gain 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        chest: [gravenJustaucorpse],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(gravenJustaucorpse);
    game.helpers.resolveUntilIdle();

    expectFabCard(Gravy, gravenJustaucorpse).toBeIn("graveyard");
    expectFabCard(Gravy, snatchRed).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveResourceCount(1);
  });

  it("scaling: discarding a yellow card gains 2{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        chest: [gravenJustaucorpse],
        hand: [snatchYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(gravenJustaucorpse);
    game.helpers.resolveUntilIdle();

    expectFabCard(Gravy, snatchYellow).toBeIn("graveyard");
    // The gain equals the discarded card's pitch value (yellow = 2).
    expectFabPlayer(Gravy).toHaveResourceCount(2);
  });

  it("boundary: an empty hand still pays destroy-this; discard fails and gains 0{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        chest: [gravenJustaucorpse],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(gravenJustaucorpse);
    game.untilIdle();

    expectFabCard(Gravy, gravenJustaucorpse).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveResourceCount(0);
  });
});
