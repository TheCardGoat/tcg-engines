import { describe, expect, it } from "bun:test";
import { genieTheEverImpressive } from "./077-genie-the-ever-impressive";

describe("Genie - The Ever Impressive", () => {
  it("is a vanilla card (no abilities)", () => {
    // Verify this card is marked as vanilla
    expect(genieTheEverImpressive.vanilla).toBe(true);

    // Verify no abilities array
    expect(genieTheEverImpressive.abilities).toBeUndefined();
  });
});
