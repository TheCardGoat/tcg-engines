import { describe, test } from "vite-plus/test";
import { op01Perona077 } from "../../../../../cards/src/cards/characters/op01-077-perona.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-077 Perona", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Perona077);
  });
});
