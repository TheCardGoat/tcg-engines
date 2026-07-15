import { describe, it } from "vite-plus/test";
import { gd01Resource002 } from "./002-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-002) [gd01]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd01Resource002, { cardNumber: "R-002" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd01Resource002);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd01Resource002);
  });
});
