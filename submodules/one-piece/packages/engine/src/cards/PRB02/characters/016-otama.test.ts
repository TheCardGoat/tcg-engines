import { describe, test } from "vite-plus/test";
import { prb02Otama016 } from "../../../../../cards/src/cards/characters/prb02-016-otama.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-016 Otama", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02Otama016);
  });
});
