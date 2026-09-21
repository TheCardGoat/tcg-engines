import { describe, test } from "vite-plus/test";
import { op07Franky107 } from "../../../../../cards/src/cards/characters/op07-107-franky.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-107 Franky", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Franky107);
  });
});
