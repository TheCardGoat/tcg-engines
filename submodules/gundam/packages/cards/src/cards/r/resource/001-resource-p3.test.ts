import { describe, it } from "vite-plus/test";
import { st04Resource001 } from "./001-resource-p3.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-001-p3) [st04]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(st04Resource001, { cardNumber: "R-001-p3" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(st04Resource001);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(st04Resource001);
  });
});
