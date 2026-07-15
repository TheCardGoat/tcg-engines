import { describe, expect, it } from "bun:test";

import { resolveBrowserRouteState } from "../../src/lib/features/simulator-devtools/harness/browser-route.js";
import { buildLorcanaHarnessPath } from "./lorcana-simulator-pom.js";

describe("lorcana-simulator-pom", () => {
  it("builds /test harness paths by default", () => {
    const path = buildLorcanaHarnessPath({
      fixtureId: "pre-game",
      view: "playerOne",
    });

    expect(path.startsWith("/test?")).toBe(true);
    expect(path).toContain("fixtureId=pre-game");
    expect(path).toContain("view=playerOne");
  });

  it("round-trips async transport params through the browser route parser", () => {
    const path = buildLorcanaHarnessPath({
      fixtureId: "pre-game",
      view: "playerTwo",
      transport: "async",
      latencyMs: 250,
      latencyModel: "rtt",
    });
    const state = resolveBrowserRouteState(new URL(`http://example.test${path}`));

    expect(state.fixtureId).toBe("pre-game");
    expect(state.view).toBe("playerTwo");
    expect(state.browserTransport).toEqual({
      mode: "async",
      latencyMs: 250,
      latencyModel: "rtt",
    });
  });
});
