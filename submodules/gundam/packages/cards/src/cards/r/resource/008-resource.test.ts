import { describe, it } from "vite-plus/test";
import { gd01Resource008 } from "./008-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-008) [gd01]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd01Resource008, { cardNumber: "R-008" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd01Resource008);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd01Resource008);
  });
});
