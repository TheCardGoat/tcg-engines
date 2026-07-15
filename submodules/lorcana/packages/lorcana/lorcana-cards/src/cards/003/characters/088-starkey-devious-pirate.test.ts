import { describe, expect, it } from "bun:test";
import { starkeyDeviousPirate } from "./088-starkey-devious-pirate";

describe("Starkey - Devious Pirate", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(starkeyDeviousPirate.vanilla).toBe(true);
    expect(starkeyDeviousPirate.abilities).toBeUndefined();
  });
});
