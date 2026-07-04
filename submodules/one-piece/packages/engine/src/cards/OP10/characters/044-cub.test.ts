import { describe, test } from "vite-plus/test";
import { op10Cub044 } from "../../../../../cards/src/cards/OP10/characters/044-cub.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-044 Cub", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Cub044);
  });
});
