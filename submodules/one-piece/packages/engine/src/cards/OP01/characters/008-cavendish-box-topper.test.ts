import { describe, test } from "vite-plus/test";
import { op01CavendishBoxTopper008 } from "../../../../../cards/src/cards/OP01/characters/008-cavendish-box-topper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-008 Cavendish (Box Topper)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01CavendishBoxTopper008);
  });
});
