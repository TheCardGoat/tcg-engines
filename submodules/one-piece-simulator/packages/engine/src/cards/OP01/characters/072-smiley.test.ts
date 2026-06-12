import { describe, test } from "vite-plus/test";
import { op01Smiley072 } from "../../../../../cards/src/cards/OP01/characters/072-smiley.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-072 Smiley", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Smiley072);
  });
});
