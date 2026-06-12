import { describe, expect, it } from "bun:test";
import { sisuWiseFriend } from "./155-sisu-wise-friend";

describe("Sisu - Wise Friend", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(sisuWiseFriend.vanilla).toBe(true);
    expect(sisuWiseFriend.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(sisuWiseFriend.cost).toBe(6);
    expect(sisuWiseFriend.strength).toBe(6);
    expect(sisuWiseFriend.willpower).toBe(6);
    expect(sisuWiseFriend.lore).toBe(2);
  });

  it("is inkable", () => {
    expect(sisuWiseFriend.inkable).toBe(true);
  });
});
