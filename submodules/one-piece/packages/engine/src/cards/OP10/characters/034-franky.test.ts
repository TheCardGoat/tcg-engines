import { describe, test } from "vite-plus/test";
import { op10Franky034 } from "../../../../../cards/src/cards/OP10/characters/034-franky.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-034 Franky", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Franky034);
  });
});
