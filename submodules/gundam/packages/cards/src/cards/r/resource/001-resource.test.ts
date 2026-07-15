import { describe, it } from "vite-plus/test";
import { st01Resource001 } from "./001-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-001) [st01]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(st01Resource001, { cardNumber: "R-001" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(st01Resource001);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(st01Resource001);
  });
});
