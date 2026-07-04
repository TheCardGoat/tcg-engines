import { describe, test } from "vite-plus/test";
import { prb02TheThreeBrothersBondPirateFoil019 } from "../../../../../cards/src/cards/PRB02/events/019-the-three-brothers-bond-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST13-019 The Three Brothers' Bond (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02TheThreeBrothersBondPirateFoil019);
  });
});
