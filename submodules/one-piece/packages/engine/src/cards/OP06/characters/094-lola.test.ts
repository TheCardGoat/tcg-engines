import { describe, test } from "vite-plus/test";
import { op06Lola094 } from "../../../../../cards/src/cards/OP06/characters/094-lola.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-094 Lola", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Lola094);
  });
});
