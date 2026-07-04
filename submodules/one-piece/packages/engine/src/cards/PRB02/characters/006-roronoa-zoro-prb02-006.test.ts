import { describe, test } from "vite-plus/test";
import { prb02RoronoaZoroPrb02006006 } from "../../../../../cards/src/cards/PRB02/characters/006-roronoa-zoro-prb02-006.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-006 Roronoa Zoro - PRB02-006", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02RoronoaZoroPrb02006006);
  });
});
