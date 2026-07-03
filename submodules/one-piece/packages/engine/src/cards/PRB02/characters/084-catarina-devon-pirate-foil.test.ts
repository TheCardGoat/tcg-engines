import { describe, test } from "vite-plus/test";
import { prb02CatarinaDevonPirateFoil084 } from "../../../../../cards/src/cards/PRB02/characters/084-catarina-devon-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-084 Catarina Devon (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02CatarinaDevonPirateFoil084);
  });
});
