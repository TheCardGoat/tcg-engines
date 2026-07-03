import { describe, test } from "vite-plus/test";
import { op11Vito042 } from "../../../../../cards/src/cards/OP11/characters/042-vito.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-042 Vito", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Vito042);
  });
});
