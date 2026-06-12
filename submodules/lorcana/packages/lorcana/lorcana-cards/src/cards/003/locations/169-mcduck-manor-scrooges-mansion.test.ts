import { describe, expect, it } from "bun:test";
import { mcduckManorScroogesMansion } from "./169-mcduck-manor-scrooges-mansion";

describe("McDuck Manor - Scrooge's Mansion", () => {
  it("is a vanilla location with the printed baseline stats", () => {
    expect(mcduckManorScroogesMansion.vanilla).toBe(true);
    expect(mcduckManorScroogesMansion.abilities).toBeUndefined();
    expect(mcduckManorScroogesMansion.cost).toBe(4);
    expect(mcduckManorScroogesMansion.moveCost).toBe(1);
    expect(mcduckManorScroogesMansion.willpower).toBe(9);
    expect(mcduckManorScroogesMansion.lore).toBe(2);
    expect(mcduckManorScroogesMansion.inkable).toBe(true);
  });
});
