import { describe, it } from "vite-plus/test";
import { gd01Resource009 } from "./009-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-009) [gd01]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd01Resource009, { cardNumber: "R-009" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd01Resource009);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd01Resource009);
  });
});
