import { describe, test } from "vite-plus/test";
import { prb02LuckyRoux003 } from "../../../../../cards/src/cards/PRB02/characters/003-lucky-roux.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-003 Lucky.Roux", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02LuckyRoux003);
  });
});
