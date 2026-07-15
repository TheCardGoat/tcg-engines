import { describe, test } from "vite-plus/test";
import { op08Pekoms029 } from "../../../../../cards/src/cards/OP08/characters/029-pekoms.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-029 Pekoms", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Pekoms029);
  });
});
