import { describe, test } from "vite-plus/test";
import { op01Jack102 } from "../../../../../cards/src/cards/OP01/characters/102-jack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-102 Jack", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Jack102);
  });
});
