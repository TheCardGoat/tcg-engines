import { describe, test } from "vite-plus/test";
import { prb02JinbePrb02007007 } from "../../../../../cards/src/cards/PRB02/characters/007-jinbe-prb02-007.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-007 Jinbe - PRB02-007", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02JinbePrb02007007);
  });
});
