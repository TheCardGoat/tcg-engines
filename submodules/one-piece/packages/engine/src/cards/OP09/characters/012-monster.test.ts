import { describe, test } from "vite-plus/test";
import { op09Monster012 } from "../../../../../cards/src/cards/characters/op09-012-monster.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-012 Monster", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Monster012);
  });
});
