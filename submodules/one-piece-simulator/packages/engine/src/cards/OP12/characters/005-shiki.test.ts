import { describe, test } from "vite-plus/test";
import { op12Shiki005 } from "../../../../../cards/src/cards/OP12/characters/005-shiki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-005 Shiki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Shiki005);
  });
});
