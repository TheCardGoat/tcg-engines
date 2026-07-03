import { describe, test } from "vite-plus/test";
import { op01Queen097 } from "../../../../../cards/src/cards/OP01/characters/097-queen.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-097 Queen", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Queen097);
  });
});
