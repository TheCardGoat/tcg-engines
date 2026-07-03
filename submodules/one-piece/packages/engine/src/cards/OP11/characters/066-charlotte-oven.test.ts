import { describe, test } from "vite-plus/test";
import { op11CharlotteOven066 } from "../../../../../cards/src/cards/OP11/characters/066-charlotte-oven.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-066 Charlotte Oven", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11CharlotteOven066);
  });
});
