import { describe, test } from "vite-plus/test";
import { op11Smoker005 } from "../../../../../cards/src/cards/OP11/characters/005-smoker.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-005 Smoker", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Smoker005);
  });
});
