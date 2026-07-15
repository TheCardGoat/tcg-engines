import { describe, it } from "vite-plus/test";
import { gd02Resource010 } from "./010-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-010) [gd02]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd02Resource010, { cardNumber: "R-010" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd02Resource010);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd02Resource010);
  });
});
