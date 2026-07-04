import { describe, test } from "vite-plus/test";
import { prb01JudgmentOfHellJollyRogerFoil089 } from "../../../../../cards/src/cards/PRB01/events/089-judgment-of-hell-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-089 Judgment of Hell (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01JudgmentOfHellJollyRogerFoil089);
  });
});
