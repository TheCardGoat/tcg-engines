import { describe, test } from "vite-plus/test";
import { op07Edison100 } from "../../../../../cards/src/cards/OP07/characters/100-edison.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-100 Edison", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Edison100);
  });
});
