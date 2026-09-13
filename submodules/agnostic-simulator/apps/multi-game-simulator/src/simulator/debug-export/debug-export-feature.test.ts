import { describe, expect, it } from "vitest";

import { isSimulatorDebugExportEnabled } from "./debug-export-feature";

describe("isSimulatorDebugExportEnabled", () => {
  it("defaults to disabled", () => {
    expect(isSimulatorDebugExportEnabled({ NODE_ENV: "development" })).toBe(false);
  });

  it("allows an explicit non-production opt-in", () => {
    expect(
      isSimulatorDebugExportEnabled({
        NODE_ENV: "staging",
        SIMULATOR_DEBUG_EXPORT_ENABLED: "true",
      }),
    ).toBe(true);
  });

  it("allows an explicit staging opt-in in the production Docker runtime", () => {
    expect(
      isSimulatorDebugExportEnabled({
        NODE_ENV: "production",
        RAILWAY_ENVIRONMENT_NAME: "staging",
        SIMULATOR_DEBUG_EXPORT_ENABLED: "true",
      }),
    ).toBe(true);
  });

  it("cannot be enabled in production", () => {
    expect(
      isSimulatorDebugExportEnabled({
        NODE_ENV: "production",
        RAILWAY_ENVIRONMENT_NAME: "production",
        SIMULATOR_DEBUG_EXPORT_ENABLED: "true",
      }),
    ).toBe(false);
  });
});
