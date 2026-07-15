import { describe, test } from "vite-plus/test";
import { op08TashigiSp006 } from "../../../../../cards/src/cards/OP08/characters/006-tashigi-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST06-006 Tashigi (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08TashigiSp006);
  });
});
