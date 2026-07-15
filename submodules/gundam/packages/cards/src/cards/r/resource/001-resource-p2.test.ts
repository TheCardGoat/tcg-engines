import { describe, it } from "vite-plus/test";
import { st03Resource001 } from "./001-resource-p2.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-001-p2) [st03]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(st03Resource001, { cardNumber: "R-001-p2" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(st03Resource001);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(st03Resource001);
  });
});
