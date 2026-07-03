import { describe, test } from "vite-plus/test";
import { op09Limejuice014 } from "../../../../../cards/src/cards/OP09/characters/014-limejuice.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-014 Limejuice", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Limejuice014);
  });
});
