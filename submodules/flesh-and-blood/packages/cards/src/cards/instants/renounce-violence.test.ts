import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { renounceViolenceBlue } from "./renounce-violence.ts";

/**
 * Renounce Violence (SUP025) — Revered Instant.
 *
 * Printed:
 *   Destroy up to 3 Might tokens. Create a Toughness token for each token
 *   destroyed this way.
 *
 * Destroy up to 3 is at-resolution; token name is the printed "Might".
 */

describe("Renounce Violence (SUP025) AAA", () => {
  it("happy: destroying 3 Might creates 3 Toughness", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [renounceViolenceBlue],
        arena: [fabToken("might"), fabToken("might"), fabToken("might")],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(renounceViolenceBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "maximum" });

    expectFabPlayer(Tuffnut).toHaveTokenCount("might", 0).toHaveTokenCount("toughness", 3);
    expectFabCard(Tuffnut, renounceViolenceBlue).toBeIn("graveyard");
  });

  it("boundary: choosing the up-to minimum also destroys none", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [renounceViolenceBlue],
        arena: [fabToken("might"), fabToken("might")],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(renounceViolenceBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Tuffnut).toHaveTokenCount("might", 2).toHaveTokenCount("toughness", 0);
  });

  it("boundary: a 4th Might survives the up-to-3 destroy", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [renounceViolenceBlue],
        arena: [fabToken("might"), fabToken("might"), fabToken("might"), fabToken("might")],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(renounceViolenceBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "maximum" });

    expectFabPlayer(Tuffnut).toHaveTokenCount("might", 1).toHaveTokenCount("toughness", 3);
  });
});
