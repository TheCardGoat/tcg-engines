import { describe, test } from "vite-plus/test";
import { op10RoronoaZoro095 } from "../../../../../cards/src/cards/OP10/characters/095-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-095 Roronoa Zoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10RoronoaZoro095);
  });
});
