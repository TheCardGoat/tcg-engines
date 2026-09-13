import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { beastModeRed } from "./beast-mode.ts";
import { snatchRed } from "./snatch.ts";
import { castBonesRed } from "./cast-bones.ts";

/**
 * Cast Bones (HVY014) — Brute Action, cost 0, 3{d}.
 *
 * Printed: Reveal the top 6 cards of your deck. Create a Might token for each
 * card with 6 or more {p} revealed this way. Put the revealed cards on top of
 * your deck in a random order. If you control 6 or more Might tokens, create
 * an Agility token.
 */

const sixBeasts = [
  beastModeRed,
  beastModeRed,
  beastModeRed,
  beastModeRed,
  beastModeRed,
  beastModeRed,
] as const;

describe("Cast Bones (HVY014) AAA", () => {
  it("happy: six 6{p} reveals create six Might and then an Agility", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [castBonesRed],
        actionPoints: 1,
        deckTop: [...sixBeasts],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(castBonesRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Rhinar, castBonesRed).toBeIn("graveyard");
    expectFabToken(game, "might").toHaveCount(6);
    expectFabToken(game, "agility").toHaveCount(1);
    expectFabPlayer(Rhinar).toHaveAP(0);
  });

  it("boundary: six sub-6{p} reveals create no Might and no Agility", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [castBonesRed],
        actionPoints: 1,
        deckTop: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(castBonesRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabToken(game, "might").toHaveCount(0);
    expectFabToken(game, "agility").toHaveCount(0);
    expectFabCard(Rhinar, castBonesRed).toBeIn("graveyard");
  });

  it("timing: five new Might plus one you already control still creates Agility", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [castBonesRed],
        arena: [fabToken("might")],
        actionPoints: 1,
        deckTop: [beastModeRed, beastModeRed, beastModeRed, beastModeRed, beastModeRed, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(castBonesRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabToken(game, "might").toHaveCount(6);
    expectFabToken(game, "agility").toHaveCount(1);
  });
});
