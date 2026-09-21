import { describe, test } from "vite-plus/test";
import { op03RobLucci076 } from "../../../../../cards/src/cards/leaders/op03-076-rob-lucci.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-076 Rob Lucci", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03RobLucci076);
  });
});
