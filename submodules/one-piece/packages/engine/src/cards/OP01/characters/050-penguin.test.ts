import { describe, test } from "vite-plus/test";
import { op01Penguin050 } from "../../../../../cards/src/cards/OP01/characters/050-penguin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-050 Penguin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Penguin050);
  });
});
