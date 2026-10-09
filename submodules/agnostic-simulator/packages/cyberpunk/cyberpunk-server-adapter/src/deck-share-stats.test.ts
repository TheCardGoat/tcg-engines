import { describe, expect, it } from "vite-plus/test";

import { buildCyberpunkShareStats } from "./deck-share-stats";

describe("buildCyberpunkShareStats", () => {
  it("includes alpha cards that are outside the merged gameplay catalog", () => {
    const stats = buildCyberpunkShareStats([{ canonicalId: "armored-minotaur", quantity: 3 }]);

    expect(stats).not.toBeNull();
    expect(stats?.mainDeckCount).toBe(3);
    expect(stats?.types).toEqual([
      expect.objectContaining({
        label: "Units",
        count: 3,
      }),
    ]);
  });
});
