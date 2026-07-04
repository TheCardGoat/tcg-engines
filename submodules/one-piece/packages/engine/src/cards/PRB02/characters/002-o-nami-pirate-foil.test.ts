import { describe, test } from "vite-plus/test";
import { prb02ONamiPirateFoil002 } from "../../../../../cards/src/cards/PRB02/characters/002-o-nami-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST18-002 O-Nami (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02ONamiPirateFoil002);
  });
});
