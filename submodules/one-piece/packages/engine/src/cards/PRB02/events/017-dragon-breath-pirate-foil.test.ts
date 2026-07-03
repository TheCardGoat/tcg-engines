import { describe, test } from "vite-plus/test";
import { prb02DragonBreathPirateFoil017 } from "../../../../../cards/src/cards/PRB02/events/017-dragon-breath-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-017 Dragon Breath (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02DragonBreathPirateFoil017);
  });
});
