import { describe, test } from "vite-plus/test";
import { prb02SaboOp09027PirateFoil027 } from "../../../../../cards/src/cards/PRB02/characters/027-sabo-op09-027-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-027 Sabo - OP09-027 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SaboOp09027PirateFoil027);
  });
});
