import { describe, it } from "vite-plus/test";
import { gd02Resource017 } from "./017-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-017) [gd02]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd02Resource017, { cardNumber: "R-017" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd02Resource017);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd02Resource017);
  });
});
