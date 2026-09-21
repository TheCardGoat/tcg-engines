import { describe, test } from "vite-plus/test";
import { prb02Marco008 } from "../../../../../cards/src/cards/characters/prb02-008-marco.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-008 Marco", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02Marco008);
  });
});
