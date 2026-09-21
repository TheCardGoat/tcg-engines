import { describe, test } from "vite-plus/test";
import { op07Sabo118 } from "../../../../../cards/src/cards/characters/op07-118-sabo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-118 Sabo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Sabo118);
  });
});
