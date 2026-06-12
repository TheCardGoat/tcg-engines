import { describe, test } from "vite-plus/test";
import { op09Mohji053 } from "../../../../../cards/src/cards/OP09/characters/053-mohji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-053 Mohji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Mohji053);
  });
});
