import { describe, test } from "vite-plus/test";
import { op11Franky012 } from "../../../../../cards/src/cards/OP11/characters/012-franky.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-012 Franky", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Franky012);
  });
});
