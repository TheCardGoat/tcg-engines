import { describe, test } from "vite-plus/test";
import { op03RobLucci092 } from "../../../../../cards/src/cards/OP03/characters/092-rob-lucci.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-092 Rob Lucci", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03RobLucci092);
  });
});
