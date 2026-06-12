import { describe, test } from "vite-plus/test";
import { prb02CharlottePuddingPrb02010010 } from "../../../../../cards/src/cards/PRB02/characters/010-charlotte-pudding-prb02-010.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-010 Charlotte Pudding - PRB02-010", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02CharlottePuddingPrb02010010);
  });
});
