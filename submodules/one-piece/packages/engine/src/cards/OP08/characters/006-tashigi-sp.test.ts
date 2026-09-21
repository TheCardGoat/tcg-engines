import { describe, test } from "vite-plus/test";
import { op08TashigiSp006 } from "../../../../../cards/src/cards/characters/st06-006-tashigi-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST06-006 Tashigi (SP)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08TashigiSp006);
  });
});
