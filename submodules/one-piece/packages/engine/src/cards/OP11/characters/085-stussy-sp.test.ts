import { describe, test } from "vite-plus/test";
import { op11StussySp085 } from "../../../../../cards/src/cards/OP11/characters/085-stussy-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-085 Stussy (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11StussySp085);
  });
});
