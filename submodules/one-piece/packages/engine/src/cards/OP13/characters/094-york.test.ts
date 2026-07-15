import { describe, test } from "vite-plus/test";
import { op13York094 } from "../../../../../cards/src/cards/OP13/characters/094-york.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-094 York", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13York094);
  });
});
