import { describe, test } from "vite-plus/test";
import { op10Ryuma094 } from "../../../../../cards/src/cards/OP10/characters/094-ryuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-094 Ryuma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Ryuma094);
  });
});
