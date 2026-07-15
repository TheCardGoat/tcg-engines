import { describe, test } from "vite-plus/test";
import { prb02XDrakePirateFoil114 } from "../../../../../cards/src/cards/PRB02/characters/114-x-drake-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-114 X.Drake (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02XDrakePirateFoil114);
  });
});
