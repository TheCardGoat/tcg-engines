import { describe, test } from "vite-plus/test";
import { op08King057 } from "../../../../../cards/src/cards/OP08/leaders/057-king.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-057 King", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08King057);
  });
});
