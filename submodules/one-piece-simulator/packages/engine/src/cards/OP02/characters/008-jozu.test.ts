import { describe, test } from "vite-plus/test";
import { op02Jozu008 } from "../../../../../cards/src/cards/OP02/characters/008-jozu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-008 Jozu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Jozu008);
  });
});
