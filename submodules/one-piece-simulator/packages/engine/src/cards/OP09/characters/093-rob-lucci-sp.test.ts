import { describe, test } from "vite-plus/test";
import { op09RobLucciSp093 } from "../../../../../cards/src/cards/OP09/characters/093-rob-lucci-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-093 Rob Lucci (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09RobLucciSp093);
  });
});
