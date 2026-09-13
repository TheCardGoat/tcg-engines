/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:scrap
 * Representative card: packages/cards/src/cards/actions/scrap-trader.ts
 * Canonical id: CQpHCDTdJdmJgn8hGJrgq
 *
 * Arrange: import the representative real card and establish a legal,
 * player-reachable match state with the required heroes, zones, resources,
 * targets, counters, and opponent responses.
 * Act: dispatch only production FabTestEngine moves (play, pitch, defend,
 * resolve prompts, pass priority, and end the relevant phase).
 * Assert: verify player-visible outcomes such as life, zones, AP/resources,
 * combat state, prompts, legality error codes, or game result. Include the
 * negative/boundary case and any timing or interaction case before completion.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, ironrotHelm, scabskinLeathers } from "../../../fixtures.ts";
import { scrapTraderRed } from "../../../../../../cards/src/cards/actions/scrap-trader.ts";
import { itemTrainer } from "../../../test-trainers.ts";

const demoItem = itemTrainer({ slug: "scrap-demo-item" });

describe("keyword: scrap", () => {
  it("AAA happy — scrap:true banishes the chosen Equipment from graveyard (CR 8.3.32)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [scrapTraderRed], graveyard: [ironrotHelm], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false },
    );

    game.as(bravo).play(scrapTraderRed, { scrap: true, scrapCard: ironrotHelm });

    expect(game.as(bravo).zone("graveyard")).not.toContain(ironrotHelm.canonicalId);
    expect(game.as(bravo).zone("banished")).toContain(ironrotHelm.canonicalId);
  });

  it("AAA — scrap banishes a chosen ITEM from the graveyard (CR 8.3.32)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [scrapTraderRed], graveyard: [demoItem], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false },
    );
    game.as(bravo).play(scrapTraderRed, { scrap: true, scrapCard: demoItem });
    // CR 8.3.32: "an item OR equipment" — the Item must be banished.
    expect(game.as(bravo).zone("banished")).toContain(demoItem.canonicalId);
    expect(game.as(bravo).zone("graveyard")).not.toContain(demoItem.canonicalId);
  });

  it("AAA — scrap banishes ONLY the chosen card, not every graveyard equipment (CR 8.3.32)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [scrapTraderRed], graveyard: [ironrotHelm, scabskinLeathers], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false },
    );
    game.as(bravo).play(scrapTraderRed, { scrap: true, scrapCard: ironrotHelm });
    expect(game.as(bravo).zone("banished")).toContain(ironrotHelm.canonicalId);
    // The unchosen equipment stays in the graveyard (one card, not all).
    expect(game.as(bravo).zone("graveyard")).toContain(scabskinLeathers.canonicalId);
  });

  it("AAA — scrap with no chosen card is rejected (CR 8.3.32 additional cost must be payable)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [scrapTraderRed], graveyard: [ironrotHelm], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const rejection = Bravo.expectFailure({
      move: "begin-play",
      payload: {
        instanceId: Bravo.findCardInZone("hand", scrapTraderRed),
        scrap: true,
      },
    });
    expect(rejection.errorCode).toBe("additional_cost_failed");
  });

  it("AAA boundary — without scrap flag, GY Equipment stays in graveyard", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [scrapTraderRed], graveyard: [ironrotHelm], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false },
    );

    game.as(bravo).play(scrapTraderRed);

    expect(game.as(bravo).zone("graveyard")).toContain(ironrotHelm.canonicalId);
    expect(game.as(bravo).zone("banished")).not.toContain(ironrotHelm.canonicalId);
  });
});
