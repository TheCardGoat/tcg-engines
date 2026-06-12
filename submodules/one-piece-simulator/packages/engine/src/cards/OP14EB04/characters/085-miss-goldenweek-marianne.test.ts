import { describe, test } from "vite-plus/test";
import { op14eb04MissGoldenweekMarianne085 } from "../../../../../cards/src/cards/OP14EB04/characters/085-miss-goldenweek-marianne.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-085 Miss.Goldenweek(Marianne)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04MissGoldenweekMarianne085);
  });
});
