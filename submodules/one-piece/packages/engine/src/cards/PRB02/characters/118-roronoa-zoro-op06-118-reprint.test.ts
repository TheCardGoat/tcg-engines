import { describe, test } from "vite-plus/test";
import { prb02RoronoaZoroOp06118Reprint118 } from "../../../../../cards/src/cards/PRB02/characters/118-roronoa-zoro-op06-118-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-118 Roronoa Zoro - OP06-118 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02RoronoaZoroOp06118Reprint118);
  });
});
