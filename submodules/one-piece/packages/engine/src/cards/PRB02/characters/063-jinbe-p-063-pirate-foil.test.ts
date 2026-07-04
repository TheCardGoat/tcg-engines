import { describe, test } from "vite-plus/test";
import { prb02JinbeP063PirateFoil063 } from "../../../../../cards/src/cards/PRB02/characters/063-jinbe-p-063-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-063 Jinbe - P-063 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02JinbeP063PirateFoil063);
  });
});
