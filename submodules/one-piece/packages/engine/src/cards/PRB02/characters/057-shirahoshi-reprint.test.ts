import { describe, test } from "vite-plus/test";
import { prb02ShirahoshiReprint057 } from "../../../../../cards/src/cards/PRB02/characters/057-shirahoshi-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-057 Shirahoshi (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02ShirahoshiReprint057);
  });
});
