import { describe, test } from "vite-plus/test";
import { op03TopKnot074 } from "../../../../../cards/src/cards/events/op03-074-top-knot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-074 Top Knot", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03TopKnot074);
  });
});
