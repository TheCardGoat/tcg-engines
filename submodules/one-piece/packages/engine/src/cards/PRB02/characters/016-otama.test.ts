import { describe, test } from "vite-plus/test";
import { prb02Otama016 } from "../../../../../cards/src/cards/PRB02/characters/016-otama.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-016 Otama", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02Otama016);
  });
});
