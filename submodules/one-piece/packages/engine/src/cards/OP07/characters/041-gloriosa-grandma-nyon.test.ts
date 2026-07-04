import { describe, test } from "vite-plus/test";
import { op07GloriosaGrandmaNyon041 } from "../../../../../cards/src/cards/OP07/characters/041-gloriosa-grandma-nyon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-041 Gloriosa (Grandma Nyon)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07GloriosaGrandmaNyon041);
  });
});
