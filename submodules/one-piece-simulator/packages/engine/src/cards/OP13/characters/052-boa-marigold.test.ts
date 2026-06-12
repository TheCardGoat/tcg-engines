import { describe, test } from "vite-plus/test";
import { op13BoaMarigold052 } from "../../../../../cards/src/cards/OP13/characters/052-boa-marigold.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-052 Boa Marigold", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13BoaMarigold052);
  });
});
