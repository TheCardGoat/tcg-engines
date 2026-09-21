import { describe, test } from "vite-plus/test";
import { op03RobLucci071 } from "../../../../../cards/src/cards/characters/op03-071-rob-lucci.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-071 Rob Lucci", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03RobLucci071);
  });
});
