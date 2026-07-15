import { describe, test } from "vite-plus/test";
import { prb01IceAgeTexturedFoil117 } from "../../../../../cards/src/cards/PRB01/events/117-ice-age-textured-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-117 Ice Age (Textured Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01IceAgeTexturedFoil117);
  });
});
