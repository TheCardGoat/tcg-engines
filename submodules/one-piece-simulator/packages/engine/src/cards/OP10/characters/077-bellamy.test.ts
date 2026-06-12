import { describe, test } from "vite-plus/test";
import { op10Bellamy077 } from "../../../../../cards/src/cards/OP10/characters/077-bellamy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-077 Bellamy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Bellamy077);
  });
});
