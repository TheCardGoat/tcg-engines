import { describe, it } from "vite-plus/test";
import { gd02Resource014 } from "./014-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-014) [gd02]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd02Resource014, { cardNumber: "R-014" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd02Resource014);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd02Resource014);
  });
});
