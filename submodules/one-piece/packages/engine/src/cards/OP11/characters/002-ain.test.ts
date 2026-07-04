import { describe, test } from "vite-plus/test";
import { op11Ain002 } from "../../../../../cards/src/cards/OP11/characters/002-ain.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-002 Ain", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Ain002);
  });
});
