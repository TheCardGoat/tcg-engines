import { describe, test } from "vite-plus/test";
import { op10Bian053 } from "../../../../../cards/src/cards/OP10/characters/053-bian.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-053 Bian", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Bian053);
  });
});
