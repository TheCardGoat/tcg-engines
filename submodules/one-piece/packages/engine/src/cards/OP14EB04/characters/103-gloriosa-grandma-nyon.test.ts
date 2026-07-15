import { describe, test } from "vite-plus/test";
import { op14eb04GloriosaGrandmaNyon103 } from "../../../../../cards/src/cards/OP14EB04/characters/103-gloriosa-grandma-nyon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-103 Gloriosa (Grandma Nyon)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04GloriosaGrandmaNyon103);
  });
});
