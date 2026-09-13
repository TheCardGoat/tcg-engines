import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { searingShotRed } from "../actions/searing-shot.ts";
import { driftwoodQuiver } from "./driftwood-quiver.ts";

describe("Driftwood Quiver (OUT098) AAA", () => {
  it("happy: Instant destroy bottoms the arsenal card", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [{ card: searingShotRed, state: { faceDown: false } }],
        chest: [driftwoodQuiver],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    Azalea.activate(driftwoodQuiver);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabCard(Azalea, driftwoodQuiver).toBeIn("graveyard");
    expect(Azalea.zone("deck")).toContain(searingShotRed.canonicalId);
  });

  it("boundary: empty arsenal still destroys the quiver", () => {
    const game = FabTestEngine.start(
      { hero: azalea, chest: [driftwoodQuiver], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    Azalea.activate(driftwoodQuiver);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabCard(Azalea, driftwoodQuiver).toBeIn("graveyard");
  });
});
