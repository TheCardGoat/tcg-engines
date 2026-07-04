import { describe, test } from "vite-plus/test";
import { op08ScratchmenApoo087 } from "../../../../../cards/src/cards/OP08/characters/087-scratchmen-apoo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-087 Scratchmen Apoo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08ScratchmenApoo087);
  });
});
