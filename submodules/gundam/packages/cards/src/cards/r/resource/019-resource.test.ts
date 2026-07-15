import { describe, it } from "vite-plus/test";
import { gd02Resource019 } from "./019-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-019) [gd02]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd02Resource019, { cardNumber: "R-019" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd02Resource019);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd02Resource019);
  });
});
