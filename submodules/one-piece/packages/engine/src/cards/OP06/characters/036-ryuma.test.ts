import { describe, test } from "vite-plus/test";
import { op06Ryuma036 } from "../../../../../cards/src/cards/characters/op06-036-ryuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-036 Ryuma", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Ryuma036);
  });
});
