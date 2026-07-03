import { describe, test } from "vite-plus/test";
import { op11Pedro057 } from "../../../../../cards/src/cards/OP11/characters/057-pedro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-057 Pedro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Pedro057);
  });
});
