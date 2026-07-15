import { describe, test } from "vite-plus/test";
import { op04RoronoaZoro015 } from "../../../../../cards/src/cards/OP04/characters/015-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-015 Roronoa Zoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04RoronoaZoro015);
  });
});
