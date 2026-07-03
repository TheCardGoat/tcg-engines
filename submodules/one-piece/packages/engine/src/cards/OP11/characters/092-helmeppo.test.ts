import { describe, test } from "vite-plus/test";
import { op11Helmeppo092 } from "../../../../../cards/src/cards/OP11/characters/092-helmeppo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-092 Helmeppo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Helmeppo092);
  });
});
