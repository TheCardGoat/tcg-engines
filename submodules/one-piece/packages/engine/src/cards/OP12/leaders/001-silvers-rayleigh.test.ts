import { describe, test } from "vite-plus/test";
import { op12SilversRayleigh001 } from "../../../../../cards/src/cards/leaders/op12-001-silvers-rayleigh.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-001 Silvers Rayleigh", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12SilversRayleigh001);
  });
});
