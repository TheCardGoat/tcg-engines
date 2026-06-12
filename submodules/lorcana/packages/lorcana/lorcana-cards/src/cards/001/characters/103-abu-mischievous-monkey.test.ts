import { describe, expect, it } from "bun:test";
import { abuMischievousMonkey } from "./103-abu-mischievous-monkey";

describe("Abu - Mischievous Monkey", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(abuMischievousMonkey.vanilla).toBe(true);
    expect(abuMischievousMonkey.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(abuMischievousMonkey.cost).toBe(3);
    expect(abuMischievousMonkey.strength).toBe(3);
    expect(abuMischievousMonkey.willpower).toBe(2);
    expect(abuMischievousMonkey.lore).toBe(2);
  });

  it("is inkable", () => {
    expect(abuMischievousMonkey.inkable).toBe(true);
  });
});
