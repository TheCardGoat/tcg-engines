import { describe, test } from "vite-plus/test";
import { op01Perona077 } from "../../../../../cards/src/cards/OP01/characters/077-perona.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-077 Perona", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Perona077);
  });
});
