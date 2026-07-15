import { describe, test } from "vite-plus/test";
import { op14eb04RoronoaZoroOp14015015 } from "../../../../../cards/src/cards/OP14EB04/characters/015-roronoa-zoro-op14-015.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-015 Roronoa Zoro - OP14-015", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04RoronoaZoroOp14015015);
  });
});
