import { describe, test } from "vite-plus/test";
import { op10CeaserSoldier007 } from "../../../../../cards/src/cards/OP10/characters/007-ceaser-soldier.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-007 Ceaser Soldier", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10CeaserSoldier007);
  });
});
