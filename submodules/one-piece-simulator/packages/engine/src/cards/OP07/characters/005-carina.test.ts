import { describe, test } from "vite-plus/test";
import { op07Carina005 } from "../../../../../cards/src/cards/OP07/characters/005-carina.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-005 Carina", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Carina005);
  });
});
