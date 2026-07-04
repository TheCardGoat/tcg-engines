import { describe, test } from "vite-plus/test";
import { op07Pappag030 } from "../../../../../cards/src/cards/OP07/characters/030-pappag.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-030 Pappag", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Pappag030);
  });
});
