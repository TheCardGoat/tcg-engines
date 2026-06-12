import { describe, test } from "vite-plus/test";
import { prb02GumGumLightningPirateFoil077 } from "../../../../../cards/src/cards/PRB02/events/077-gum-gum-lightning-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-077 Gum-Gum Lightning (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02GumGumLightningPirateFoil077);
  });
});
