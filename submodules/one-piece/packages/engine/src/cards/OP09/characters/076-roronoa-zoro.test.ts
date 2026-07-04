import { describe, test } from "vite-plus/test";
import { op09RoronoaZoro076 } from "../../../../../cards/src/cards/OP09/characters/076-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-076 Roronoa Zoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09RoronoaZoro076);
  });
});
