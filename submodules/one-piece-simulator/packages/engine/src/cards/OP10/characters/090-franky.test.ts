import { describe, test } from "vite-plus/test";
import { op10Franky090 } from "../../../../../cards/src/cards/OP10/characters/090-franky.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-090 Franky", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Franky090);
  });
});
