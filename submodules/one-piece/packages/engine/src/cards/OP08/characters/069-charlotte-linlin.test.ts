import { describe, test } from "vite-plus/test";
import { op08CharlotteLinlin069 } from "../../../../../cards/src/cards/OP08/characters/069-charlotte-linlin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-069 Charlotte Linlin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlotteLinlin069);
  });
});
