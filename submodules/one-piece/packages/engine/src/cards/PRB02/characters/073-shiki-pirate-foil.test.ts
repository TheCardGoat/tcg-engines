import { describe, test } from "vite-plus/test";
import { prb02ShikiPirateFoil073 } from "../../../../../cards/src/cards/PRB02/characters/073-shiki-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-073 Shiki (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02ShikiPirateFoil073);
  });
});
