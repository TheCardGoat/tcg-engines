import { describe, test } from "vite-plus/test";
import { op08CharlotteOven061 } from "../../../../../cards/src/cards/OP08/characters/061-charlotte-oven.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-061 Charlotte Oven", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlotteOven061);
  });
});
