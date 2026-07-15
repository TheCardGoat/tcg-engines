import { describe, test } from "vite-plus/test";
import { op07RobLucci079 } from "../../../../../cards/src/cards/OP07/leaders/079-rob-lucci.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-079 Rob Lucci", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07RobLucci079);
  });
});
