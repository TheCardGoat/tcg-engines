import { describe, it } from "vite-plus/test";
import { gd02Resource012 } from "./012-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-012) [gd02]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd02Resource012, { cardNumber: "R-012" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd02Resource012);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd02Resource012);
  });
});
