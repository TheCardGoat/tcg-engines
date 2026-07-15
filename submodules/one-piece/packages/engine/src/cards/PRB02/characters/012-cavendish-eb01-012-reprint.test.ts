import { describe, test } from "vite-plus/test";
import { prb02CavendishEb01012Reprint012 } from "../../../../../cards/src/cards/PRB02/characters/012-cavendish-eb01-012-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-012 Cavendish - EB01-012 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02CavendishEb01012Reprint012);
  });
});
