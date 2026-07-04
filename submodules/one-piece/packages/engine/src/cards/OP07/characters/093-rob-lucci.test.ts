import { describe, test } from "vite-plus/test";
import { op07RobLucci093 } from "../../../../../cards/src/cards/OP07/characters/093-rob-lucci.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-093 Rob Lucci", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07RobLucci093);
  });
});
