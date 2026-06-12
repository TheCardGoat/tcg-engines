import { describe, it } from "vite-plus/test";
import { gd02Resource015 } from "./015-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-015) [gd02]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd02Resource015, { cardNumber: "R-015" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd02Resource015);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd02Resource015);
  });
});
