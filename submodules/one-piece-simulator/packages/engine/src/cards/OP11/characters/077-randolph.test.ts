import { describe, test } from "vite-plus/test";
import { op11Randolph077 } from "../../../../../cards/src/cards/OP11/characters/077-randolph.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-077 Randolph", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Randolph077);
  });
});
