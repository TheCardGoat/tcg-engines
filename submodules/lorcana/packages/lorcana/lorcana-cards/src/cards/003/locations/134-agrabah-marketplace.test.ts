import { describe, expect, it } from "bun:test";
import { agrabahMarketplace } from "./134-agrabah-marketplace";

describe("Agrabah - Marketplace", () => {
  it("is a vanilla location with the printed baseline stats", () => {
    expect(agrabahMarketplace.vanilla).toBe(true);
    expect(agrabahMarketplace.abilities).toBeUndefined();
    expect(agrabahMarketplace.cost).toBe(3);
    expect(agrabahMarketplace.moveCost).toBe(1);
    expect(agrabahMarketplace.willpower).toBe(5);
    expect(agrabahMarketplace.lore).toBe(2);
    expect(agrabahMarketplace.inkable).toBe(true);
  });
});
