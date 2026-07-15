import { describe, expect, it } from "bun:test";
import { zootopiaTundratown } from "./034-zootopia-tundratown";

describe("Zootopia - Tundratown", () => {
  it("is a vanilla location with the printed baseline stats", () => {
    expect(zootopiaTundratown.vanilla).toBe(true);
    expect(zootopiaTundratown.abilities).toBeUndefined();
    expect(zootopiaTundratown.cost).toBe(1);
    expect(zootopiaTundratown.moveCost).toBe(1);
    expect(zootopiaTundratown.willpower).toBe(5);
    expect(zootopiaTundratown.lore).toBe(1);
  });
});
