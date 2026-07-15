import { describe, test } from "vite-plus/test";
import { op08King060 } from "../../../../../cards/src/cards/OP08/characters/060-king.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-060 King", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08King060);
  });
});
