import { describe, test } from "vite-plus/test";
import { op01RoronoaZoro025 } from "../../../../../cards/src/cards/characters/op01-025-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-025 Roronoa Zoro", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01RoronoaZoro025);
  });
});
