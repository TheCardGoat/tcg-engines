import { describe, test } from "vite-plus/test";
import { op08QueenSp005 } from "../../../../../cards/src/cards/OP08/characters/005-queen-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST04-005 Queen (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08QueenSp005);
  });
});
