import { describe, expect, test } from "vite-plus/test";

import {
  findMountedSimulatorRoute,
  findMountedSimulatorRouteForGame,
  mountedSimulatorPath,
} from "./mountedSimulators.tsx";

describe("mounted simulator routes", () => {
  test("discovers the One Piece mounted simulator route", () => {
    expect(mountedSimulatorPath("one-piece")).toBe("/one-piece/simulator");
    expect(findMountedSimulatorRouteForGame("one-piece")?.basename).toBe("/one-piece/simulator");
    expect(findMountedSimulatorRoute("/one-piece/simulator")?.gameSlug).toBe("one-piece");
    expect(findMountedSimulatorRoute("/one-piece/simulator/table")?.gameSlug).toBe("one-piece");
  });
});
