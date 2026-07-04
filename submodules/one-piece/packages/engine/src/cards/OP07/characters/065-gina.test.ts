import { describe, test } from "vite-plus/test";
import { op07Gina065 } from "../../../../../cards/src/cards/OP07/characters/065-gina.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-065 Gina", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Gina065);
  });
});
