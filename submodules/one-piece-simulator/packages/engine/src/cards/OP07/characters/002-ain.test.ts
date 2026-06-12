import { describe, test } from "vite-plus/test";
import { op07Ain002 } from "../../../../../cards/src/cards/OP07/characters/002-ain.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-002 Ain", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Ain002);
  });
});
