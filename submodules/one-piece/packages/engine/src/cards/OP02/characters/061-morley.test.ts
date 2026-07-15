import { describe, test } from "vite-plus/test";
import { op02Morley061 } from "../../../../../cards/src/cards/OP02/characters/061-morley.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-061 Morley", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Morley061);
  });
});
