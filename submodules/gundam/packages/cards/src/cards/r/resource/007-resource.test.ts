import { describe, it } from "vite-plus/test";
import { gd01Resource007 } from "./007-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-007) [gd01]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd01Resource007, { cardNumber: "R-007" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd01Resource007);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd01Resource007);
  });
});
