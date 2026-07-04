import { describe, test } from "vite-plus/test";
import { prb02SaboPrb02014014 } from "../../../../../cards/src/cards/PRB02/characters/014-sabo-prb02-014.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-014 Sabo - PRB02-014", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SaboPrb02014014);
  });
});
