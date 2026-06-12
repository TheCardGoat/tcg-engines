import { describe, expect, it } from "bun:test";
import { agrabahMarketplace } from "./136-agrabah-marketplace";

describe("Agrabah - Marketplace", () => {
  it("remains a vanilla inkable location with the expected set-009 stats", () => {
    expect(agrabahMarketplace.vanilla).toBe(true);
    expect(agrabahMarketplace.inkable).toBe(true);
    expect(agrabahMarketplace.abilities).toBeUndefined();
    expect(agrabahMarketplace.cost).toBe(3);
    expect(agrabahMarketplace.moveCost).toBe(1);
    expect(agrabahMarketplace.willpower).toBe(5);
    expect(agrabahMarketplace.lore).toBe(2);
  });
});
