import { describe, test } from "vite-plus/test";
import { op04MissGoldenweekMarianne065 } from "../../../../../cards/src/cards/OP04/characters/065-miss-goldenweek-marianne.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-065 Miss.Goldenweek(Marianne)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04MissGoldenweekMarianne065);
  });
});
