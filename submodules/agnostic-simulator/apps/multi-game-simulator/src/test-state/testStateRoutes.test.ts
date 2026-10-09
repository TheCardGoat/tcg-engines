import { describe, expect, it } from "vite-plus/test";

import { cyberpunkSimulatorRoutes } from "../games/cyberpunk/Router.tsx";
import { gundamSimulatorRoutes } from "../games/gundam/Router.tsx";
import { onePieceSimulatorRoutes } from "../games/one-piece/Router.tsx";

describe("test state routes", () => {
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
