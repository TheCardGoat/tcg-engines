import { describe, test } from "vite-plus/test";
import { op10ScratchmenApoo108 } from "../../../../../cards/src/cards/OP10/characters/108-scratchmen-apoo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-108 Scratchmen Apoo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10ScratchmenApoo108);
  });
});
