import { describe, test } from "vite-plus/test";
import { prb02HePossessesTheWorldSMostBrilliantMindPirateFoil114 } from "../../../../../cards/src/cards/PRB02/events/114-he-possesses-the-world-s-most-brilliant-mind-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-114 He Possesses the World's Most Brilliant Mind (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02HePossessesTheWorldSMostBrilliantMindPirateFoil114);
  });
});
