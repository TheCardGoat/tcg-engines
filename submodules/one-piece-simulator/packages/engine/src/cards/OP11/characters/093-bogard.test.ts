import { describe, test } from "vite-plus/test";
import { op11Bogard093 } from "../../../../../cards/src/cards/OP11/characters/093-bogard.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-093 Bogard", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Bogard093);
  });
});
