import { describe, it } from "vite-plus/test";
import { gd01Resource003 } from "./003-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-003) [gd01]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd01Resource003, { cardNumber: "R-003" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd01Resource003);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd01Resource003);
  });
});
