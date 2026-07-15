import { describe, test } from "vite-plus/test";
import { prb02TonyTonyChopperReprint011 } from "../../../../../cards/src/cards/PRB02/characters/011-tony-tony-chopper-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-011 Tony Tony.Chopper (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02TonyTonyChopperReprint011);
  });
});
