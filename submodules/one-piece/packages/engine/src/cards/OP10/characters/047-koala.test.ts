import { describe, test } from "vite-plus/test";
import { op10Koala047 } from "../../../../../cards/src/cards/OP10/characters/047-koala.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-047 Koala", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Koala047);
  });
});
