import { describe, test } from "vite-plus/test";
import { op13GolDRoger003 } from "../../../../../cards/src/cards/OP13/leaders/003-gol-d-roger.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-003 Gol.D.Roger", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13GolDRoger003);
  });
});
