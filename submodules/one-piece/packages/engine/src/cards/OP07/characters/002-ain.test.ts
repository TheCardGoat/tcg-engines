import { describe, test } from "vite-plus/test";
import { op07Ain002 } from "../../../../../cards/src/cards/characters/op07-002-ain.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-002 Ain", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Ain002);
  });
});
