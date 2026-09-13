import { describe, test } from "vite-plus/test";
import { op02Borsalino114 } from "../../../../../cards/src/cards/OP02/characters/114-borsalino.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-114 Borsalino", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Borsalino114);
  });
});
