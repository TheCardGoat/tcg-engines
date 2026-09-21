import { describe, test } from "vite-plus/test";
import { op14eb04CrescentCutlass098 } from "../../../../../cards/src/cards/events/op14-098-crescent-cutlass.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-098 Crescent Cutlass", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04CrescentCutlass098);
  });
});
