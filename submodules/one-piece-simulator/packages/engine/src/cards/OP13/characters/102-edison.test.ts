import { describe, test } from "vite-plus/test";
import { op13Edison102 } from "../../../../../cards/src/cards/OP13/characters/102-edison.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-102 Edison", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Edison102);
  });
});
