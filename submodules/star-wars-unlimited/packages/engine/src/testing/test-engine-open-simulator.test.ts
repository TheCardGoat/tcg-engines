import { describe, expect, it } from "vite-plus/test";

import { SwuTestEngine } from "./test-engine.ts";

describe("SwuTestEngine.openInSimulator", () => {
  it("reports that SWU has no mounted simulator yet", () => {
    const engine = SwuTestEngine.fromFixture();

    expect(() => engine.openInSimulator()).toThrow(
      "Simulator not mounted for star-wars-unlimited yet",
    );
  });
});
