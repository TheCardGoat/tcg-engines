import { describe, test } from "vite-plus/test";
import { op11CharlotteLinlin073 } from "../../../../../cards/src/cards/OP11/characters/073-charlotte-linlin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-073 Charlotte Linlin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11CharlotteLinlin073);
  });
});
