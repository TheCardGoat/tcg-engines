import { describe, test } from "vite-plus/test";
import { op06Sakazuki046 } from "../../../../../cards/src/cards/OP06/characters/046-sakazuki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-046 Sakazuki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Sakazuki046);
  });
});
