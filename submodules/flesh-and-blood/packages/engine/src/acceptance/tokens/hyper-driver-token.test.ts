import { describe, expect, it } from "vitest";
import { hyperDriver } from "../../../../cards/src/cards/tokens/hyper-driver.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Hyper Driver (EVO234)", () => {
  it("AAA: card loads in arena", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [hyperDriver], deck: 8, actionPoints: 1, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("arena")).toContain(hyperDriver.canonicalId);
  });
});
