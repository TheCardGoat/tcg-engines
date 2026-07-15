import { describe, test } from "vite-plus/test";
import { op14eb04Kuro025 } from "../../../../../cards/src/cards/OP14EB04/characters/025-kuro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-025 Kuro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Kuro025);
  });
});
