import { describe, test } from "vite-plus/test";
import { op11Aladine024 } from "../../../../../cards/src/cards/OP11/characters/024-aladine.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-024 Aladine", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Aladine024);
  });
});
