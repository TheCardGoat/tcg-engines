import { describe, test } from "vite-plus/test";
import { op10Smoker030 } from "../../../../../cards/src/cards/OP10/characters/030-smoker.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-030 Smoker", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Smoker030);
  });
});
