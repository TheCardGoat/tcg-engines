import { describe, test } from "vite-plus/test";
import { op07GloriosaGrandmaNyon041 } from "../../../../../cards/src/cards/characters/op07-041-gloriosa-grandma-nyon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-041 Gloriosa (Grandma Nyon)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07GloriosaGrandmaNyon041);
  });
});
