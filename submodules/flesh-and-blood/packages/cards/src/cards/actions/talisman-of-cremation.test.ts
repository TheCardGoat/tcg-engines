import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { talismanOfCremationBlue } from "./talisman-of-cremation.ts";

const namedSnatch = {
  ...FAB_MANUAL_HARNESS,
  publicCardIdentities: [{ canonicalId: snatchRed.canonicalId, names: ["Snatch"] }],
} as const;

describe("Talisman of Cremation (EVR189) AAA", () => {
  it("happy: naming Snatch banishes that card from the opposing graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [talismanOfCremationBlue],
        hand: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], graveyard: [snatchRed], deck: 6 },
      namedSnatch,
    );
    const Dash = game.as(dash);

    Dash.play(nimblismBlue);
    game.passBoth();
    Dash.choose("Snatch");
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, talismanOfCremationBlue).toBeIn("graveyard");
    expect(game.as(bravo).zone("banished")).toContain(snatchRed.canonicalId);
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Dash.id,
      cardName: "Snatch",
    });
  });

  it("boundary: without a play the talisman stays in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [talismanOfCremationBlue],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], graveyard: [nimblismBlue], deck: 6 },
    );

    expectFabCard(game.as(dash), talismanOfCremationBlue).toBeIn("arena");
    expectFabCard(game.as(bravo), nimblismBlue).toBeIn("graveyard");
  });

  it("timing: naming a card that is not in their graveyard banishes nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [talismanOfCremationBlue],
        hand: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], graveyard: [nimblismBlue], deck: 6 },
      namedSnatch,
    );
    const Dash = game.as(dash);

    Dash.play(nimblismBlue);
    game.passBoth();
    Dash.choose("Snatch");
    game.helpers.resolveUntilIdle();

    expect(game.as(bravo).zone("graveyard")).toContain(nimblismBlue.canonicalId);
    expect(game.as(bravo).zone("banished")).not.toContain(nimblismBlue.canonicalId);
  });
});
