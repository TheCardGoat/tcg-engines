import { describe, test } from "vite-plus/test";
import { prb02MonkeyDDragonReprint015 } from "../../../../../cards/src/cards/PRB02/characters/015-monkey-d-dragon-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-015 Monkey.D.Dragon (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02MonkeyDDragonReprint015);
  });
});
