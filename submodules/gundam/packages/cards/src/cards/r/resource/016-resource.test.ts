import { describe, it } from "vite-plus/test";
import { gd02Resource016 } from "./016-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-016) [gd02]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd02Resource016, { cardNumber: "R-016" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd02Resource016);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd02Resource016);
  });
});
