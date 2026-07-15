import { describe, test } from "vite-plus/test";
import { prb02ItSToDieForPirateFoil076 } from "../../../../../cards/src/cards/PRB02/events/076-it-s-to-die-for-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-076 It's to Die For (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02ItSToDieForPirateFoil076);
  });
});
