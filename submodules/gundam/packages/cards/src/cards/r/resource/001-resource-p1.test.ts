import { describe, it } from "vite-plus/test";
import { st02Resource001 } from "./001-resource-p1.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-001-p1) [st02]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(st02Resource001, { cardNumber: "R-001-p1" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(st02Resource001);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(st02Resource001);
  });
});
