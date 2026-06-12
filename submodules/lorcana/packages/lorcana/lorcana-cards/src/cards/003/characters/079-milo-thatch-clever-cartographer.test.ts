import { describe, expect, it } from "bun:test";
import { miloThatchCleverCartographer } from "./079-milo-thatch-clever-cartographer";

describe("Milo Thatch - Clever Cartographer", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(miloThatchCleverCartographer.vanilla).toBe(true);
    expect(miloThatchCleverCartographer.abilities).toBeUndefined();
  });
});
