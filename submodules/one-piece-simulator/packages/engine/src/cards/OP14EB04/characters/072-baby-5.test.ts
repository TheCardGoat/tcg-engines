import { describe, test } from "vite-plus/test";
import { op14eb04Baby5072 } from "../../../../../cards/src/cards/OP14EB04/characters/072-baby-5.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-072 Baby 5", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Baby5072);
  });
});
