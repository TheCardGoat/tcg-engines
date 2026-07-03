import { describe, test } from "vite-plus/test";
import { op13Tom069 } from "../../../../../cards/src/cards/OP13/characters/069-tom.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-069 Tom", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Tom069);
  });
});
