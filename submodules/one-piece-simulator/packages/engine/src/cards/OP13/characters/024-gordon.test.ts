import { describe, test } from "vite-plus/test";
import { op13Gordon024 } from "../../../../../cards/src/cards/OP13/characters/024-gordon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-024 Gordon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Gordon024);
  });
});
