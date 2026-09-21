import { describe, test } from "vite-plus/test";
import { eb02TonyTonyChopper003 } from "../../../../../cards/src/cards/characters/eb02-003-tony-tony-chopper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-003 Tony Tony.Chopper", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02TonyTonyChopper003);
  });
});
