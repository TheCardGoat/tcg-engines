import { describe, test } from "vite-plus/test";
import { prb02LaboonReprint048 } from "../../../../../cards/src/cards/PRB02/characters/048-laboon-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-048 Laboon (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02LaboonReprint048);
  });
});
