import { describe, test } from "vite-plus/test";
import { op11Mamboshi111 } from "../../../../../cards/src/cards/OP11/characters/111-mamboshi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-111 Mamboshi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Mamboshi111);
  });
});
