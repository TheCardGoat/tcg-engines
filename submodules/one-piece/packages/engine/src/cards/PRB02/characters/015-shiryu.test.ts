import { describe, test } from "vite-plus/test";
import { prb02Shiryu015 } from "../../../../../cards/src/cards/PRB02/characters/015-shiryu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-015 Shiryu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02Shiryu015);
  });
});
