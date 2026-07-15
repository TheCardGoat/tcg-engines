import { describe, test } from "vite-plus/test";
import { op10Mansherry056 } from "../../../../../cards/src/cards/OP10/characters/056-mansherry.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-056 Mansherry", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Mansherry056);
  });
});
