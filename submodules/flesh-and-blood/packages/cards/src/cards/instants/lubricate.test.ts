import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { lubricateBlue } from "./lubricate.ts";

const cog = fabToken("golden-cog");

describe("Lubricate (SEA022) AAA", () => {
  it("happy: untaps up to 3 tapped Cogs you control", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [lubricateBlue],
        arena: [{ card: cog, state: { tapped: true } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(lubricateBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });

    expectFabCard(Teklo, cog).toBeReady();
    expectFabCard(Teklo, lubricateBlue).toBeIn("graveyard");
  });

  it("boundary: with no Cogs the Instant still resolves and nothing is untapped", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [lubricateBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(lubricateBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Teklo, lubricateBlue).toBeIn("graveyard");
  });

  it("timing: the Instant plays with 0 action points", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [lubricateBlue],
        arena: [{ card: cog, state: { tapped: true } }],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(lubricateBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });

    expectFabCard(Teklo, cog).toBeReady();
  });
});
