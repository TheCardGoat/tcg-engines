import { describe, expect, it } from "vite-plus/test";

import { cyberpunkSimulatorRoutes } from "../games/cyberpunk/Router.tsx";
import { gundamSimulatorRoutes } from "../games/gundam/Router.tsx";
import { onePieceSimulatorRoutes } from "../games/one-piece/Router.tsx";
import { CyberpunkTestStatePage } from "../games/cyberpunk/pages/TestState.page.tsx";
import { GundamTestStatePage } from "../games/gundam/pages/TestState.page.tsx";
import { OnePieceTestStatePage } from "../games/one-piece/pages/TestState.page.tsx";

describe("test state routes", () => {
  it("loads mounted game test-state route modules", () => {
    expect(CyberpunkTestStatePage).toBeTypeOf("function");
    expect(GundamTestStatePage).toBeTypeOf("function");
    expect(OnePieceTestStatePage).toBeTypeOf("function");
  });

  it("mounts test-engine state under the visual fixture route family", () => {
    expect(cyberpunkSimulatorRoutes.map((route) => route.path)).toContain(
      "/tests/test-engine-state",
    );
    expect(gundamSimulatorRoutes.map((route) => route.path)).toContain("/tests/test-engine-state");
    expect(onePieceSimulatorRoutes.map((route) => route.path)).toContain(
      "/tests/test-engine-state",
    );
  });
});
