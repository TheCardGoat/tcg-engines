import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { describe, expect, it } from "vitest";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { figmentOfTriumphYellow } from "./figment-of-triumph.ts";

describe("Figment of Triumph (DTD011)", () => {
  it("reduces an opposing attack action card rather than filtering for a Cards subtype", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: prism, hand: [figmentOfTriumphYellow], resourcePoints: 4, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const Prism = game.as(prism);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.pass(Dash.id);
    Prism.play(figmentOfTriumphYellow);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    expect(Prism.life()).toBe(17);
  });
});
