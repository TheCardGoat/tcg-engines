import { describe, expect, it } from "bun:test";
import { tootlesLostBoy } from "./076-tootles-lost-boy";

describe("Tootles - Lost Boy", () => {
  it("is a vanilla character with the printed baseline stats", () => {
    expect(tootlesLostBoy.vanilla).toBe(true);
    expect(tootlesLostBoy.abilities).toBeUndefined();
    expect(tootlesLostBoy.cost).toBe(1);
    expect(tootlesLostBoy.strength).toBe(2);
    expect(tootlesLostBoy.willpower).toBe(2);
    expect(tootlesLostBoy.lore).toBe(1);
    expect(tootlesLostBoy.inkable).toBe(true);
  });
});
