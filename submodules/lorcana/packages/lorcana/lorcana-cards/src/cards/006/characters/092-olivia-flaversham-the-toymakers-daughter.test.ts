import { describe, expect, it } from "bun:test";
import { oliviaFlavershamTheToymakersDaughter } from "./092-olivia-flaversham-the-toymakers-daughter";

describe("Olivia Flaversham - The Toymaker's Daughter", () => {
  it("is a vanilla character with the printed baseline stats", () => {
    expect(oliviaFlavershamTheToymakersDaughter.vanilla).toBe(true);
    expect(oliviaFlavershamTheToymakersDaughter.abilities).toBeUndefined();
    expect(oliviaFlavershamTheToymakersDaughter.cost).toBe(2);
    expect(oliviaFlavershamTheToymakersDaughter.strength).toBe(1);
    expect(oliviaFlavershamTheToymakersDaughter.willpower).toBe(1);
    expect(oliviaFlavershamTheToymakersDaughter.lore).toBe(3);
    expect(oliviaFlavershamTheToymakersDaughter.inkable).toBe(false);
    expect(oliviaFlavershamTheToymakersDaughter.inkType).toContain("emerald");
    expect(oliviaFlavershamTheToymakersDaughter.classifications).toContain("Storyborn");
  });
});
