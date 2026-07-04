import { describe, test } from "vite-plus/test";
import { prb02IHaveMyCrewPirateFoil016 } from "../../../../../cards/src/cards/PRB02/events/016-i-have-my-crew-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST14-016 I Have My Crew!! (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02IHaveMyCrewPirateFoil016);
  });
});
