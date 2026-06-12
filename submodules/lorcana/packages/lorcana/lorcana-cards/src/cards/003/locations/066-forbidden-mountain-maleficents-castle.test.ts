import { describe, expect, it } from "bun:test";
import { forbiddenMountainMaleficentsCastle } from "./066-forbidden-mountain-maleficents-castle";

describe("Forbidden Mountain - Maleficent's Castle", () => {
  it("is a vanilla location with the printed baseline stats", () => {
    expect(forbiddenMountainMaleficentsCastle.vanilla).toBe(true);
    expect(forbiddenMountainMaleficentsCastle.abilities).toBeUndefined();
    expect(forbiddenMountainMaleficentsCastle.cost).toBe(2);
    expect(forbiddenMountainMaleficentsCastle.moveCost).toBe(1);
    expect(forbiddenMountainMaleficentsCastle.willpower).toBe(6);
    expect(forbiddenMountainMaleficentsCastle.lore).toBe(1);
    expect(forbiddenMountainMaleficentsCastle.inkable).toBe(true);
  });
});
