import { describe, test } from "vite-plus/test";
import { op10Franky014 } from "../../../../../cards/src/cards/OP10/characters/014-franky.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-014 Franky", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Franky014);
  });
});
