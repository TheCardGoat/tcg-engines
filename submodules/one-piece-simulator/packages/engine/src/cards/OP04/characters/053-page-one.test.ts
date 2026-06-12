import { describe, test } from "vite-plus/test";
import { op04PageOne053 } from "../../../../../cards/src/cards/OP04/characters/053-page-one.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-053 Page One", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04PageOne053);
  });
});
