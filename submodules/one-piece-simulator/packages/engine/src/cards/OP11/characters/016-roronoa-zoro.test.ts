import { describe, test } from "vite-plus/test";
import { op11RoronoaZoro016 } from "../../../../../cards/src/cards/OP11/characters/016-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-016 Roronoa Zoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11RoronoaZoro016);
  });
});
