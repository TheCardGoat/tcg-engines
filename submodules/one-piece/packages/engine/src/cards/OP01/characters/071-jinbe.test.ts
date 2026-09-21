import { describe, test } from "vite-plus/test";
import { op01Jinbe071 } from "../../../../../cards/src/cards/characters/op01-071-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-071 Jinbe", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Jinbe071);
  });
});
