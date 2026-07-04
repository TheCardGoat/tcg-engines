import { describe, test } from "vite-plus/test";
import { op04CharlottePerospero107 } from "../../../../../cards/src/cards/OP04/characters/107-charlotte-perospero.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-107 Charlotte Perospero", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04CharlottePerospero107);
  });
});
