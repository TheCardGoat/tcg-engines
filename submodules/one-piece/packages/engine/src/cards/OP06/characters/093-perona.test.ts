import { describe, test } from "vite-plus/test";
import { op06Perona093 } from "../../../../../cards/src/cards/characters/op06-093-perona.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-093 Perona", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Perona093);
  });
});
