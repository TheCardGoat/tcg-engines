import { describe, test } from "vite-plus/test";
import { op07RoronoaZoro113 } from "../../../../../cards/src/cards/OP07/characters/113-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-113 Roronoa Zoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07RoronoaZoro113);
  });
});
