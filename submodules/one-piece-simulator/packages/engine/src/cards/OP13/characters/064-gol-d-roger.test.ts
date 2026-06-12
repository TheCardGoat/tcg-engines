import { describe, test } from "vite-plus/test";
import { op13GolDRoger064 } from "../../../../../cards/src/cards/OP13/characters/064-gol-d-roger.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-064 Gol.D.Roger", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13GolDRoger064);
  });
});
