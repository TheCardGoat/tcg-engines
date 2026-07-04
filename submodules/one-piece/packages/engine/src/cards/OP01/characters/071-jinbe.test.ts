import { describe, test } from "vite-plus/test";
import { op01Jinbe071 } from "../../../../../cards/src/cards/OP01/characters/071-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-071 Jinbe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Jinbe071);
  });
});
