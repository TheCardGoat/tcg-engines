import { describe, test } from "vite-plus/test";
import { op09GolDRoger118 } from "../../../../../cards/src/cards/OP09/characters/118-gol-d-roger.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-118 Gol.D.Roger", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09GolDRoger118);
  });
});
