import { describe, test } from "vite-plus/test";
import { op08SilversRayleigh118 } from "../../../../../cards/src/cards/OP08/characters/118-silvers-rayleigh.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-118 Silvers Rayleigh", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08SilversRayleigh118);
  });
});
