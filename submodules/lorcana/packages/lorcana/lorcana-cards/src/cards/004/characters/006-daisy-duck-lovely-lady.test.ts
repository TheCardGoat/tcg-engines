import { describe, expect, it } from "bun:test";
import { daisyDuckLovelyLady } from "./006-daisy-duck-lovely-lady";

describe("Daisy Duck - Lovely Lady", () => {
  it("is a vanilla character with the printed stats and no abilities", () => {
    expect(daisyDuckLovelyLady.vanilla).toBe(true);
    expect(daisyDuckLovelyLady.abilities).toBeUndefined();
    expect(daisyDuckLovelyLady.classifications).toEqual(["Dreamborn", "Ally"]);
    expect(daisyDuckLovelyLady.cost).toBe(1);
    expect(daisyDuckLovelyLady.strength).toBe(1);
    expect(daisyDuckLovelyLady.willpower).toBe(3);
    expect(daisyDuckLovelyLady.lore).toBe(1);
    expect(daisyDuckLovelyLady.inkable).toBe(true);
  });
});
