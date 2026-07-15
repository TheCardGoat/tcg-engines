import { describe, test } from "vite-plus/test";
import { prb02RoronoaZoroOp09076076 } from "../../../../../cards/src/cards/PRB02/characters/076-roronoa-zoro-op09-076.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-076 Roronoa Zoro - OP09-076", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02RoronoaZoroOp09076076);
  });
});
