import { describe, expect, it } from "bun:test";
import { tukTukBigBuddy } from "./184-tuk-tuk-big-buddy";

describe("Tuk Tuk - Big Buddy", () => {
  it("is a vanilla character with the printed baseline stats", () => {
    expect(tukTukBigBuddy.vanilla).toBe(true);
    expect(tukTukBigBuddy.abilities).toBeUndefined();
    expect(tukTukBigBuddy.cost).toBe(5);
    expect(tukTukBigBuddy.strength).toBe(6);
    expect(tukTukBigBuddy.willpower).toBe(5);
    expect(tukTukBigBuddy.lore).toBe(1);
    expect(tukTukBigBuddy.inkable).toBe(true);
    expect(tukTukBigBuddy.inkType).toContain("steel");
    expect(tukTukBigBuddy.classifications).toContain("Storyborn");
    expect(tukTukBigBuddy.classifications).toContain("Ally");
  });
});
