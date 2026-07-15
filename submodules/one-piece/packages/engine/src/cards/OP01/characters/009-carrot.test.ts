import { describe, test } from "vite-plus/test";
import { op01Carrot009 } from "../../../../../cards/src/cards/OP01/characters/009-carrot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-009 Carrot", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Carrot009);
  });
});
