import { describe, test } from "vite-plus/test";
import { prb02GumGumJumpRopePirateFoil079 } from "../../../../../cards/src/cards/PRB02/events/079-gum-gum-jump-rope-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-079 Gum-Gum Jump Rope (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02GumGumJumpRopePirateFoil079);
  });
});
