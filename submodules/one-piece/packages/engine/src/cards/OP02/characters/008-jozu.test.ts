import { describe, test } from "vite-plus/test";
import { op02Jozu008 } from "../../../../../cards/src/cards/characters/op02-008-jozu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-008 Jozu", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Jozu008);
  });
});
