import { describe, expect, it } from "vitest";

import { parseGrandArchiveTestMarkers } from "../scripts/card-coverage/test-markers.ts";

describe("card coverage markers", () => {
  it("accepts markers backed by direct and shared-contract tests", () => {
    expect(
      parseGrandArchiveTestMarkers(
        "direct.test.ts",
        `/** @covers card-a1 */\nit("proves behavior", () => {});`,
      ).abilities,
    ).toEqual(new Set(["card-a1"]));
    expect(
      parseGrandArchiveTestMarkers(
        "contract.test.ts",
        `/** @covers card-a2 */\nproveSharedContract({ card });`,
      ).abilities,
    ).toEqual(new Set(["card-a2"]));
  });

  it.each([
    "it.skip",
    "it.todo",
    "it.only",
    "it.skipIf",
    "it.runIf",
    "it.each.skip",
    "it.skip.each",
    "describe.skip",
  ])("rejects coverage claimed by a disabled %s declaration", (declaration) => {
    expect(() =>
      parseGrandArchiveTestMarkers(
        "disabled.test.ts",
        `/** @covers card-a1 */\n${declaration}("behavior", () => {});`,
      ),
    ).toThrow("disabled or exclusive test declaration");
  });

  it("rejects annotation-only coverage", () => {
    expect(() =>
      parseGrandArchiveTestMarkers("annotation.test.ts", "/** @covers card-a1 */"),
    ).toThrow("without registering a runnable test");
  });
});
