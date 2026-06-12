import { describe, expect, it } from "bun:test";
import { dukeOfWeseltonOpportunisticOfficial } from "./073-duke-of-weselton-opportunistic-official";

describe("Duke of Weselton - Opportunistic Official", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(dukeOfWeseltonOpportunisticOfficial.vanilla).toBe(true);
    expect(dukeOfWeseltonOpportunisticOfficial.abilities).toBeUndefined();
  });
});
