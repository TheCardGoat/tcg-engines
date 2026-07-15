import { describe, test } from "vite-plus/test";
import { prb02EdwardNewgateSt15002Reprint002 } from "../../../../../cards/src/cards/PRB02/characters/002-edward-newgate-st15-002-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST15-002 Edward.Newgate - ST15-002 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02EdwardNewgateSt15002Reprint002);
  });
});
