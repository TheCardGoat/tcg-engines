import { describe, test } from "vite-plus/test";
import { op04King045 } from "../../../../../cards/src/cards/characters/op04-045-king.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-045 King", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04King045);
  });
});
