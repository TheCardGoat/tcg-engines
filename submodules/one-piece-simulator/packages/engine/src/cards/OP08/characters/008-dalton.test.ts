import { describe, test } from "vite-plus/test";
import { op08Dalton008 } from "../../../../../cards/src/cards/OP08/characters/008-dalton.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-008 Dalton", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Dalton008);
  });
});
