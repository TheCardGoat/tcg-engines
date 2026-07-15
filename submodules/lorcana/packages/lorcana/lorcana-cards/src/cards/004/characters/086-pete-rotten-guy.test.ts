import { describe, expect, it } from "bun:test";
import { peteRottenGuy } from "./086-pete-rotten-guy";

describe("Pete - Rotten Guy", () => {
  it("is a vanilla character with the printed stats and no abilities", () => {
    expect(peteRottenGuy.vanilla).toBe(true);
    expect(peteRottenGuy.abilities).toBeUndefined();
    expect(peteRottenGuy.classifications).toEqual(["Storyborn", "Villain", "Musketeer"]);
    expect(peteRottenGuy.cost).toBe(4);
    expect(peteRottenGuy.strength).toBe(1);
    expect(peteRottenGuy.willpower).toBe(5);
    expect(peteRottenGuy.lore).toBe(2);
    expect(peteRottenGuy.inkable).toBe(true);
  });
});
