import { describe, test } from "vite-plus/test";
import { op08CharlotteBrulee066 } from "../../../../../cards/src/cards/OP08/characters/066-charlotte-brulee.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-066 Charlotte Brulee", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlotteBrulee066);
  });
});
