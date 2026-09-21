import { describe, test } from "vite-plus/test";
import { op01CrescentCutlass089 } from "../../../../../cards/src/cards/events/op01-089-crescent-cutlass.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-089 Crescent Cutlass", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01CrescentCutlass089);
  });
});
