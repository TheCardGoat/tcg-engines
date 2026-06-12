import { describe, expect, it } from "bun:test";
import { peteFreebooter } from "./122-pete-freebooter";

describe("Pete - Freebooter", () => {
  it("is a vanilla character with the printed baseline stats", () => {
    expect(peteFreebooter.vanilla).toBe(true);
    expect(peteFreebooter.abilities).toBeUndefined();
    expect(peteFreebooter.cost).toBe(3);
    expect(peteFreebooter.strength).toBe(5);
    expect(peteFreebooter.willpower).toBe(2);
    expect(peteFreebooter.lore).toBe(1);
    expect(peteFreebooter.inkable).toBe(true);
  });
});
