import { describe, it } from "vite-plus/test";
import { gd02Resource013 } from "./013-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-013) [gd02]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd02Resource013, { cardNumber: "R-013" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd02Resource013);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd02Resource013);
  });
});
