import { describe, test } from "vite-plus/test";
import { prb02MaynardPirateFoil052 } from "../../../../../cards/src/cards/PRB02/characters/052-maynard-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-052 Maynard (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02MaynardPirateFoil052);
  });
});
