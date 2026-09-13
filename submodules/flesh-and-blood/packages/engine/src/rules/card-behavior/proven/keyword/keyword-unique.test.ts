import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { blasmophetTheInsatiableHunger } from "../../../../../../cards/src/cards/tokens/blasmophet-the-insatiable-hunger.ts";
import { blasmophetLeviaConsumed } from "../../../../../../cards/src/cards/demi-heroes/blasmophet-levia-consumed.ts";
import { cintariSellsword } from "../../../../../../cards/src/cards/tokens/cintari-sellsword.ts";

describe("keyword: unique", () => {
  it("UST notes: two Blasmophet tokens of the same moniker leave only one in the arena", () => {
    const game = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      {
        hero: dash,
        arena: [blasmophetTheInsatiableHunger, blasmophetTheInsatiableHunger],
        deck: 4,
      },
    );
    expect(
      game
        .as(dash)
        .zone("arena")
        .filter((id) => id === blasmophetTheInsatiableHunger.canonicalId),
    ).toHaveLength(1);
  });

  it("UST notes: Unique cleans up by moniker against Blasmophet, Levia Consumed", () => {
    const game = FabTestEngine.start(
      {
        hero: blasmophetLeviaConsumed,
        arena: [blasmophetTheInsatiableHunger],
        deck: 4,
      },
      { hero: dash, deck: 4 },
    );
    const Blasmophet = game.as(blasmophetLeviaConsumed);
    expect(Blasmophet.zone("arena")).not.toContain(blasmophetTheInsatiableHunger.canonicalId);
    expect(Blasmophet.zone("heroZone")).toContain(blasmophetLeviaConsumed.canonicalId);
  });

  it("UST notes boundary: a non-Blasmophet ally does not unique-clean a Blasmophet token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [blasmophetTheInsatiableHunger, cintariSellsword],
        deck: 4,
      },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("arena")).toContain(blasmophetTheInsatiableHunger.canonicalId);
    expect(Bravo.zone("arena")).toContain(cintariSellsword.canonicalId);
  });
});
