import { describe, test } from "vite-plus/test";
import { op13Crocus062 } from "../../../../../cards/src/cards/OP13/characters/062-crocus.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-062 Crocus", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Crocus062);
  });
});
