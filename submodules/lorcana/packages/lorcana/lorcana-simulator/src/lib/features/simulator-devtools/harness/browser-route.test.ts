import { describe, expect, it } from "bun:test";

import { resolveBrowserRouteState, resolveBrowserTransportConfig } from "./browser-route.js";

describe("browser-route", () => {
  it("defaults browser transport to zero-latency async when no transport params are present", () => {
    const state = resolveBrowserRouteState(new URL("http://example.test/test?fixtureId=pre-game"));

    expect(state.browserTransport).toEqual({
      mode: "async",
      latencyMs: 0,
      latencyModel: "one-way",
    });
    expect(state.view).toBe("playerOne");
    expect(state.fixtureId).toBe("pre-game");
  });

  it("normalizes bare async transport requests to the default RTT preset", () => {
    const browserTransport = resolveBrowserTransportConfig(
      new URL("http://example.test/test?transport=async"),
    );

    expect(browserTransport).toEqual({
      mode: "async",
      latencyMs: 250,
      latencyModel: "rtt",
    });
  });

  it("preserves explicit async transport query params", () => {
    const state = resolveBrowserRouteState(
      new URL(
        "http://example.test/test?fixtureId=pre-game&view=playerTwo&transport=async&latencyMs=250&latencyModel=rtt",
      ),
    );

    expect(state.view).toBe("playerTwo");
    expect(state.browserTransport).toEqual({
      mode: "async",
      latencyMs: 250,
      latencyModel: "rtt",
    });
  });
});
