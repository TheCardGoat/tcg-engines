import { describe, test } from "vite-plus/test";
import { prb02KouzukiMomonosukeReprint107 } from "../../../../../cards/src/cards/PRB02/characters/107-kouzuki-momonosuke-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-107 Kouzuki Momonosuke (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02KouzukiMomonosukeReprint107);
  });
});
