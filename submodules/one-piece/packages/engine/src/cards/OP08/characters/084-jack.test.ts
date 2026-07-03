import { describe, test } from "vite-plus/test";
import { op08Jack084 } from "../../../../../cards/src/cards/OP08/characters/084-jack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-084 Jack", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Jack084);
  });
});
