import { describe, test } from "vite-plus/test";
import { op05RobLucciSp092 } from "../../../../../cards/src/cards/OP05/characters/092-rob-lucci-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-092 Rob Lucci (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05RobLucciSp092);
  });
});
