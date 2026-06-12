import { describe, it } from "vite-plus/test";
import { gd02Resource011 } from "./011-resource.ts";
import {
  assertResourceInert,
  assertResourceReminderText,
  assertResourceShape,
} from "@tcg/gundam-engine";

describe("Resource (R-011) [gd02]", () => {
  it("has correct resource metadata", () => {
    assertResourceShape(gd02Resource011, { cardNumber: "R-011" });
  });

  it("has no effects (resource cards are inert)", () => {
    assertResourceInert(gd02Resource011);
  });

  it("declares the standard resource reminder text", () => {
    assertResourceReminderText(gd02Resource011);
  });
});
