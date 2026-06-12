import { describe, it } from "vite-plus/test";
import { gd01Resource006 } from "./006-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-006) [gd01]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd01Resource006, { cardNumber: "R-006" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd01Resource006);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd01Resource006);
  });
});
