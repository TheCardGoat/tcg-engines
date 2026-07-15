import { describe, test } from "vite-plus/test";
import { op06Tokikake052 } from "../../../../../cards/src/cards/OP06/characters/052-tokikake.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-052 Tokikake", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Tokikake052);
  });
});
