import { describe, test } from "vite-plus/test";
import { op13RoronoaZoro037 } from "../../../../../cards/src/cards/OP13/characters/037-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-037 Roronoa Zoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13RoronoaZoro037);
  });
});
