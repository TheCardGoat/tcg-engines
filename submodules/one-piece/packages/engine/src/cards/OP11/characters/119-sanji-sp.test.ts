import { describe, test } from "vite-plus/test";
import { op11SanjiSp119 } from "../../../../../cards/src/cards/OP11/characters/119-sanji-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-119 Sanji (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11SanjiSp119);
  });
});
