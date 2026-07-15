import { describe, test } from "vite-plus/test";
import { op09Monster012 } from "../../../../../cards/src/cards/OP09/characters/012-monster.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-012 Monster", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Monster012);
  });
});
