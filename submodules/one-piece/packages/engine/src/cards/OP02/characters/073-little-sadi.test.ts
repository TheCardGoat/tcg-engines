import { describe, test } from "vite-plus/test";
import { op02LittleSadi073 } from "../../../../../cards/src/cards/OP02/characters/073-little-sadi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-073 Little Sadi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02LittleSadi073);
  });
});
