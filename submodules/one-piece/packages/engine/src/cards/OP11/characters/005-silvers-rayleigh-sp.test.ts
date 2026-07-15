import { describe, test } from "vite-plus/test";
import { op11SilversRayleighSp005 } from "../../../../../cards/src/cards/OP11/characters/005-silvers-rayleigh-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-005 Silvers Rayleigh (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11SilversRayleighSp005);
  });
});
