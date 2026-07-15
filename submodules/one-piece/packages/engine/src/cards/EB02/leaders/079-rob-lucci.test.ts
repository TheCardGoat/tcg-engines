import { describe, test } from "vite-plus/test";
import { eb02RobLucci079 } from "../../../../../cards/src/cards/EB02/leaders/079-rob-lucci.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-079 Rob Lucci", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02RobLucci079);
  });
});
