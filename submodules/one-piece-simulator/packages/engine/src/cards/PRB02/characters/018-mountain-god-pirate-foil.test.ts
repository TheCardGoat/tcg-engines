import { describe, test } from "vite-plus/test";
import { prb02MountainGodPirateFoil018 } from "../../../../../cards/src/cards/PRB02/characters/018-mountain-god-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-018 Mountain God (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02MountainGodPirateFoil018);
  });
});
