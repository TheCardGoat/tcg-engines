import { describe, test } from "vite-plus/test";
import { op06SugarSp024 } from "../../../../../cards/src/cards/OP06/characters/024-sugar-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-024 Sugar (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06SugarSp024);
  });
});
