import { describe, test } from "vite-plus/test";
import { prb02MaryGeoisePirateFoil097 } from "../../../../../cards/src/cards/PRB02/stages/097-mary-geoise-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-097 Mary Geoise (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02MaryGeoisePirateFoil097);
  });
});
