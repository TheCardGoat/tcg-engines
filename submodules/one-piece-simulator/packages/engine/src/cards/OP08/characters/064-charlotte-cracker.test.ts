import { describe, test } from "vite-plus/test";
import { op08CharlotteCracker064 } from "../../../../../cards/src/cards/OP08/characters/064-charlotte-cracker.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-064 Charlotte Cracker", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlotteCracker064);
  });
});
