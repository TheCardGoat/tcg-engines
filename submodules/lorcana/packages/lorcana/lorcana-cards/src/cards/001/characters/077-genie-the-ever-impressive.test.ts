import { describe, expect, it } from "bun:test";
import { genieTheEverImpressive } from "./077-genie-the-ever-impressive";

describe("Genie - The Ever Impressive", () => {
  it("is a vanilla character with the printed baseline stats", () => {
    expect(genieTheEverImpressive.vanilla).toBe(true);
    expect(genieTheEverImpressive.abilities).toBeUndefined();
    expect(genieTheEverImpressive.cost).toBe(2);
    expect(genieTheEverImpressive.strength).toBe(2);
    expect(genieTheEverImpressive.willpower).toBe(3);
    expect(genieTheEverImpressive.lore).toBe(1);
    expect(genieTheEverImpressive.inkable).toBe(true);
  });
});
