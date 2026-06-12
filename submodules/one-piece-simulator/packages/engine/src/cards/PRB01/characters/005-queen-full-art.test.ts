import { describe, test } from "vite-plus/test";
import { prb01QueenFullArt005 } from "../../../../../cards/src/cards/PRB01/characters/005-queen-full-art.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST04-005 Queen (Full Art)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01QueenFullArt005);
  });
});
