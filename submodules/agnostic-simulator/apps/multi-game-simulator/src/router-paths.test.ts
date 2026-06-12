import { describe, expect, test } from "vitest";
import { buildMountedHref, normalizeRouterBasename } from "./router-paths";

describe("router path helpers", () => {
  test("normalizes router basenames for browser router mounting", () => {
    expect(normalizeRouterBasename(undefined)).toBe("/");
    expect(normalizeRouterBasename("/")).toBe("/");
    expect(normalizeRouterBasename("cyberpunk/simulator/")).toBe("/cyberpunk/simulator");
    expect(normalizeRouterBasename("/cyberpunk/simulator/")).toBe("/cyberpunk/simulator");
  });

  test("builds hrefs under a mounted basename", () => {
    expect(buildMountedHref("/matches/match_1", "/cyberpunk/simulator/")).toBe(
      "/cyberpunk/simulator/matches/match_1",
    );
    expect(buildMountedHref("matches/match_1", "/")).toBe("/matches/match_1");
  });
});
