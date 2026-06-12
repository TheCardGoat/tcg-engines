import { describe, expect, it } from "bun:test";
import { neverLandMermaidLagoon } from "./032-never-land-mermaid-lagoon";

describe("Never Land - Mermaid Lagoon", () => {
  it("is a vanilla location with the printed baseline stats", () => {
    expect(neverLandMermaidLagoon.vanilla).toBe(true);
    expect(neverLandMermaidLagoon.abilities).toBeUndefined();
    expect(neverLandMermaidLagoon.cost).toBe(1);
    expect(neverLandMermaidLagoon.moveCost).toBe(1);
    expect(neverLandMermaidLagoon.willpower).toBe(4);
    expect(neverLandMermaidLagoon.lore).toBe(1);
    expect(neverLandMermaidLagoon.inkable).toBe(true);
  });
});
