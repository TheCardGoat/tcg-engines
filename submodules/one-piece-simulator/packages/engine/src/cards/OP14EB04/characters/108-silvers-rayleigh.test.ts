import { describe, test } from "vite-plus/test";
import { op14eb04SilversRayleigh108 } from "../../../../../cards/src/cards/OP14EB04/characters/108-silvers-rayleigh.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-108 Silvers Rayleigh", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04SilversRayleigh108);
  });
});
