import { describe, test } from "vite-plus/test";
import { op05RobLucci093 } from "../../../../../cards/src/cards/OP05/characters/093-rob-lucci.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-093 Rob Lucci", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05RobLucci093);
  });
});
