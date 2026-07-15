import { describe, test } from "vite-plus/test";
import { prb02EmporioIvankovPirateFoil004 } from "../../../../../cards/src/cards/PRB02/characters/004-emporio-ivankov-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-004 Emporio.Ivankov (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02EmporioIvankovPirateFoil004);
  });
});
