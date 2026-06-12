import { describe, test } from "vite-plus/test";
import { prb02JewelryBonneyOp07026Reprint026 } from "../../../../../cards/src/cards/PRB02/characters/026-jewelry-bonney-op07-026-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-026 Jewelry Bonney - OP07-026 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02JewelryBonneyOp07026Reprint026);
  });
});
