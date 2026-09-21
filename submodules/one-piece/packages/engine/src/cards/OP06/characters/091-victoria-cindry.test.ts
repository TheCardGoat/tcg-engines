import { describe, test } from "vite-plus/test";
import { op06VictoriaCindry091 } from "../../../../../cards/src/cards/characters/op06-091-victoria-cindry.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-091 Victoria Cindry", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06VictoriaCindry091);
  });
});
