import { describe, test } from "vite-plus/test";
import { op10SanjiSp003 } from "../../../../../cards/src/cards/OP10/characters/003-sanji-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST14-003 Sanji (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10SanjiSp003);
  });
});
