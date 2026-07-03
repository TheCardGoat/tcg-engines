import { describe, test } from "vite-plus/test";
import { op03TopKnot074 } from "../../../../../cards/src/cards/OP03/events/074-top-knot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-074 Top Knot", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03TopKnot074);
  });
});
