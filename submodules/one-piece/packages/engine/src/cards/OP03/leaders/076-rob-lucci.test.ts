import { describe, test } from "vite-plus/test";
import { op03RobLucci076 } from "../../../../../cards/src/cards/OP03/leaders/076-rob-lucci.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-076 Rob Lucci", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03RobLucci076);
  });
});
