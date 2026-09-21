import { describe, test } from "vite-plus/test";
import { op08Carrot023 } from "../../../../../cards/src/cards/characters/op08-023-carrot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-023 Carrot", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Carrot023);
  });
});
