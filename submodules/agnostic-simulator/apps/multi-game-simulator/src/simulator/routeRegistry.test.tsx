import { describe, expect, it } from "vite-plus/test";

import { resolveSimulatorRoute } from "./routeRegistry.tsx";

describe("Gundam simulator route registry", () => {
  it("uses the shared tester hub for the public simulator root", () => {
    expect(resolveSimulatorRoute("gundam", "game-index")?.Page).toBeDefined();
  });

  it("loads named Gundam fixtures through the shared test-fixture route", () => {
    expect(resolveSimulatorRoute("gundam", "test-fixture")?.Page).toBe(
      resolveSimulatorRoute("gundam", "vs-ai")?.Page,
    );
  });
});

describe("Riftbound simulator route registry", () => {
  it("resolves a match-only URL through the shared landing route", () => {
    expect(resolveSimulatorRoute("riftbound", "match-landing")?.Page).toBeDefined();
  });
});

describe("Grand Archive simulator route registry", () => {
  it("exposes the Standard practice surface and wait-state fixtures", () => {
    expect(resolveSimulatorRoute("grand-archive", "play-practice")?.Page).toBeDefined();
    expect(resolveSimulatorRoute("grand-archive", "game-index")?.Page).toBeDefined();
    expect(resolveSimulatorRoute("grand-archive", "tests")?.Page).toBeDefined();
    expect(resolveSimulatorRoute("grand-archive", "test-fixture")?.Page).toBeDefined();
    expect(resolveSimulatorRoute("grand-archive", "match-landing")?.Page).toBeDefined();
    expect(resolveSimulatorRoute("grand-archive", "live-match")?.Page).toBeDefined();
  });
});
