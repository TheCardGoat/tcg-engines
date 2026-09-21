import { describe, test } from "vite-plus/test";
import { op08Pekoms029 } from "../../../../../cards/src/cards/characters/op08-029-pekoms.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-029 Pekoms", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Pekoms029);
  });
});
