import { describe, test } from "vite-plus/test";
import { op02Smoker102 } from "../../../../../cards/src/cards/OP02/characters/102-smoker.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-102 Smoker", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Smoker102);
  });
});
