import { describe, test } from "vite-plus/test";
import { prb02HitokiriKamazoPirateFoil076 } from "../../../../../cards/src/cards/PRB02/characters/076-hitokiri-kamazo-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-076 Hitokiri Kamazo (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02HitokiriKamazoPirateFoil076);
  });
});
