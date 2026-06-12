import { describe, test } from "vite-plus/test";
import { prb02CavendishOp10105PirateFoil105 } from "../../../../../cards/src/cards/PRB02/characters/105-cavendish-op10-105-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-105 Cavendish - OP10-105 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02CavendishOp10105PirateFoil105);
  });
});
