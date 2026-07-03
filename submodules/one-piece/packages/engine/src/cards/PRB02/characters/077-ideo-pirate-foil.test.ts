import { describe, test } from "vite-plus/test";
import { prb02IdeoPirateFoil077 } from "../../../../../cards/src/cards/PRB02/characters/077-ideo-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-077 Ideo (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02IdeoPirateFoil077);
  });
});
