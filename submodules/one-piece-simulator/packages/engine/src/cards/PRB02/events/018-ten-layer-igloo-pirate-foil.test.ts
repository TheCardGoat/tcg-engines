import { describe, test } from "vite-plus/test";
import { prb02TenLayerIglooPirateFoil018 } from "../../../../../cards/src/cards/PRB02/events/018-ten-layer-igloo-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-018 Ten-Layer Igloo (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02TenLayerIglooPirateFoil018);
  });
});
