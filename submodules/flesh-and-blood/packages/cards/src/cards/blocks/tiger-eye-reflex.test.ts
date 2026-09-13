import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tigerEyeReflexBlue } from "./tiger-eye-reflex.ts";
import { tigerEyeReflexYellow } from "./tiger-eye-reflex.ts";

/**
 * Tiger Eye Reflex (TCC102) — Ninja Block, blue, 2{d}, Ambush.
 * Printed: When this defends, create a Crouching Tiger in your banished zone.
 * You may play it during your next turn.
 */

describe("Tiger Eye Reflex (TCC102) AAA", () => {
  it("happy: defending creates a Crouching Tiger in banished", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [tigerEyeReflexBlue], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Katsu = game.as(katsu);

    game.as(dash).playAttack(snatchRed);
    Katsu.defendWith(tigerEyeReflexBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expect(
      Katsu.zone("banished").filter((id) => id.startsWith("token:crouching-tiger")),
    ).toHaveLength(1);
    expectFabCard(Katsu, tigerEyeReflexBlue).toBeIn("graveyard");
  });

  it("boundary: cannot be played as an action", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [tigerEyeReflexBlue], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(katsu).play(tigerEyeReflexBlue)).toThrow();
    expectFabCard(game.as(katsu), tigerEyeReflexBlue).toBeIn("hand");
  });
});

/**
 * Tiger Eye Reflex (TCC098) — Ninja Block, yellow, 3{d}, Ambush.
 * Printed: When this defends, create a Crouching Tiger in your banished zone.
 * You may play it during your next turn.
 */

describe("Tiger Eye Reflex (TCC098) AAA", () => {
  it("happy: defending creates a Crouching Tiger in banished", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [tigerEyeReflexYellow], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Katsu = game.as(katsu);

    game.as(dash).playAttack(snatchRed);
    Katsu.defendWith(tigerEyeReflexYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expect(
      Katsu.zone("banished").filter((id) => id.startsWith("token:crouching-tiger")),
    ).toHaveLength(1);
    expectFabCard(Katsu, tigerEyeReflexYellow).toBeIn("graveyard");
  });

  it("boundary: cannot be played as an action", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [tigerEyeReflexYellow], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(katsu).play(tigerEyeReflexYellow)).toThrow();
    expectFabCard(game.as(katsu), tigerEyeReflexYellow).toBeIn("hand");
  });
});
