import { describe, test } from "vite-plus/test";
import { eb01TonyTonyChopper006 } from "../../../../../cards/src/cards/EB01/characters/006-tony-tony-chopper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-006 Tony Tony.Chopper", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01TonyTonyChopper006);
  });
});
