import { describe, test } from "vite-plus/test";
import { op11Hibari010 } from "../../../../../cards/src/cards/OP11/characters/010-hibari.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-010 Hibari", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Hibari010);
  });
});
