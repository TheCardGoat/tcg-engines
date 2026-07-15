import { describe, test } from "vite-plus/test";
import { op02Carrot029 } from "../../../../../cards/src/cards/OP02/characters/029-carrot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-029 Carrot", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Carrot029);
  });
});
