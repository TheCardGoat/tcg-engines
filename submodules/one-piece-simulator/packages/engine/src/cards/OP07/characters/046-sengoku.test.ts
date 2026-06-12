import { describe, test } from "vite-plus/test";
import { op07Sengoku046 } from "../../../../../cards/src/cards/OP07/characters/046-sengoku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-046 Sengoku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Sengoku046);
  });
});
