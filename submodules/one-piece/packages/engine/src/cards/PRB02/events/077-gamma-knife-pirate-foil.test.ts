import { describe, test } from "vite-plus/test";
import { prb02GammaKnifePirateFoil077 } from "../../../../../cards/src/cards/PRB02/events/077-gamma-knife-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-077 Gamma Knife (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02GammaKnifePirateFoil077);
  });
});
