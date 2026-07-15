import { describe, test } from "vite-plus/test";
import { op09Marco052 } from "../../../../../cards/src/cards/OP09/characters/052-marco.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-052 Marco", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Marco052);
  });
});
