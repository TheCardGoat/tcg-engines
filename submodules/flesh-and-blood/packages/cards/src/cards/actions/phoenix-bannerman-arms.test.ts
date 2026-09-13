import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { phoenixFlameRed } from "./phoenix-flame.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { phoenixBannermanArmsRed } from "./phoenix-bannerman-arms.ts";

/**
 * Phoenix Bannerman: Arms (PEN259) — Draconic Action, cost 0, go again.
 *
 * Printed: Search your deck for a Phoenix Flame, reveal it, put it into your
 * hand, then shuffle. Create a Might token. Go again
 */

const fillerDeck = [
  brutalAssaultBlue,
  brutalAssaultBlue,
  brutalAssaultBlue,
  brutalAssaultBlue,
  brutalAssaultBlue,
] as const;

describe("Phoenix Bannerman: Arms (PEN259) AAA", () => {
  it("happy: searching Phoenix Flame puts it into hand and creates a Might token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [phoenixBannermanArmsRed],
        deck: [...fillerDeck, phoenixFlameRed],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(phoenixBannermanArmsRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: phoenixFlameRed.canonicalId });

    expectFabCard(Bravo, phoenixFlameRed).toBeIn("hand");
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
    expectFabCard(Bravo, phoenixBannermanArmsRed).toBeIn("graveyard");
  });

  it("boundary: a deck with no Phoenix Flame still creates Might", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [phoenixBannermanArmsRed],
        deck: [...fillerDeck, brutalAssaultBlue],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(phoenixBannermanArmsRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Bravo.zone("hand")).not.toContain(phoenixFlameRed.canonicalId);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
    expectFabCard(Bravo, phoenixBannermanArmsRed).toBeIn("graveyard");
  });

  it("timing: go again refunds the spent action point", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [phoenixBannermanArmsRed],
        deck: [...fillerDeck, phoenixFlameRed],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(phoenixBannermanArmsRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: phoenixFlameRed.canonicalId });

    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
