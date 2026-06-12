import { describe, test } from "vite-plus/test";
import { op13TerryGilteo088 } from "../../../../../cards/src/cards/OP13/characters/088-terry-gilteo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-088 Terry Gilteo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13TerryGilteo088);
  });
});
