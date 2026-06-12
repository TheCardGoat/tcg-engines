import { describe, test } from "vite-plus/test";
import { op07BoaMarigold052 } from "../../../../../cards/src/cards/OP07/characters/052-boa-marigold.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-052 Boa Marigold", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07BoaMarigold052);
  });
});
