import { describe, test } from "vite-plus/test";
import { op08CharlottePerospero068 } from "../../../../../cards/src/cards/OP08/characters/068-charlotte-perospero.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-068 Charlotte Perospero", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlottePerospero068);
  });
});
