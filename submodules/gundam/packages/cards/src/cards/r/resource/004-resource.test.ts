import { describe, it } from "vite-plus/test";
import { gd01Resource004 } from "./004-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-004) [gd01]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd01Resource004, { cardNumber: "R-004" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd01Resource004);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd01Resource004);
  });
});
