import { describe, test } from "vite-plus/test";
import { op07Franky107 } from "../../../../../cards/src/cards/OP07/characters/107-franky.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-107 Franky", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Franky107);
  });
});
