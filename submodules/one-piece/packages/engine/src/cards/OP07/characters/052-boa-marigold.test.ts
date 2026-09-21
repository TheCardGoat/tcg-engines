import { describe, test } from "vite-plus/test";
import { op07BoaMarigold052 } from "../../../../../cards/src/cards/characters/op07-052-boa-marigold.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-052 Boa Marigold", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07BoaMarigold052);
  });
});
