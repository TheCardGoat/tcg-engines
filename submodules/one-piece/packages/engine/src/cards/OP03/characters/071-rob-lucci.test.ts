import { describe, test } from "vite-plus/test";
import { op03RobLucci071 } from "../../../../../cards/src/cards/OP03/characters/071-rob-lucci.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-071 Rob Lucci", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03RobLucci071);
  });
});
