import { describe, test } from "vite-plus/test";
import { prb02RoronoaZoroOp10095Reprint095 } from "../../../../../cards/src/cards/PRB02/characters/095-roronoa-zoro-op10-095-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-095 Roronoa Zoro - OP10-095 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02RoronoaZoroOp10095Reprint095);
  });
});
