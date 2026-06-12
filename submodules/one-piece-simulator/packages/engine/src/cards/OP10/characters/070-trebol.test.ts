import { describe, test } from "vite-plus/test";
import { op10Trebol070 } from "../../../../../cards/src/cards/OP10/characters/070-trebol.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-070 Trebol", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Trebol070);
  });
});
