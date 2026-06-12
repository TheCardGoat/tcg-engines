import { describe, test } from "vite-plus/test";
import { op06CountBattler075 } from "../../../../../cards/src/cards/OP06/characters/075-count-battler.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-075 Count Battler", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06CountBattler075);
  });
});
