import { describe, test } from "vite-plus/test";
import { op02Morley061 } from "../../../../../cards/src/cards/characters/op02-061-morley.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-061 Morley", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Morley061);
  });
});
