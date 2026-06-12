import { describe, test } from "vite-plus/test";
import { op14eb04RoronoaZoroPrb02006Sp006 } from "../../../../../cards/src/cards/OP14EB04/characters/006-roronoa-zoro-prb02-006-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-006 Roronoa Zoro - PRB02-006 (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04RoronoaZoroPrb02006Sp006);
  });
});
