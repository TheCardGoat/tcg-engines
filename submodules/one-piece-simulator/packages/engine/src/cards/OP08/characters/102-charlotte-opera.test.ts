import { describe, test } from "vite-plus/test";
import { op08CharlotteOpera102 } from "../../../../../cards/src/cards/OP08/characters/102-charlotte-opera.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-102 Charlotte Opera", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlotteOpera102);
  });
});
