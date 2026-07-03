import { describe, test } from "vite-plus/test";
import { prb02SengokuOp06049PirateFoil049 } from "../../../../../cards/src/cards/PRB02/characters/049-sengoku-op06-049-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-049 Sengoku - OP06-049 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SengokuOp06049PirateFoil049);
  });
});
