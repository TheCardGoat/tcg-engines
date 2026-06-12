import { describe, test } from "vite-plus/test";
import { op12SilversRayleigh001 } from "../../../../../cards/src/cards/OP12/leaders/001-silvers-rayleigh.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-001 Silvers Rayleigh", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12SilversRayleigh001);
  });
});
