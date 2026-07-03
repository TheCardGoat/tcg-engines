import { describe, test } from "vite-plus/test";
import { prb02RevolutionaryArmyHqPirateFoil021 } from "../../../../../cards/src/cards/PRB02/stages/021-revolutionary-army-hq-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-021 Revolutionary Army HQ (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02RevolutionaryArmyHqPirateFoil021);
  });
});
