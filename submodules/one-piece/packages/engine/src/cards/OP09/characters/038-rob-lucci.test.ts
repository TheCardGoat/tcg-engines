import { describe, test } from "vite-plus/test";
import { op09RobLucci038 } from "../../../../../cards/src/cards/characters/op09-038-rob-lucci.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-038 Rob Lucci", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09RobLucci038);
  });
});
