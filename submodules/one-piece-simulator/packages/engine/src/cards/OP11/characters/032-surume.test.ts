import { describe, test } from "vite-plus/test";
import { op11Surume032 } from "../../../../../cards/src/cards/OP11/characters/032-surume.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-032 Surume", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Surume032);
  });
});
