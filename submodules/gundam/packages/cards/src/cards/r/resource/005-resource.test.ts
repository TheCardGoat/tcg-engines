import { describe, it } from "vite-plus/test";
import { gd01Resource005 } from "./005-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-005) [gd01]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd01Resource005, { cardNumber: "R-005" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd01Resource005);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd01Resource005);
  });
});
